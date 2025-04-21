const express = require("express")
const router=express.Router()
router.use(express.json())
const multer = require("multer");

const prisma = require("../prisma");
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

const upload = multer({ storage: storage });



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
router.post("/", verifyToken, upload.single('image'), async (req, res, next) => {
  try {
      const { name, phoneNumber, address, items, notes, deliveryDate } = req.body;
      const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image

      console.log("request body:", req.body);
      console.log("uploaded file:", req.file); // Log the uploaded file information
      const date = new Date(deliveryDate);

      if (!name || !phoneNumber || !address || !items || !notes || !deliveryDate) {
          const error = {
              status: 400,
              message: "Delivery is missing essential information.",
          };
          return next(error);
      }

      const delivery = await prisma.delivery.create({
          data: { name, phoneNumber, address, items, image, notes, deliveryDate: date },
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

// Update pickup
router.put("/:id", verifyToken, upload.single('image'), async (req, res, next) => {
  try {
      const id = +req.params.id;

      const deliveryExists = await prisma.delivery.findUnique({ where: { id } });
      if (!deliveryExists) {
          return next({
              status: 404,
              message: `Could not find delivery with id ${id}.`,
          });
      }

      const { name, phoneNumber, address, items, notes, deliveryDate } = req.body;
      const image = req.file ? req.file.filename : deliveryExists.image; // Use existing image if no new one is uploaded
      const date = new Date(deliveryDate);

      if (!name || !phoneNumber || !address || !items || !notes || !deliveryDate) {
          return next({
              status: 400,
              message: "Delivery is missing essential information.",
          });
      }

      const delivery = await prisma.delivery.update({
          where: { id },
          data: { name, phoneNumber, address, items, image, notes, deliveryDate: date },
      });

      res.json(delivery);
  } catch (error) {
      console.error("Error updating delivery:", error);
      next(error); // Pass the error to the error handling middleware
  }
});

  module.exports = router;

