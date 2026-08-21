const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Mongodb is connected");
});

db.on("disconnected", () => {
    console.log("Mongodb is disconnected");
});

db.on("error", (error) => {
    console.log("Mongodb is disconnected due to error", error);
});

module.exports = db;
