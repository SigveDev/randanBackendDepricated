const Router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = 10;

Router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.header("password"), salt);

        const newUser = new User({
            username: req.header("username"),
            password: hashedPassword,
            isAdmin: req.header("isAdmin"),
        });

        const user = await newUser.save();

        const accessToken = jwt.sign({
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            user: user,
            accessToken
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.header("username")});
        if (!user) {
            res.status(400).json("Wrong");
            return;
        }
        

        const validated = await bcrypt.compare(req.header("password"), user.password);
        if (!validated) {
            res.status(400).json("Wrong username or password!");
            return;
        }

        const {password, ...others} = user._doc;

        const accessToken = jwt.sign({
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            user: others,
            accessToken
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = Router;