const cloudinary = require("../middleware/cloudinary");
const Story = require('../models/Story');
const Comment = require("../models/Comment");

module.exports = {
    getStories: async(req, res) => {
        const stories = await Story.find({ user: req.user.id }).lean().sort({ date: -1 })
        res.render('dashboard', { stories })
    },
    getSpookyLand: async(req, res) => {
        const stories = await Story.find({ public: true }).lean().sort({ date: -1 })
        res.render('spookyLand', { stories })
    },
    getCompleteStory: async(req, res) => {
        const story = await Story.findById(req.params.id)
        const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
        res.render('storyComplete', { story, comments })
    },
    postStory: async(req, res) => {
        try {
            if (!req.file) {
                await Story.create({
                    rating: req.body.rating,
                    friends: req.body.friends,
                    story: req.body.story,
                    title: req.body.title || "untitled story",
                    date: req.body.date,
                    image: "https://res.cloudinary.com/dcde0wqqt/image/upload/v1673951368/halloween-g9efa85603_1920_lbyave.jpg",
                    user: req.user.id,
                    public: req.body.public
                })
            } else {
                const result = await cloudinary.uploader.upload(req.file.path);

                await Story.create({
                    rating: req.body.rating,
                    friends: req.body.friends,
                    story: req.body.story,
                    title: req.body.title || "untitled",
                    date: req.body.date,
                    image: result.secure_url,
                    cloudinaryId: result.public_id,
                    user: req.user.id,
                    public: req.body.public
                })
            }
            console.log('Story has been added to the dashboard!')
            res.redirect('/api/stories/')
        } catch (err) {
            console.log(err)
        }
    },
    getStoryForm: async(req, res) => {
        res.render('storyForm')
    },
    deleteStory: async(req, res) => {
        try {
            let story = await Story.findById({ _id: req.params.id });

            if (!story.cloudinaryId) {
                await story.deleteOne({ _id: req.params.id })
                console.log('Deleted Story')
                res.redirect('/api/stories/')
            } else {
                await cloudinary.uploader.destroy(story.cloudinaryId);
                await story.deleteOne({ _id: req.params.id })
                console.log('Deleted Story')
                res.redirect('/api/stories/')
            }

        } catch (err) {
            console.log(err)
        }
    },
    getEdit: async(req, res) => {
        try {
            const story = await Story.findOne({
                _id: req.params.id,
            }).lean()

            res.render('storyEdit', {
                story,
            })
        } catch (err) {
            console.error(err)
        }
    },
    editStory: async(req, res) => {
        try {
            await Story.findOneAndUpdate({ _id: req.params.id }, {
                rating: req.body.rating,
                friends: req.body.friends,
                story: req.body.story,
                title: req.body.title,
                date: req.body.date,
            }, {
                new: true,
                runValidators: true,
            })

            res.redirect(`/api/stories/completeStory/${req.params.id}`)

        } catch (err) {
            console.error(err)
                //return res.render('error/500')
        }
    },
}