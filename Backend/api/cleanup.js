const express = require("express");
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const prisma = require("../prisma");
const verifyToken = require("../verify");

// Configure your upload directory path
const uploadDirectory = '/mnt/disks/data/uploads';

// Helper function to format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Analyze images endpoint - shows what can be cleaned up
router.get("/analyze", verifyToken, async (req, res, next) => {
    try {
        console.log('🔍 Starting image file analysis...');
        
        // Step 1: Get all legitimate images from database
        const pickups = await prisma.pickup.findMany({
            where: { 
                NOT: { images: { isEmpty: true } }
            },
            select: { id: true, name: true, images: true }
        });
        
        const deliveries = await prisma.delivery.findMany({
            where: { 
                NOT: { images: { isEmpty: true } }
            },
            select: { id: true, name: true, images: true }
        });
        
        // Collect all legitimate image filenames
        const legitimateImages = new Set();
        
        pickups.forEach(pickup => {
            if (pickup.images) {
                pickup.images.forEach(image => {
                    legitimateImages.add(image);
                    // Also add thumbnail versions
                    const thumbName = `thumb_${image}`;
                    legitimateImages.add(thumbName);
                });
            }
        });
        
        deliveries.forEach(delivery => {
            if (delivery.images) {
                delivery.images.forEach(image => {
                    legitimateImages.add(image);
                    // Also add thumbnail versions
                    const thumbName = `thumb_${image}`;
                    legitimateImages.add(thumbName);
                });
            }
        });
        
        // Step 2: Scan upload directory
        let allFiles;
        try {
            allFiles = await fs.readdir(uploadDirectory);
        } catch (error) {
            return res.status(500).json({
                error: `Could not read upload directory: ${error.message}`,
                uploadDirectory: uploadDirectory
            });
        }
        
        // Filter only image files
        const imageFiles = allFiles.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
        });
        
        // Step 3: Find orphaned files and calculate sizes
        const orphanedFiles = [];
        const legitimateFilesFound = [];
        let totalSize = 0;
        let orphanedSize = 0;
        
        for (const file of imageFiles) {
            const filePath = path.join(uploadDirectory, file);
            let fileSize = 0;
            
            try {
                const stats = await fs.stat(filePath);
                fileSize = stats.size;
                totalSize += fileSize;
            } catch (error) {
                console.log(`Could not get size for ${file}`);
            }
            
            if (legitimateImages.has(file)) {
                legitimateFilesFound.push({ file, size: fileSize, formatted: formatBytes(fileSize) });
            } else {
                orphanedFiles.push({ file, size: fileSize, formatted: formatBytes(fileSize) });
                orphanedSize += fileSize;
            }
        }
        
        // Return analysis results
        const analysis = {
            summary: {
                totalFiles: imageFiles.length,
                legitimateFiles: legitimateFilesFound.length,
                orphanedFiles: orphanedFiles.length,
                totalSize: formatBytes(totalSize),
                orphanedSize: formatBytes(orphanedSize),
                spaceSavingsPercent: totalSize > 0 ? ((orphanedSize / totalSize) * 100).toFixed(1) : 0
            },
            legitimateFiles: legitimateFilesFound,
            orphanedFiles: orphanedFiles.slice(0, 50), // Limit to first 50 for display
            hasMoreOrphaned: orphanedFiles.length > 50,
            databaseRecords: {
                pickups: pickups.length,
                deliveries: deliveries.length,
                totalImagesInDB: Array.from(legitimateImages).length
            }
        };
        
        res.json(analysis);
        
    } catch (error) {
        console.error('Error during analysis:', error);
        res.status(500).json({ error: error.message });
    }
});

// Batch cleanup endpoint - deletes orphaned files in small batches
router.post("/cleanup", verifyToken, async (req, res, next) => {
    try {
        const { confirm, batchSize = 100 } = req.body;
        
        if (!confirm) {
            return res.status(400).json({ 
                error: "Cleanup requires confirmation. Send { \"confirm\": true } in request body." 
            });
        }
        
        console.log(`🗑️ Starting batch cleanup (${batchSize} files at a time)...`);
        
        // Get all legitimate images from database
        const pickups = await prisma.pickup.findMany({
            where: { NOT: { images: { isEmpty: true } } },
            select: { images: true }
        });
        
        const deliveries = await prisma.delivery.findMany({
            where: { NOT: { images: { isEmpty: true } } },
            select: { images: true }
        });
        
        // Collect all legitimate image filenames
        const legitimateImages = new Set();
        
        [...pickups, ...deliveries].forEach(record => {
            if (record.images) {
                record.images.forEach(image => {
                    legitimateImages.add(image);
                    legitimateImages.add(`thumb_${image}`);
                });
            }
        });
        
        // Get all files in upload directory
        const allFiles = await fs.readdir(uploadDirectory);
        const imageFiles = allFiles.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
        });
        
        // Find orphaned files
        const orphanedFiles = [];
        for (const file of imageFiles) {
            if (!legitimateImages.has(file)) {
                const filePath = path.join(uploadDirectory, file);
                try {
                    const stats = await fs.stat(filePath);
                    orphanedFiles.push({ file, size: stats.size });
                } catch (error) {
                    // File might have been deleted already, skip it
                }
            }
        }
        
        if (orphanedFiles.length === 0) {
            return res.json({
                success: true,
                message: "No orphaned files found to clean up!",
                deletedCount: 0,
                freedSpace: "0 Bytes"
            });
        }
        
        // Delete in batches
        const filesToDelete = orphanedFiles.slice(0, batchSize);
        let deletedCount = 0;
        let deletedSize = 0;
        let errorCount = 0;
        const errors = [];
        
        for (const { file, size } of filesToDelete) {
            try {
                const filePath = path.join(uploadDirectory, file);
                await fs.unlink(filePath);
                deletedCount++;
                deletedSize += size;
                console.log(`Deleted: ${file}`);
            } catch (error) {
                errorCount++;
                errors.push(`${file}: ${error.message}`);
                console.log(`Error deleting ${file}: ${error.message}`);
            }
        }
        
        const remainingOrphaned = orphanedFiles.length - filesToDelete.length;
        
        res.json({
            success: true,
            message: `Batch cleanup completed! ${remainingOrphaned} files remaining.`,
            deletedCount,
            errorCount,
            freedSpace: formatBytes(deletedSize),
            remainingOrphanedFiles: remainingOrphaned,
            totalOrphanedFiles: orphanedFiles.length,
            needsMoreBatches: remainingOrphaned > 0,
            errors: errors.slice(0, 5)
        });
        
    } catch (error) {
        console.error('Error during cleanup:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;