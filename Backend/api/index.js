const router = require("express").Router();

router.use("/pickups", require("./pickups"));
router.use("/deliveries", require("./deliveries"));
router.use("/cleanup", require("./cleanup")); // Add this line

module.exports = router;