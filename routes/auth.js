const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { userid, nickname, password } = req.body;
    console.log("testing", req.body);
    try{
        const exUser = await User.findOne({where: { userid } });
        if(exUser){
            req.flash('joinError', '이미 등록된 아이디입니다.');
            return res.redirect('/join');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            userid,
            nickname,
            password: hash,
        });
        return res.redirect('/');
    } catch(error){
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        console.log()
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user){
            console.log(authError);
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req,res) => {
    res.redirect('/');
});
module.exports = router;