const express = require('express');
const axios = require('axios');
const crawl_owner = require('./crawl_owner.js');
const crawl_stat = require('./crawl_stat.js');
const get_match = require('./get_match.js');
const get_player = require('./get_player.js');
const request = require("request");
const cheerio = require("cheerio");
const { response } = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
    console.log("req.url", req.url);
    res.render('index', {
        user: req.user,
    });
});

router.get('/result', async (req, res, next) => {
    _param = req.query.id;
    param = encodeURI(req.query.id);


    // 이름으로 accessid 조회
    try {
        search_name = await axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=" + param, {
            headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
        });
        accessid = search_name.data.accessId;
        res.locals.username = await search_name.data.nickname;
        res.locals.userlevel = await search_name.data.level;

        try {
            // 최근 매치 100경기 조회
            search_match = await axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/users/" +
                accessid +
                "/matches?matchtype=50&offset=0&limit=100", {
                headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
            });


            try {
                crawl_owner(res, param);
                crawl_stat(res, param);
            } catch (err) {
                res.render('nomatchuser', {
                    user: req.user
                });
            }

            try {
                recent_match = await get_match(search_match.data, _param, res);
                res.locals.match_total = JSON.stringify(search_match.data);
                try {
                    await get_player(res, recent_match, _param);
                } catch (err) {
                    res.render('nomatchuser', {
                        user: req.user
                    });
                }

            } catch (err) {
                console.log("error1!!!");
            }




            await res.render('result', { user: req.user });

        } catch (err) {
            res.render('nomatchuser', {user : req.user});
        }
    } catch (err) {
        res.render('nouser', {
            user: req.user,
        });
    }
});



