const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const storiesController = require('../controllers/stories');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

router.get('/', ensureAuth, storiesController.getStories)

router.get('/spookyland', storiesController.getSpookyLand)

router.get('/storyForm', ensureAuth, storiesController.getStoryForm)

router.get('/completeStory/:id', ensureGuest, storiesController.getCompleteStory)

router.post('/add', ensureAuth, upload.single("file"), storiesController.postStory)

router.get('/edit/:id', ensureAuth, storiesController.getEdit)

router.put('/edit/:id', ensureAuth, storiesController.editStory)

router.delete('/delete/:id', ensureAuth, storiesController.deleteStory)

module.exports = router