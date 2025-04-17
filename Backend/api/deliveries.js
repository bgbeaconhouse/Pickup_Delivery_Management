const express = require("express")
const router=express.Router()
router.use(express.json())


const prisma = require("../prisma");


// Get list of all deliveries
router.get("/", async (req, res, next) => {
    try {
      const deliveries = await prisma.delivery.findMany();
      res.json(deliveries);
    } catch {
 
      next();
    }
  });

  module.exports = router;