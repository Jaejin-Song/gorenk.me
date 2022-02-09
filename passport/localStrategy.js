const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'userid',
        passwordField: 'password',
    }, async (userid, password, done) => {
        try{
            const exUser = await User.findOne({ where: {userid} });
            if(exUser){
                console.log("compare ",password, exUser.password, exUser.password.length);
                const result = await bcrypt.compare(password, exUser.password);
                console.log("result", result);
                if(result){
                    done(null, exUser);
                    console.log("done");
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                    console.log("error1");
                }
            } else {
                done(null, false, {message: '존재하지 않는 아이디입니다.'});
                console.log("error2");
            } 
        } catch(error){
            console.error(error);
            done(error);
        } 
    }));
};