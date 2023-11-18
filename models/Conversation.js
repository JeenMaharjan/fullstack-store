const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    members: {
        type: Array,
    },

    title: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);