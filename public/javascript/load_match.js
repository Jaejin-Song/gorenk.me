function load_match(list){
    var new_div = document.createElement('div');
    new_div.className = "match_list";

    var new_date = document.createElement('span');
    new_date.className = "_date";
    var text1 = document.createTextNode(list.matchdate);
    new_date.appendChild(text1);
    new_div.appendChild(new_date);

    var new_myname = document.createElement('span');
    new_myname.className = "_myname";
    if(list.result == 'success'){
        text2 = document.createTextNode(list.matchinfo1.nickname);
    }
    else if(list.result == 'fail'){
        text2 = document.createTextNode(list.nickname);
    }
    new_myname.appendChild(text2);    
    new_div.appendChild(new_myname);
   
    //scorebox
    var new_div2 = document.createElement('div');
    new_div2.className = "_score_box";

    var new_myscore = document.createElement('span');
    new_myscore.className = "_myscore";
    if(list.result == 'success'){
        var text3 = document.createTextNode(list.matchinfo1.shoot.goalTotal);;
        new_myscore.appendChild(text3);
    }
    new_div2.appendChild(new_myscore);

    var new_vs = document.createElement('span');
    new_vs.className = "_vs";
    if(list.result == 'success'){
        a_detail = document.createElement('a');
        a_detail.href = "/match/" + list.matchid;
        a_detail.target = "_blank";
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
    if(list.result == 'success'){
        try{
        var text5 = document.createTextNode(list.matchinfo2.shoot.goalTotal);
        } catch(err){
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
    if(list.result == 'success'){
        try{
        var text6 = document.createTextNode(list.matchinfo2.nickname);
        } catch (err){
            var text6 = document.createTextNode("");
        }
        new_opponent.appendChild(text6);
        new_opponent.href = '/result/?id=' + text6.data; ////////////////////////////////////////////////////////
    }
    var inner_opponent = document.createElement('div');
    inner_opponent.className = "inner_opponent";
    inner_opponent.appendChild(new_opponent);
    new_div.appendChild(inner_opponent);

    var new_match_result = document.createElement('span');
    new_match_result.className = "_match_result";
    if(list.result == 'success') {
        var text7 = document.createTextNode(list.matchinfo1.matchDetail.matchResult);
    }
    else if(list.result == 'fail'){
        var text7 = document.createTextNode(list.matchresult);
    }
         new_match_result.appendChild(text7);
    new_div.appendChild(new_match_result);

    return new_div;
}