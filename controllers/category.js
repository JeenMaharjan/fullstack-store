const Category = require("../models/category");
const slugify = require("slugify");
const Sub = require("../models/sub");
const Product = require("../models/product");

exports.create = async(req, res) => {
    try {
        // const { name } = req.body;
        // const category = await new Category({ name, slug: slugify(name) }).save();
        // res.json(category);
        console.log(req.body)
        req.body.slug = slugify(req.body.name);
        const newProduct = await new Category(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(400).send("Create category failed");
    }
}

exports.list = async(req, res) => {
    res.json(await Category.find({}).sort({ createdAt: -1 }));
}

exports.update = async(req, res) => {
    console.log(req.body)
    req.body.slug = slugify(req.body.name);
    try {
        const updated = await Category.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).send("Category update failed");
    }
}

exports.remove = async(req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Category delete failed");
    }
}


exports.getSubs = async(req, res) => {
    const sub = await Sub.find({ parent: req.params._id })
    res.json(sub);

};

exports.read = async(req, res) => {
    let category = await Category.findOne({ slug: req.params.slug }).exec();
    // res.json(category);
    const products = await Product.find({ category }).populate("category").exec();

    res.json({
        category,
        products,
    });
};