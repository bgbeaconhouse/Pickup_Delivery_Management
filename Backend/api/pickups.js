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

  module.exports = router;