require("dotenv").config();
const express = require('express');
const db = require("./config/db");
const restaurantRouter = require("./router/restaurantRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/restaurants", restaurantRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

