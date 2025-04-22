const express = require("express")

const router=express.Router()
router.use(express.json())
const multer = require("multer");
const prisma = require("../prisma");
const fs = require('fs').promises;

const verifyToken = require("../verify")

// Configure Multer for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Specify the directory where you want to save the images
      cb(null, 'uploads/'); // Create an 'uploads' folder in your project directory
  },
  filename: function (req, file, cb) {
      // Define how the file should be named
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
      const images = req.files ? req.files.map(file => file.filename) : []; // Get the filename of the uploaded image

      console.log("request body:", req.body);
      console.log("uploaded files:", req.files); // Log the uploaded file information
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
      next(error); // Pass the error to the error handling middleware
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
      const newImageFilenames = newImageFiles.map(file => file.filename);
  
      const date = new Date(pickupDate);
  
      if (!name || !phoneNumber || !items || !pickupDate) {
        return next({ status: 400, message: "Pickup is missing essential information." });
      }
  
      // Determine the final array of images to store
      const imagesToKeep = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);
      const finalImages = [...imagesToKeep, ...newImageFilenames];
  
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

  module.exports = router;