// Entering the Data from data.js into to the database

const Listing = require('../models/Listing');
let data = require('./data');
const mongoose = require('mongoose');

// Connecting db
function ConnectDB(){
    mongoose.connect('mongodb://localhost:27017/WonderLust')
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log("ERROR: ", err);
    });
}

ConnectDB();

// Inserting data
async function insert () {
    try {
        await Listing.insertMany(data);
        console.log("Data inserted successfully");
    } catch (err) {
        console.log("ERROR: ", err);
    }
}

insert();