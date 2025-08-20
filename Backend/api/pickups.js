const express = require("express");
const router = express.Router();
router.use(express.json());
const multer = require("multer");
const prisma = require("../prisma");
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp'); // Import the sharp library

const verifyToken = require("../verify");

// Configure Multer for disk storage
const mountPath = '/mnt/disks/data';
const uploadSubdirectory = 'uploads';
const diskStoragePath = path.join(mountPath, uploadSubdirectory);

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            await fs.mkdir(diskStoragePath, { recursive: true });
            cb(null, diskStoragePath);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    }
});

const upload = multer({ storage: storage }).array('images', 10);
const uploadSingle = multer({ storage: storage }).single('image');

// Get list of all pickups
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const pickups = await prisma.pickup.findMany();
        res.json(pickups);
    } catch {
        next();
    }
});

// Get a specific pickup
router.get("/:id", verifyToken, async (req, res, next) => {
    try {
        const id = +req.params.id;

        const pickup = await prisma.pickup.findUnique({ where: { id } });

        if (!pickup) {
            return next({
                status: 404,
                message: `Could not find pickup with id ${id}.`,
            });
        }

        res.json(pickup);
    } catch {
        next();
    }
});

// Add a new pickup
router.post("/", verifyToken, upload, async (req, res, next) => {
    try {
        const { name, phoneNumber, items, notes, pickupDate } = req.body;
        const images = []; // Array to store processed image filenames

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = file.originalname.split('.').pop();
                const baseFileName = file.fieldname + '-' + uniqueSuffix;
                const fullFileName = `${baseFileName}.${fileExtension}`;
                const thumbFileName = `thumb_${baseFileName}.${fileExtension}`;


                // Resize and save using sharp
                await sharp(file.path)
                    .resize({ width: 800 }) // Example: Medium size - Adjust as needed
                    .toFile(path.join(diskStoragePath, fullFileName));

                await sharp(file.path)
                    .resize({ width: 200 }) // Example: Thumbnail size - Adjust as needed
                    .toFile(path.join(diskStoragePath, thumbFileName));

                images.push(fullFileName); // Store the filename of the medium image
            }
        }

        const date = new Date(pickupDate);

        if (!name || !phoneNumber || !items || !notes || !pickupDate) {
            const error = {
                status: 400,
                message: "Pick Up is missing essential information.",
            };
            return next(error);
        }

        const pickup = await prisma.pickup.create({
            data: { name, phoneNumber, items, images, notes, pickupDate: date },
        });
        console.log(pickup);
        res.status(201).json(pickup);
    } catch (error) {
        console.error("Error creating pickup:", error);
        next(error);
    }
});

// Delete pickup
router.delete("/:id", verifyToken, async (req, res, next) => {
    try {
        const id = +req.params.id;

        const pickupExists = await prisma.pickup.findUnique({ where: { id } });
        if (!pickupExists) {
            return next({
                status: 404,
                message: `Could not find pickup with id ${id}.`,
            });
        }

        await prisma.pickup.delete({ where: { id } });

        res.sendStatus(204);
    } catch {
        next();
    }
});

const uploadNewImages = multer({ storage: storage }).array('newImages', 5); // For adding new images

// Update pickup
router.put("/:id", verifyToken, uploadNewImages, async (req, res, next) => {
    try {
        const id = +req.params.id;

        const pickupExists = await prisma.pickup.findUnique({ where: { id } });
        if (!pickupExists) {
            return next({ status: 404, message: `Could not find pickup with id ${id}.` });
        }

        const { name, phoneNumber, items, notes, pickupDate, existingImages } = req.body;
        const newImageFiles = req.files || [];
        const newImageFilenames = [];


        if (newImageFiles && newImageFiles.length > 0) {
            for (const file of newImageFiles) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = file.originalname.split('.').pop();
                const baseFileName =  `newImage-${uniqueSuffix}`;
                const fullFileName = `${baseFileName}.${fileExtension}`;
                const thumbFileName = `thumb_${baseFileName}.${fileExtension}`;

                await sharp(file.path)
                    .resize({ width: 800 })
                    .toFile(path.join(diskStoragePath, fullFileName));
                await sharp(file.path)
                    .resize({ width: 200 })
                    .toFile(path.join(diskStoragePath, thumbFileName));
                newImageFilenames.push(fullFileName);
            }
        }
        const date = new Date(pickupDate);
        const imagesToKeep = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);
        const finalImages = [...imagesToKeep, ...newImageFilenames];

        if (!name || !phoneNumber || !items || !pickupDate) {
            return next({ status: 400, message: "Pickup is missing essential information." });
        }



        const pickup = await prisma.pickup.update({
            where: { id },
            data: { name, phoneNumber, items, images: finalImages, notes, pickupDate: date },
        });

        res.json(pickup);
    } catch (error) {
        console.error("Error updating pickup:", error);
        next(error);
    }
});

// Convert pickup to delivery
router.post("/:id/convert-to-delivery", verifyToken, async (req, res, next) => {
  try {
    const pickupId = +req.params.id;
    
    // Get the pickup data
    const pickup = await prisma.pickup.findUnique({ 
      where: { id: pickupId } 
    });
    
    if (!pickup) {
      return next({
        status: 404,
        message: `Could not find pickup with id ${pickupId}.`,
      });
    }

    // Create delivery from pickup data
    const delivery = await prisma.delivery.create({
      data: {
        name: pickup.name,
        phoneNumber: pickup.phoneNumber,
        address: "", // Will need to be filled in later
        items: pickup.items,
        images: pickup.images, // Copy the same images
        notes: `Converted from pickup on ${new Date().toLocaleDateString()}. Original notes: ${pickup.notes || 'No notes'}`,
        deliveryDate: new Date(), // Default to today
      },
    });

    console.log(`Pickup ${pickupId} converted to delivery ${delivery.id}`);
    res.status(201).json(delivery);
  } catch (error) {
    console.error("Error converting pickup to delivery:", error);
    next(error);
  }
});

module.exports = router;

