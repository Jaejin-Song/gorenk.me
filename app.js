const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();
const logger = require('./routes/logger');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);
const { sequelize } = require('./models');
const passportConfig = require('./passport');
// const greenlock = require('greenlock-cluster');
const fs = require('fs');
const https = require('https');
const http = require('http');
var createServer = require('auto-sni');
var favicon = require('serve-favicon');

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.set('port', process.env.PORT || 8080);

const options = {
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/gorank.me/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/gorank.me/cert.pem'), 'utf8').toString(),
};

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);


app.use(morgan('dev'));
if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

// app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use('/result', express.static(path.join(__dirname, 'public')));
app.use('/match', express.static(path.join(__dirname, 'public')));
app.use('/division', express.static(path.join(__dirname, 'public')));
app.use('/about', express.static(path.join(__dirname, 'public')));
app.use('/login', express.static(path.join(__dirname, 'public')));
app.use('/join', express.static(path.join(__dirname, 'public')));
app.use('/community', express.static(path.join(__dirname, 'public')));
app.use('/community/posts', express.static(path.join(__dirname, 'public')));
app.use('/community/pasing', express.static(path.join(__dirname, 'public')));
app.use('/community/modify', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({ 
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASSWORD,
        logErrors: true,
     }),
};
if (process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true;
    sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('logger error');
    logger.error(err.message);
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
