const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listeningSchema = new Schema({
    title: {
        type: String,
        required: true, 
        limits: [5, 100],
    },
    description: {
        type: String,
        required: true,
        limits: [5, 1000],
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
})
module.exports = mongoose.model("Listing", listeningSchema);