const express = require("express")
const router=express.Router()
router.use(express.json())

const prisma = require("../prisma");

// Get list of all pickups
router.get("/", async (req, res, next) => {
    try {
      const pickups = await prisma.pickup.findMany();
      res.json(pickups);
    } catch {
 
      next();
    }
  });

    // Get a specific pickup
    router.get("/:id", async (req, res, next) => {
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
  router.post("/", async (req, res, next) => {
   
    try {
    
      const { name, phoneNumber, items, image, notes, pickupDate } = req.body;
      console.log(req.body);
      
  
      
      if (!name || !phoneNumber || !items || !image || !notes || !pickupDate) {
    
        const error = {
          status: 400,
          message: "Pick Up is missing essential information.",
        };
  
       
        return next(error);
      }
     
      const pickup = await prisma.pickup.create({ data: { name, phoneNumber, items, image, notes, pickupDate } });
      
      res.status(201).json(pickup);
    } catch {
      next();
    }
  });

  // Delete pickup
  router.delete("/:id", async (req, res, next) => {
    
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

// Update pickup
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    
    const pickupExists = await prisma.pickup.findUnique({ where: { id } });
    if (!pickupExists) {
      return next({
        status: 404,
        message: `Could not find pickup with id ${id}.`,
      });
    }

    
    const { name, phoneNumber, items, image, notes, pickupDate } = req.body;
    if (!name || !phoneNumber || !items || !image || !notes || !pickupDate) {
      return next({
        status: 400,
        message: "Pickup is missing essential information.",
      });
    }

  
    const pickup = await prisma.pickup.update({
      where: { id },
      data: { name, phoneNumber, items, image, notes, pickupDate },
    });

    res.json(pickup);
  } catch {
    next();
  }
});

  module.exports = router;