const router = require("express").Router();


router.use("/pickups", require("./pickups"));
router.use("/deliveries", require("./deliveries"));

module.exports = router;