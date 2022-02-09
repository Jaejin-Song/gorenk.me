const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try{
            const exUser = await User.findOne({where: {snsId: profile.id, provider: 'kakao'} });
            if(exUser) {
                done(null, exUser);
            } else{
                const newUser = await User.create({
                    userid: profile._json && profile._json.kakao_account.email,
                    nickname: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch(error){
            console.error(error);
            done(error);
        }
    }));
};