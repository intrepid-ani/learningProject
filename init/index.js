// Entering the Data from data.js into to the database

const Listing = require('../models/Listing');
let data = require('./data');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/WonderLust', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

Listing.insertMany(data)
    .then((res) => {
        console.log("Data inserted successfully");
    })
    .catch((err) => {
        console.log("ERROR: ", err);
    });