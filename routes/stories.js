const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Storys');

// @desc Show add page
// @route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

// @desc Process add form
// @route POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
});


// @desc Show All Stories
// @route GET /stories
router.get('/',ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({ user: req.user.id, status: 'public' });
            .populate('user')
            .sort({createAt:'desc'})
            .lean();
        // console.log(req.user);
        res.render('stories/index', {
            stories,
        })
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
})


// @desc Show edit page
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findOne({ _id: req.params.id }).lean()
        // console.log('test 1572')
        // console.log(req.user._id)
        // console.log(req.user);
        // console.log(story.user)
        if (!story) {
            return res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {
                story,
            })
        }
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
});


// @desc Updata story form
// @route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id);
        if (!story) {
            return res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findByIdAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, runValidators: true }
            );
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
});


// @desc Delete story form
// @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
});



// @desc Get single story 
// @route GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean();
        if (!story) {
            console.log('test Fuck')
            return res.render('error/404')
        }
        res.render('stories/show', {
            story,
        });
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
});

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public',
        })
            .populate('user')
            .lean()
        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});


//@desc Search stories by title
//@route GET /stories/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ title: new RegExp(req.query.query, 'i'), status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('stories/index', { stories })
    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
});


module.exports = router;