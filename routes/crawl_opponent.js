const cheerio = require("cheerio");
const request = require("request");
const axios = require('axios');

module.exports = async function(res, param) {
    myurl2 = await "http://fifaonline4.nexon.com/profile/common/PopProfile?strCharacterName=" + param;
    await axios.get(myurl2).then(resp =>{
        get_id = resp.request.path;
        var split = get_id.split('/');
        fifa_id = split[4];
    });

    

    await request("http://fifaonline4.nexon.com/profile/owner/popup/" + fifa_id, function(error, response, body){
        if(error) throw error;

        $ = cheerio.load(body);
        
        date_from = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_top > div.since > div.text').text();
        mark_national = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.major > div.text > div > img').attr('src');
        name_national = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.major > div.text > span').text();
        mark_club = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.club > div.text > div > img').attr('src');   
        name_club = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_middle > div.team > div.club > div.text > span').text();
        
        profile_rank = $('#profilePop > div > div > div.header > div.coach_info > div.rank > div > img').attr('src');
        profile_mark = $('#profilePop > div > div > div.header > div.coach_info > div.crest > div > img').attr('src');
        team_value = $('#profilePop > div > div > div.content_main > div > div.content > div.coach_detail_bottom > div > div.text').text();
        
        crawl_owner = {};

        crawl_owner.date_from = date_from;
        crawl_owner.mark_national = mark_national;
        crawl_owner.mark_club = mark_club;
        crawl_owner.name_national = name_national;
        crawl_owner.name_club = name_club;

        crawl_owner.profile_rank = profile_rank;
        crawl_owner.profile_mark = profile_mark;
        crawl_owner.team_value = team_value;
       
        res.locals.crawl_opponent = crawl_owner;

    });
}