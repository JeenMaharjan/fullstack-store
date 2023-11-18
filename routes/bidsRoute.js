const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create, get, getAll } = require("../controllers/bids");
router.post("/place-new-bid", authCheck, create);
router.post("/get-all-bids", get);
router.post("/get-all-bidders", getAll);


module.exports = router;