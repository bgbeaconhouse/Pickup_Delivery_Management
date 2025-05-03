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

// Get list of all deliveries
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const deliveries = await prisma.delivery.findMany();
        res.json(deliveries);
    } catch {
        next();
    }
});

// Get a specific delivery
router.get("/:id", verifyToken, async (req, res, next) => {
    try {
        const id = +req.params.id;

        const delivery = await prisma.delivery.findUnique({ where: { id } });

        if (!delivery) {
            return next({
                status: 404,
                message: `Could not find delivery with id ${id}.`,
            });
        }

        res.json(delivery);
    } catch {
        next();
    }
});

// Add a new delivery
router.post("/", verifyToken, upload, async (req, res, next) => {
    try {
        const { name, phoneNumber, address, items, notes, deliveryDate } = req.body;
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

        const date = new Date(deliveryDate);

        if (!name || !phoneNumber || !address || !items || !notes || !deliveryDate) {
            const error = {
                status: 400,
                message: "Delivery is missing essential information.",
            };
            return next(error);
        }

        const delivery = await prisma.delivery.create({
            data: { name, phoneNumber, address, items, images, notes, deliveryDate: date },
        });
        console.log(delivery);
        res.status(201).json(delivery);
    } catch (error) {
        console.error("Error creating delivery:", error);
        next(error); // Pass the error to the error handling middleware
    }
});

// Delete pickup
router.delete("/:id", verifyToken, async (req, res, next) => {

    try {
        const id = +req.params.id;

        const deliveryExists = await prisma.delivery.findUnique({ where: { id } });
        if (!deliveryExists) {
            return next({
                status: 404,
                message: `Could not find delivery with id ${id}.`,
            });
        }

        await prisma.delivery.delete({ where: { id } });

        res.sendStatus(204);
    } catch {
        next();
    }
});

const uploadNewImages = multer({ storage: storage }).array('newImages', 5);
// Update pickup
router.put("/:id", verifyToken, uploadNewImages, async (req, res, next) => {
    try {
        const id = +req.params.id;

        const deliveryExists = await prisma.delivery.findUnique({ where: { id } });
        if (!deliveryExists) {
            return next({
                status: 404,
                message: `Could not find delivery with id ${id}.`,
            });
        }

        const { name, phoneNumber, address, items, notes, deliveryDate, existingImages } = req.body;
        const newImageFiles = req.files || [];
        const newImageFilenames = [];

        if (newImageFiles && newImageFiles.length > 0) {
            for (const file of newImageFiles) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = file.originalname.split('.').pop();
                const baseFileName = `newImage-${uniqueSuffix}`;
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

        const date = new Date(deliveryDate);
        const imagesToKeep = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);
        const finalImages = [...imagesToKeep, ...newImageFilenames];


        if (!name || !phoneNumber || !address || !items || !notes || !deliveryDate) {
            return next({
                status: 400,
                message: "Delivery is missing essential information.",
            });
        }

        const delivery = await prisma.delivery.update({
            where: { id },
            data: { name, phoneNumber, address, items, images: finalImages, notes, deliveryDate: date },
        });

        res.json(delivery);
    } catch (error) {
        console.error("Error updating delivery:", error);
        next(error); // Pass the error to the error handling middleware
    }
});

module.exports = router;


