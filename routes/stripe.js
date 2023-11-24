const express = require("express");
const router = express.Router();
const { createPaymentIntent, khaltiPayment , successCallback } = require("../controllers/stripe");

// middleware
const { authCheck } = require("../middlewares/auth");

router.post("/create-payment-intent", authCheck, createPaymentIntent);
router.post("/khalti-app", khaltiPayment);
router.get("/epayment/success", successCallback );

module.exports = router;