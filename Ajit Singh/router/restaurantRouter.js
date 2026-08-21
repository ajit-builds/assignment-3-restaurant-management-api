const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const Restaurants = require('../models/Restaurants');
const Menu_items = require('../models/Menu_items');
const Users = require('../models/Users');

const router = express.Router();

router.post("/register", async (request, response) => {
    try {
        const { username, email, password } = request.body;

        if (!username) {
            return response.status(400).json({ message: "Username is required" });
        }

        if (!email) {
            return response.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return response.status(400).json({ message: "Password is required" });
        }

        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return response.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Users({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        return response.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email) {
            return response.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return response.status(400).json({ message: "Password is required" });
        }

        const user = await Users.findOne({ email });

        if (!user) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return response.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.get("/", async (request, response) => {
    try {
        return response.status(200).json({
            message: "Welcome to the restaurants"
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (request, response) => {
    try {
        const restaurant = await Restaurants.findById(request.params.id);

        if (!restaurant) {
            return response.status(404).json({
                message: "Restaurant not found"
            });
        }

        return response.status(200).json(restaurant);
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.post("/", async (request, response) => {
    try {
        const { name, city, address, cuisine, rating } = request.body;

        if (!name || !city || !address || !cuisine || rating === undefined) {
            return response.status(400).json({
                message: "All restaurant fields are required"
            });
        }

        const restaurant = new Restaurants({
            name,
            city,
            address,
            cuisine,
            rating
        });

        await restaurant.save();

        return response.status(201).json({
            message: "Restaurant created successfully",
            restaurant
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (request, response) => {
    try {
        const updatedRestaurant = await Restaurants.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return response.status(404).json({
                message: "Restaurant not found"
            });
        }

        return response.status(200).json({
            message: "Restaurant updated successfully",
            restaurant: updatedRestaurant
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const restaurant = await Restaurants.findByIdAndDelete(
            request.params.id
        );

        if (!restaurant) {
            return response.status(404).json({
                message: "Restaurant not found"
            });
        }

        await Menu_items.deleteMany({
            restaurant: request.params.id
        });

        return response.status(200).json({
            message: "Restaurant deleted successfully"
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.get("/:restaurantId/menu", async (request, response) => {
    try {
        const restaurant = await Restaurants.findById(
            request.params.restaurantId
        );

        if (!restaurant) {
            return response.status(404).json({
                message: "Restaurant not found"
            });
        }

        const menuItems = await Menu_items.find({
            restaurant: request.params.restaurantId
        });

        return response.status(200).json(menuItems);
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.post("/:restaurantId/menu", async (request, response) => {
    try {
        const { name, price, isAvailable } = request.body;

        const restaurant = await Restaurants.findById(
            request.params.restaurantId
        );

        if (!restaurant) {
            return response.status(404).json({
                message: "Restaurant not found"
            });
        }

        if (!name || price === undefined || isAvailable === undefined) {
            return response.status(400).json({
                message: "Name, price and isAvailable are required"
            });
        }

        const menuItem = new Menu_items({
            restaurant: request.params.restaurantId,
            name,
            price,
            isAvailable
        });

        await menuItem.save();

        return response.status(201).json({
            message: "Menu item created successfully",
            menuItem
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.put("/:restaurantId/menu/:id", async (request, response) => {
    try {
        const menuItem = await Menu_items.findOneAndUpdate(
            {
                _id: request.params.id,
                restaurant: request.params.restaurantId
            },
            request.body,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return response.status(404).json({
                message: "Menu item not found"
            });
        }

        return response.status(200).json({
            message: "Menu item updated successfully",
            menuItem
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.delete("/:restaurantId/menu/:id", async (request, response) => {
    try {
        const menuItem = await Menu_items.findOneAndDelete({
            _id: request.params.id,
            restaurant: request.params.restaurantId
        });

        if (!menuItem) {
            return response.status(404).json({
                message: "Menu item not found"
            });
        }

        return response.status(200).json({
            message: "Menu item deleted successfully"
        });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

module.exports = router;
