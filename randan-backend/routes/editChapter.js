const Router = require('express').Router();
const Chapter = require('../models/chapter');
const VidStats = require('../models/vidStats');

const fs = require('fs');

Router.post("/new", async (req, res) => {
    try {
        const newChapter = new Chapter(req.body);

        const chapter = await newChapter.save();

        const newVidStats = new VidStats({
            chapterId: chapter._id,
            views: 0,
            likes: 0,
            ownerId: chapter.userId
        });

        await newVidStats.save();

        res.status(200).json(chapter)
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.put("/update/:id", async (req, res) => {
    try {
        const oldChapter = await Chapter.findById(req.params.id);
        if (oldChapter.userId === req.body.userId) {
            const newChapter = await Chapter.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true});
            res.status(200).json(newChapter);
        } else {
            res.status(401).json("You can only update your own chapter!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.delete("/delete/:id", async (req, res) => {
    try {
        const oldChapter = await Chapter.findById(req.params.id);
        if (oldChapter.userId === req.body.userId) {
            const uploads = __dirname.split("\\");
            uploads.pop();
            uploads.push("uploads");
            uploads.join("\\");
            const newuploads = uploads.join("\\");
            for(let i = 0; i < oldChapter.pages.length; i++) {
                fs.unlinkSync(newuploads + "/" + oldChapter.pages[i].image, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            fs.unlinkSync(newuploads + "/" + oldChapter.image, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            await Chapter.findByIdAndDelete(req.params.id);
            await VidStats.findOneAndDelete({chapterId: req.params.id});
            res.status(200).json("Chapter has been deleted...");
        } else {
            res.status(401).json("You can only delete your own chapter!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.get("/findone/:id", async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        res.status(200).json(chapter);
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.get("/findall", async (req, res) => {
    try {
        const chapters = await Chapter.find();
        res.status(200).json(chapters);
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.get("/findauthor/:author", async (req, res) => {
    try {
        const chapters = await Chapter.find({author: req.params.author});
        res.status(200).json(chapters);
    } catch (err) {
        res.status(500).json(err);
    }
});

Router.get("/findmine/:userId", async (req, res) => {
    try {
        const chapters = await Chapter.find({userId: req.params.userId});
        res.status(200).json(chapters);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = Router;