router.get('/match/:id', async (req, res) => {

    id = req.query.id;

    var match = await axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/matches/" +
        req.params.id, {
        headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
    });
    // axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/matches/" +
    //     id, {
    //     headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
    // });
    // .then((res) => {
    // console.log(res);
    myNickname = match.data.matchInfo[0].nickname;
    opponent = match.data.matchInfo[1].nickname;

    goal1 = match.data.matchInfo[0].shoot.goalTotal;
    goal2 = match.data.matchInfo[1].shoot.goalTotal;
    res.locals.goal1 = goal1;
    res.locals.goal2 = goal2;

    possession1 = match.data.matchInfo[0].matchDetail.possession + "%";
    possession2 = match.data.matchInfo[1].matchDetail.possession + "%";
    res.locals.possession1 = possession1;
    res.locals.possession2 = possession2;

    shoot1 = match.data.matchInfo[0].shoot.shootTotal;
    shoot2 = match.data.matchInfo[1].shoot.shootTotal;
    res.locals.shoot1;
    res.locals.shoot2;

    effective1 = match.data.matchInfo[0].shoot.effectiveShootTotal;
    effective2 = match.data.matchInfo[1].shoot.effectiveShootTotal;
    res.locals.effective1;
    res.locals.effective2;

    corner1 = match.data.matchInfo[0].matchDetail.cornerKick;
    corner2 = match.data.matchInfo[1].matchDetail.cornerKick;
    res.locals.corner1 = corner1;
    res.locals.corner2 = corner2;

    freekick1 = match.data.matchInfo[0].shoot.shootFreekick;
    freekick2 = match.data.matchInfo[1].shoot.shootFreekick;
    res.locals.freekick1 = freekick1;
    res.locals.freekick2 = freekick2;

    penalty1 = match.data.matchInfo[0].shoot.shootPenaltyKick;
    penalty2 = match.data.matchInfo[1].shoot.shootPenaltyKick;
    res.locals.penalty1 = penalty1;
    res.locals.penalty2 = penalty2;

    foul1 = match.data.matchInfo[0].matchDetail.foul;
    foul2 = match.data.matchInfo[1].matchDetail.foul;
    res.locals.foul1 = foul1;
    res.locals.foul2 = foul2;

    yellow1 = match.data.matchInfo[0].matchDetail.yellowCards;
    yellow2 = match.data.matchInfo[1].matchDetail.yellowCards;
    res.locals.yellow1 = yellow1;
    res.locals.yellow2 = yellow2;

    red1 = match.data.matchInfo[0].matchDetail.redCards;
    red2 = match.data.matchInfo[1].matchDetail.redCards;
    res.locals.red1 = red1;
    res.locals.red2 = red2;

    pass_try1 = match.data.matchInfo[0].pass.passTry;
    pass_try2 = match.data.matchInfo[1].pass.passTry;
    pass_success1 = match.data.matchInfo[0].pass.passSuccess;
    pass_success2 = match.data.matchInfo[1].pass.passSuccess;
    pass_rate1 = ((pass_success1 / pass_try1) * 100).toFixed(1) + "% (" + pass_success1 + "/" + pass_try1 + "회)";
    pass_rate2 = ((pass_success2 / pass_try2) * 100).toFixed(1) + "% (" + pass_success2 + "/" + pass_try2 + "회)";
    res.locals.pass_rate1 = pass_rate1;
    res.locals.pass_rate2 = pass_rate2;
    // set_match_detail(match.data.matchInfo[0]);
    // set_match_detail(match.data.matchInfo[1]);

    //세부 항목

    // crawl_owner_match(res, encodeURI(myNickname));
    myurl1 = "http://fifaonline4.nexon.com/profile/common/PopProfile?strCharacterName=" + encodeURI(myNickname);
    await axios.get(myurl1).then(async resp => {
        get_id = resp.request.path;
        var split = get_id.split('/');
        fifa_id = split[4];

        //owner_match
        await request("http://fifaonline4.nexon.com/profile/owner/popup/" + fifa_id, function (error, response, body) {
            if (error) throw error;

            $ = cheerio.load(body);

            date_from = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_top > div.since > div.text').text();
            mark_national = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.major > div.text > div > img').attr('src');
            name_national = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.major > div.text > span').text();
            mark_club = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.club > div.text > div > img').attr('src');
            name_club = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.club > div.text > span').text();

            profile_rank = $('#profilePop > div > div > div.header > div.coach_info > div.rank > div > img').attr('src');
            profile_mark = $('#profilePop > div > div > div.header > div.coach_info > div.crest > div > img').attr('src');
            team_value = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_bottom > div > div.text').text();

            var crawl_owner_match = {};

            crawl_owner_match.date_from = date_from;
            crawl_owner_match.mark_national = mark_national;
            crawl_owner_match.mark_club = mark_club;
            crawl_owner_match.name_national = name_national;
            crawl_owner_match.name_club = name_club;

            crawl_owner_match.profile_rank = profile_rank;
            crawl_owner_match.profile_mark = profile_mark;
            crawl_owner_match.team_value = team_value;

            res.locals.crawl_owner_match = crawl_owner_match;


        });
        //owner_season
        await request("http://fifaonline4.nexon.com/Profile/Stat/TeamInfo/" + fifa_id + "?n1Type=50", async function (error, response, body) {
            var $ = cheerio.load(body);

            season_now_now = $('body > div > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_current > img').attr('src');
            season_now_best = $('body > div > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_last > img').attr('src');
            season_now_win = $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_desc').text();

            season_past_final = $('body > div > div.season_grade_info > div.season_grade_info__last > div.grade_current > img').attr('src');
            season_past_best = $('body > div > div.season_grade_info > div.season_grade_info__last > div.grade_last > img').attr('src');
            season_past_win = $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__last > div.grade_desc').text();

            season_best = $('body > div > div.season_grade_info > div.season_grade_info__best > div.grade_current > img').attr('src');
            season_best_date = $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__best > div.grade_desc').text();


            var crawl_stat1 = {};

            crawl_stat1.season_now_now = season_now_now;
            crawl_stat1.season_now_best = season_now_best;
            crawl_stat1.season_now_win = season_now_win;

            crawl_stat1.season_past_final = season_past_final;
            crawl_stat1.season_past_best = season_past_best;
            crawl_stat1.season_past_win = season_past_win;

            crawl_stat1.season_best = season_best;
            crawl_stat1.season_best_date = season_best_date;

            res.locals.crawl_stat1 = crawl_stat1;



            //crawl_opponent
            myurl2 = "http://fifaonline4.nexon.com/profile/common/PopProfile?strCharacterName=" + encodeURI(opponent);
            await axios.get(myurl2).then(async resp => {
                get_id2 = resp.request.path;
                var split2 = get_id2.split('/');
                fifa_id2 = split2[4];

                await request("http://fifaonline4.nexon.com/profile/owner/popup/" + fifa_id2, function (error, response, body) {
                    if (error) throw error;

                    $ = cheerio.load(body);

                    date_from = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_top > div.since > div.text').text();
                    mark_national = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.major > div.text > div > img').attr('src');
                    name_national = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.major > div.text > span').text();
                    mark_club = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.club > div.text > div > img').attr('src');
                    name_club = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.club > div.text > span').text();

                    profile_rank = $('#profilePop > div > div > div.header > div.coach_info > div.rank > div > img').attr('src');
                    profile_mark = $('#profilePop > div > div > div.header > div.coach_info > div.crest > div > img').attr('src');
                    team_value = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_bottom > div > div.text').text();

                    var crawl_opponent = {};

                    crawl_opponent.date_from = date_from;
                    crawl_opponent.mark_national = mark_national;
                    crawl_opponent.mark_club = mark_club;
                    crawl_opponent.name_national = name_national;
                    crawl_opponent.name_club = name_club;

                    crawl_opponent.profile_rank = profile_rank;
                    crawl_opponent.profile_mark = profile_mark;
                    crawl_opponent.team_value = team_value;
                    res.locals.crawl_opponent = crawl_opponent;


                });

                await request("http://fifaonline4.nexon.com/Profile/Stat/TeamInfo/" + fifa_id2 + "?n1Type=50", function (error, response, body) {
                    var $ = cheerio.load(body);

                    season_now_now = $('body > div > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_current > img').attr('src');
                    season_now_best = $('body > div > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_last > img').attr('src');
                    season_now_win = $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_desc').text();

                    season_past_final = $('body > div > div.season_grade_info > div.season_grade_info__last > div.grade_current > img').attr('src');
                    season_past_best = $('body > div > div.season_grade_info > div.season_grade_info__last > div.grade_last > img').attr('src');
                    season_past_win = $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__last > div.grade_desc').text();

                    season_best = $('body > div > div.season_grade_info > div.season_grade_info__best > div.grade_current > img').attr('src');
                    season_best_date = $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__best > div.grade_desc').text();


                    var crawl2 = {};

                    crawl2.season_now_now = season_now_now;
                    crawl2.season_now_best = season_now_best;
                    crawl2.season_now_win = season_now_win;

                    crawl2.season_past_final = season_past_final;
                    crawl2.season_past_best = season_past_best;
                    crawl2.season_past_win = season_past_win;

                    crawl2.season_best = season_best;
                    crawl2.season_best_date = season_best_date;

                    res.locals.opponent_stat = crawl2;

                    res.render('match', {user:req.user});
                });

            });
        });

    });




    // crawl_opponent(res, encodeURI(opponent));

    search_my = await axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=" + encodeURI(myNickname), {
        headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
    })
    res.locals.mynickname = search_my.data.nickname;
    res.locals.mylevel = search_my.data.level;
    // });

    search_opponent = await axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=" + encodeURI(opponent), {
        headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
    })

    res.locals.opponent_nickname = search_opponent.data.nickname;
    res.locals.opponent_level = search_opponent.data.level;


    // console.log(myNickname);

});

