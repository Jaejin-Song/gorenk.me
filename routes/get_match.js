const axios = require('axios');

module.exports = async function (data, _param, res) {
    //recent match 설정
    for (var b = 0; b < data.length; b++) {
        var matches1 = await axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/matches/" +
            data[b], {
            headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
        });
        //플레이어 가져 올 수 있는 매치를 recent match로 설정
        if (matches1.data.matchInfo[0].nickname.toUpperCase() == _param.toUpperCase()) {
            if (matches1.data.matchInfo[0].player.length == 18) {
                var recent_match = await data[b];
                break;
            }
        }
        else if (matches1.data.matchInfo[1].nickname.toUpperCase() == _param.toUpperCase()) {
            if (matches1.data.matchInfo[1].player.length == 18) {
                var recent_match = await data[b];
                break; ''
            }
        }
    }


    var match_list = [];
    res.locals.num_total = data.length;

    if (data.length < 20 || data.length==20) num = data.length;
    else num = 20;

    for (var l = 0; l < num; l++) {
        var match1 = {};
        var matches = await axios.get("https://api.nexon.co.kr/fifaonline4/v1.0/matches/" +
            data[l], {
            headers: { authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI" }
        });
        match1.matchid = data[l];
        // await console.log(matches.data);
        match1.matchdate = matches.data.matchDate.slice(0, 10);
        // console.log("11111",matches.data.matchInfo[0].matchDetail.matchEndType);
        //몰수승,패 확인 후 수정
        if (matches.data.matchInfo[0].matchDetail.matchEndType == 1) {
            match1.result = 'fail';
            match1.nickname = _param;
            match1.matchresult = "몰수승";
        } else if (matches.data.matchInfo[0].matchDetail.matchEndType == 2) {
            match1.result = 'fail';
            match1.nickname = _param;
            match1.matchresult = "몰수패";
        } else {
            match1.result = 'success'
            //query.id랑 일치하는 정보를 앞으로 정렬
            if (matches.data.matchInfo[0].nickname.toUpperCase() == _param.toUpperCase()) {
                match1.matchinfo1 = matches.data.matchInfo[0];
                match1.matchinfo2 = matches.data.matchInfo[1];
            } else if (matches.data.matchInfo[1].nickname.toUpperCase() == _param.toUpperCase()) {
                match1.matchinfo1 = matches.data.matchInfo[1];
                match1.matchinfo2 = matches.data.matchInfo[0];
            }
        }
        match_list.push(match1);
    }
    res.locals.match_num = num;
    res.locals.match_list = JSON.stringify(match_list);


    return recent_match
}