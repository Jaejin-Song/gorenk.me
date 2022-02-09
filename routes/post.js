const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const gm = require('gm');

const { Post, Comment, User} = require('../models');
const { isLoggedIn } = require('./middlewares');
const { error } = require('console');

const router = express.Router();
fs.readdir('uploads', (error) => {
    if(error){
        console.error('There is no uploads folder, so create a uploads folder');
        fs.mkdirSync('uploads');
    }
});

fs.readdir('upload', (error) => {
    if(error){
        console.error('There is no upload folder, so create a upload folder');
        fs.mkdirSync('upload');
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            name = path.basename(file.originalname, ext) + Date.now() + ext;
            cb(null, name);     
            gm('uploads/'+name)
            .resize(256)
            .write('upload/' + name, function(err){
                if(!err) console.error('done');
                console.log("testing" , name);
            });
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
    try{
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        // const comment = req.body.content.comment();
        res.redirect('/community');
    } catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/modify', isLoggedIn, upload2.none(), async (req, res, next) => {
    try{
        console.log("start!");
        const modify = await Post.update({
            title: req.body.title,
            content: req.body.content,
            img: req.body.url,
        }, {
            where: {id: req.body.postid},
        });
        res.redirect('/community');
        // res.redirect('/community/pasing/' + req.body.pagenum);
    } catch(error){
        console.error(error);
        next(error);
    }
});


module.exports = router;