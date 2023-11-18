const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
    create,
    listAll,
    remove,
    read,
    update,
    list,
    productsCount,
    productStar,
    listRelated,
    searchFilters,
    lists,
    find,
    findTopCategory,
    specialDiscount,
    discountedProduct,
    productRating
} = require("../controllers/product");

// routes
router.post("/product", authCheck, create);
router.get("/product/find", authCheck, find);
router.get("/product/category", findTopCategory);
router.get("/product/specialDiscount", specialDiscount);
router.get("/product/discountedProduct/:discountpercent", discountedProduct);
router.get("/products/total", productsCount);
router.post("/products/:count", listAll); // products/100
router.get("/lists/:count", lists);
router.delete("/product/:slug", authCheck, remove);
router.get("/product/:id", read);
router.put("/product/:slug", authCheck, update);
router.put("/product/star/:productId", authCheck, productStar);
router.put("/product/rating/:productId", authCheck, productRating);
router.get("/product/related/:productId", listRelated);
router.post("/search/filters", searchFilters);
router.post("/products", list);
module.exports = router;