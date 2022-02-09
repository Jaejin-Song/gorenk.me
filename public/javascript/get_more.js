
async function get_more_list(_data, _param) {
        var match1 = new Object();
        await $.ajax({
            url: "https://api.nexon.co.kr/fifaonline4/v1.0/matches/" + _data,
            dataType: 'json',
            data: _data,
            beforeSend: function (xhr) { 
                xhr.setRequestHeader("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMjA0NzQxMDY0OSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU5MTk0NjAzNSwiZXhwIjoxNjU1MDE4MDM1LCJpYXQiOjE1OTE5NDYwMzV9.U8GoMW3IvX6SZFR_0fgLzRAsrfoEhy69ZIRDF2vxLoI");
            },
            error: function (error) {
                console.log("error!");
                console.log(error);
            },
            success: function (data) {
                match1.matchid = _data;
                match1.matchdate = data.matchDate.slice(0, 10);

                if (data.matchInfo[0].matchDetail.matchEndType == 1) {
                    match1.result = 'fail';
                    match1.nickname = _param;
                    match1.matchresult = "몰수승";
                } else if (data.matchInfo[0].matchDetail.matchEndType == 2) {
                    match1.result = 'fail';
                    match1.nickname = _param;
                    match1.matchresult = "몰수패";
                } else {
                    match1.result = 'success'
                    //query.id랑 일치하는 정보를 앞으로 정렬
                    if (data.matchInfo[0].nickname.toUpperCase() == _param) {
                        match1.matchinfo1 = data.matchInfo[0];
                        match1.matchinfo2 = data.matchInfo[1];
                    } else if (data.matchInfo[1].nickname.toUpperCase() == _param) {
                        match1.matchinfo1 = data.matchInfo[1];
                        match1.matchinfo2 = data.matchInfo[0];
                    }
                }



                var new_div = document.createElement('div');
                new_div.className = "match_list";

                var new_date = document.createElement('span');
                new_date.className = "_date";
                var text1 = document.createTextNode(match1.matchdate);
                new_date.appendChild(text1);
                new_div.appendChild(new_date);

                var new_myname = document.createElement('span');
                new_myname.className = "_myname";
                if (match1.result == 'success') {
                    text2 = document.createTextNode(match1.matchinfo1.nickname);
                }
                else if (match1.result == 'fail') {
                    text2 = document.createTextNode(match1.nickname);
                }
                new_myname.appendChild(text2);
                new_div.appendChild(new_myname);

                //scorebox
                var new_div2 = document.createElement('div');
                new_div2.className = "_score_box";

                var new_myscore = document.createElement('span');
                new_myscore.className = "_myscore";
                if (match1.result == 'success') {
                    var text3 = document.createTextNode(match1.matchinfo1.shoot.goalTotal);;
                    new_myscore.appendChild(text3);
                }
                new_div2.appendChild(new_myscore);

                var new_vs = document.createElement('span');
                new_vs.className = "_vs";
                if (match1.result == 'success') {
                    a_detail = document.createElement('a');
                    a_detail.href = "/match/" + match1.matchid;
                    a_detail.className = "a_detail";
                    a_detail.style.color = "white";
                    a_detail.style.textDecoration = "none";
                    a_detail.style.marginLeft = "5px";
                    a_detail.style.marginRight = "5px";
                    text_detail = document.createTextNode("상세 기록");
                    a_detail.appendChild(text_detail);
                    new_vs.appendChild(a_detail);

                    // var text4 = document.createTextNode("VS");
                    // new_vs.appendChild(text4);
                } else{
                    new_vs.style.backgroundColor = "#444444";
                    new_vs.style.borderColor = "#444444";
                }
                new_div2.appendChild(new_vs);

                var new_opponent_score = document.createElement('span');
                new_opponent_score.className = "_opponent_score";
                if (match1.result == 'success') {
                    try {
                        var text5 = document.createTextNode(match1.matchinfo2.shoot.goalTotal);
                    } catch (err) {
                        var text5 = document.createTextNode(" ");
                        new_opponent_score.className = "none";
                    }
                    new_opponent_score.appendChild(text5);
                }
                new_div2.appendChild(new_opponent_score);

                new_div.appendChild(new_div2);

                //opponent
                var new_opponent = document.createElement('a');
                new_opponent.className = "_opponent";
                if (match1.result == 'success') {
                    try {
                        var text6 = document.createTextNode(match1.matchinfo2.nickname);
                    } catch (err) {
                        var text6 = document.createTextNode("");
                    }
                    new_opponent.appendChild(text6);
                    new_opponent.href = '/result/?id=' + text6.data;
                }
                var inner_opponent = document.createElement('div');
                inner_opponent.className = "inner_opponent";
                inner_opponent.appendChild(new_opponent);
                new_div.appendChild(inner_opponent);


                var new_match_result = document.createElement('span');
                new_match_result.className = "_match_result";
                if (match1.result == 'success') {
                    var text7 = document.createTextNode(match1.matchinfo1.matchDetail.matchResult);
                }
                else if (match1.result == 'fail') {
                    var text7 = document.createTextNode(match1.matchresult);
                }
                new_match_result.appendChild(text7);
                new_div.appendChild(new_match_result);

                var loc = document.getElementsByClassName("_match_list")[0];
                loc.appendChild(new_div);
                
            } //success 
        })


    } //for문 끝