const router = require("express").Router();
const express = require("express");
const session = require('express-session')
const app = express()
const multer = require("multer");
const userModel = require("../models/User");

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
    return next();
    }
    res.redirect("/login");
};

// define storage for the images
const storage = multer.diskStorage({
    // destination for image files
    destination: function (request, file, callback) {
    callback(null, './assets/images');
    },

    // add back the extension
    filename: function (request, file, callback) {
    callback(null, request.user.id + '.jpg');
    console.log('Upload', request.user.id)
    },
});

// upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3
    }
});

//if its authenticated it goes next, the user data will pass, if you don't do the CB you can't use it
router.get('/editprofile', isLoggedIn,  (req, res) => {
        res.render('editprofile', {data: req})
});

// Update user profile image
router.post('/updateprofilepic', isLoggedIn, upload.single('image'), async (req, res) => {
    userModel.findByIdAndUpdate({_id: req.user._id},
        {profile: {
            profileimg: req.file.filename
        }},
        (error, result)=> {
            if(error) {
                console.log(req.user.id)
            } else {
                console.log('completed')
            }
        }
    );
    res.redirect("/editprofile");
});

// Update for user profile
router.post('/updateprofile', isLoggedIn, async (req, res) => {
    userModel.findByIdAndUpdate({_id: req.user._id},
        {name: req.body.name,
            bio: req.body.bio,
            website: req.body.website,
            gender: req.body.gender,
            phone: req.body.phone,
        }, 
        (error, result)=> {
            if(error) {
                console.log(req.user.id)
            } else {
                console.log('completed')
            }
        }
    );
    res.redirect("/editprofile");
});

// Delete profile for user 
router.get('/deleteprofile', (req, res)=> {
    userModel.deleteOne({_id: req.user._id}, (error, result)=> {
        if(error) {
            console.log("Something went wrong delete from database");
        } else {
            console.log("This image has been deleted", result);
            res.redirect("/login");
        }
    });
});

module.exports = router;

//DO NOT DELETE
/* db.imagesposts.aggregate([{
$lookup: {from: "profileimages", localField: "userid", foreignField: "userid", as: "profile"}
}]) */

