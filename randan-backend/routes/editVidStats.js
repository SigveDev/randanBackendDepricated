const Router = require("express").Router();
const VidStats = require("../models/vidStats");
const User = require("../models/user");

Router.get("/findone/:id", async (req, res) => {
    try {
        const vidStats = await VidStats.findOne({chapterId: req.params.id});
        if(vidStats && vidStats.ownerId === req.body.ownerId) {
            res.status(200).json(vidStats);
        } else {
            res.status(401).json("You can only get your own vidStats!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.get("/findmine/:id", async (req, res) => {
    try {
        const vidStats = await VidStats.find({ownerId: req.params.id});
        res.status(200).json(vidStats);
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.put("/update/views/:id", async (req, res) => {
    try {
        const vidStats = await VidStats.findOne({chapterId: req.params.id});
        if(vidStats) {
            const newVidStats = await VidStats.findByIdAndUpdate(vidStats._id, {
                $set: {views: vidStats.views + 1}
            }, {new: true});
            res.status(200).json(newVidStats);
        } else {
            res.status(404).json("Chapter stats not found!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.put("/update/likes/add/:id", async (req, res) => {
    try {
        const vidStats = await VidStats.findOne({chapterId: req.params.id});
        const user = await User.findById(req.body.userId);

        if(vidStats && user) {
            if(!user.likedChapters.includes(req.params.id)) {
                vidStats.likes += 1;
                user.likedChapters.push(req.params.id);
                await vidStats.save();
                await user.save();
                res.status(200).json("Chapter liked!");
            } else {
                res.status(401).json("You already liked this chapter!");
            }
        } else {
            res.status(404).json("Chapter stats not found!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.put("/update/likes/remove/:id", async (req, res) => {
    try {
        const vidStats = await VidStats.findOne({chapterId: req.params.id});
        const user = await User.findById(req.body.userId);

        if(vidStats && user) {
            if(user.likedChapters.includes(req.params.id)) {
                vidStats.likes -= 1;
                user.likedChapters = user.likedChapters.filter((id) => id !== req.params.id);
                await vidStats.save();
                await user.save();
                res.status(200).json("Chapter unliked!");
            } else {
                res.status(401).json("You haven't liked this chapter yet!");
            }
        } else {
            res.status(404).json("Chapter stats not found!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = Router;