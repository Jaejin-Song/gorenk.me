const cheerio = require("cheerio");
const request = require("request");
const axios = require('axios');

module.exports = async function(res, param) {
    opponent_stat = new Promise((resolve, reject) => {
        console.log("starting!!!");

        myurl = "http://fifaonline4.nexon.com/profile/common/PopProfile?strCharacterName=" + param;
        axios.get(myurl).then(async resp =>{
        get_id = resp.request.path;
        var split = get_id.split('/');
        fifa_id = split[4];
    });

    request("http://fifaonline4.nexon.com/Profile/Stat/TeamInfo/" + fifa_id + "?n1Type=50", async function(error, response, body){
            var $ = cheerio.load(body);
            
            season_now_now = await $('body > div > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_current > img').attr('src');
            season_now_best = await $('body > div > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_last > img').attr('src');
            season_now_win = await $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__current > div.cont_wrap > div.grade_desc').text();
            
            season_past_final = await $('body > div > div.season_grade_info > div.season_grade_info__last > div.grade_current > img').attr('src');
            season_past_best = await $('body > div > div.season_grade_info > div.season_grade_info__last > div.grade_last > img').attr('src');
            season_past_win = await $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__last > div.grade_desc').text();

            season_best = await $('body > div > div.season_grade_info > div.season_grade_info__best > div.grade_current > img').attr('src');
            season_best_date = await $('body > div:nth-child(1) > div.season_grade_info > div.season_grade_info__best > div.grade_desc').text();


            crawl = {};

            crawl.season_now_now = season_now_now;
            crawl.season_now_best = season_now_best;
            crawl.season_now_win = season_now_win;

            crawl.season_past_final = season_past_final;
            crawl.season_past_best = season_past_best;
            crawl.season_past_win = season_past_win;

            crawl.season_best = season_best;
            crawl.season_best_date = season_best_date;

            res.locals.opponent_stat = crawl;
            
        });


console.log("ending!!!");
    })
    

}