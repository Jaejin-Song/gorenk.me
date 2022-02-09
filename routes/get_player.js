const axios = require('axios');
const fs = require('fs');

module.exports = async function (res, recent_match, _param) {
    // 최근 공식경기에서 사용한 선수 목록
    const search_player = await axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/matches/" +
        recent_match, {
        headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
    });



    //경기정보중 내 정보 가져오기
    var matchinfo = {};
    if (search_player.data.matchInfo[0].nickname.toUpperCase() == _param.toUpperCase()) {
        matchinfo = search_player.data.matchInfo[0];
    } else if (search_player.data.matchInfo[1].nickname.toUpperCase() == _param.toUpperCase()) {
        matchinfo = search_player.data.matchInfo[1];
    }

    let json_position = fs.readFileSync('public/json/spposition.json');
    json_position = await JSON.parse(json_position);

    const player_name = await axios.get("https://static.api.nexon.co.kr/fifaonline4/latest/spid.json");
    const player_season = await axios.get("https://static.api.nexon.co.kr/fifaonline4/latest/seasonid.json");

    var player_leading = [];
    var player_bench = [];
    for (var i = 0; i < 18; i++) {
        for (var j = 0; j < json_position.length; j++) {
            if (matchinfo.player[i].spPosition == json_position[j].spposition) {
                matchinfo.player[i].spPosition = json_position[j].desc;
                break;
            }
        }
        for (var k = 0; k < player_name.data.length; k++) {
            if (String(matchinfo.player[i].spId).slice(-6) == String(player_name.data[k].id).slice(-6)) {
                matchinfo.player[i].name = player_name.data[k].name;
                break;
            }
        }
        for (var m = 0; m < player_season.data.length; m++) {
            if(String(matchinfo.player[i].spId).slice(0,3) == '235'){
                back = String(matchinfo.player[i].spId);
                matchinfo.player[i].spId = '230' + back;
            }

            if (String(matchinfo.player[i].spId).slice(0, 3) == player_season.data[m].seasonId) {
                matchinfo.player[i].season_img = player_season.data[m].seasonImg;
                break;
            } 
        }
        if (matchinfo.player[i].spPosition != "SUB") {
            matchinfo.player[i].pid = String(matchinfo.player[i].spId).slice(-6);
            player_leading.push(matchinfo.player[i]);
        }
        else {
            matchinfo.player[i].pid = String(matchinfo.player[i].spId).slice(-6);
            player_bench.push(matchinfo.player[i]);
        }
    }

    res.locals._leading_list = await JSON.stringify(player_leading);
    res.locals.leading_list = await player_leading;
    res.locals._bench_list = await JSON.stringify(player_bench);
    res.locals.bench_list = await player_bench;
    //이승우kor
}