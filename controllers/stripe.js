const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const axios = require("axios")
const Coupon = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);



exports.createPaymentIntent = async(req, res) => {
    console.log("createPaymentIntent =====> ", req.body);
    const { couponApplied } = req.body;

    // later apply coupon
    // later calculate price

    // 1 find user
    const user = await User.findOne({ email: req.user.email }).exec();
    // 2 get user cart total
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
        orderdBy: user._id,
    }).exec();
    // console.log("CART TOTAL", cartTotal, "AFTER DIS%", totalAfterDiscount);

    let finalAmount = 0;

    if (couponApplied && totalAfterDiscount) {
        finalAmount = totalAfterDiscount * 100;
    } else {
        finalAmount = cartTotal * 100;
    }

    // create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: "usd",
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable: finalAmount,
    });

}

exports.khaltiPayment = async(req, res) => {
    try {
        const payload = req.body;
        const khaltiResponse = await axios.post(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          payload,
          {
            headers: {
              Authorization: "Key 65b508574b354797a707e520afaf2530",
             
            },
          }
        );
        console.log(khaltiResponse.data);
        res.status(200).json(khaltiResponse.data);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
          error: "Internal Server Error",
        });
      }

}

exports.successCallback = async (req, res) => {
  try {
      // Extract relevant information from the callback request
      const { pidx, transaction_id, amount, mobile, purchase_order_id, purchase_order_name } = req.query;

      // Store this information in your database
      // ... (save to your database logic)

      res.status(200).json({ pidx, transaction_id, amount, mobile, purchase_order_id, purchase_order_name });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};