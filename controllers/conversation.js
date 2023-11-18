const Conversation = require("../models/Conversation");
const Category = require("../models/category");
const slugify = require("slugify");
const user = require("../models/user");


exports.create = async(req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    try {
        const existingConversation = await Conversation.findOne({
            members: {
                $all: [senderId, receiverId],
            },
        });

        if (existingConversation) {
            // Conversation already exists with the same members
            return res.status(200).json(existingConversation);
        }

        const newConversation = new Conversation({
            members: [senderId, receiverId],
        });

        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.conversationToAdmin = async(req, res) => {
    const senderId = req.body.senderId;

    try {
        // Find admin(s) from the User model
        const admins = await user.find({ role: "admin" }).select("_id");

        // Extract admin IDs from the query result
        const adminIds = admins.map(admin => admin._id);

        // Create a conversation with sender and admin(s) as members
        const existingConversation = await Conversation.findOne({
            title: senderId
        });

        if (existingConversation) {
            // Conversation already exists with the same members
            return res.status(200).json(existingConversation);
        }

        // Create a new conversation with sender and admin(s) as members
        const newConversation = new Conversation({
            members: [senderId, ...adminIds],
            title: senderId
        });

        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.conversationToClient = async(req, res) => {
    try {
        // Find conversations where title is populated with user information
        const conversations = await Conversation.find({ title: { $ne: null } })
            .populate("title", "-password") // Replace "-password" with the fields you want to exclude from the user object
            .exec();

        res.status(200).json({ conversations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getUser = async(req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getUsers = async(req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
}