router.get('/division', (req, res) => {
    res.render('division', {
        user: req.user,
    });
});

router.get('/about', (req, res) => {
    res.render('about', {
        user: req.user,
    });
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login', {
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

router.get('/community/pasing/:cur', async (req, res) => {
    
    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;

    var data1 = await Post.findAll({
        include: { model: User, attributes: ['id', 'nickname'] },
        where: { deletedAt: null },
    });
    totalPageCount = data1.length;

    var curPage = req.params.cur;

    var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
    var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
    var curSet = Math.ceil(curPage / page_list_size); // 현재 셋트 번호
    var startPage = ((curSet - 1) * 10) + 1; //현재 세트내 출력될 시작 페이지
    if (curSet < totalSet){
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지
    } else{
        var endPage = totalPage;
    }
    if(totalPage==0) var offset = 0;
    else var offset =  (totalPage - curPage) * page_size;

    console.log(totalPage, totalSet, curSet, startPage, endPage);

    var result = {
        "curPage": curPage,
        "page_list_size": page_list_size,
        "page_size": page_size,
        "totalPage": totalPage,
        "totalSet": totalSet,
        "curSet": curSet,
        "startPage": startPage,
        "endPage": endPage,
    }
    Post.findAll({
        include: {
            model: User,
            attributes: ['id', 'nickname'],
        },
        where:{
            deletedAt: null,
        },
        limit: page_size,
        offset: offset,
        order: [['createdAt', 'ASC']],
    })
    .then((posts) => {
        res.render('community', {
            twits: posts.reverse(),
            user: req.user,
            pasing: result,
            loginError: req.flash('loginError'),
        });
    })
    .catch((error) => {
        console.error(error);
        next(error);
    });
});

router.get("/community/modify/:id", async(req, res) => {
    find_post = await Post.findOne({
        where: {id: req.params.id},
    });

    res.render("modify", {
        post: find_post,
        pagenum: req.query.pasing,
        user: req.user,
    });
});

router.get("/community/delete/:id", async(req, res) => {
    delete_post = await Post.destroy({
        where: {id : req.params.id},
    });
    res.redirect("/community/pasing/" + req.query.pasing);

});

router.get('/community', (req, res) => {
    res.redirect('/community/pasing/' + 1);
});

router.get('/community/upload', (req, res) => {
    res.render('upload', {
        user: req.user,
    });
});

router.get('/community/posts/:cur', async (req, res) => {
    const find_post = await Post.findOne({
            include: { model: User, attributes: ['id', 'nickname'] },
            where: { id: req.query.post },
    });
    find_post.views++;
    find_post.save();

    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;

    var data = await Post.findAll({
        include: { model: User, attributes: ['id', 'nickname'] },
        where: { deletedAt: null },
    });
    
    totalPageCount = data.length;

    var curPage = req.params.cur;

    var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
    var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
    var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
    var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
    if (curSet < totalSet){
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지
    } else{
        var endPage = totalPage;
    }

    console.log(totalPage, totalSet, curSet, startPage, endPage);

    var result = {
        "curPage": curPage,
        "page_list_size": page_list_size,
        "page_size": page_size,
        "totalPage": totalPage,
        "totalSet": totalSet,
        "curSet": curSet,
        "startPage": startPage,
        "endPage": endPage,
    }

    Post.findAll({
        include: {
            model: User,
            attributes: ['id', 'nickname'],
        },
        where:{
            deletedAt: null,
        },
        limit: page_size,
        offset: (totalPage - curPage) * page_size,
        order: [['createdAt', 'ASC']],
    })
    .then((posts) => {
        res.render('community', {
            twits: posts.reverse(),
            user: req.user,
            pasing: result,
            post: find_post,
            loginError: req.flash('loginError'),
        });
    })
    .catch((error) => {
        console.error(error);
        next(error);
    });
});

module.exports = router;