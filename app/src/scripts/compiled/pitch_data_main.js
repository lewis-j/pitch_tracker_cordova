// xmlhttprequest url 
const url = "http://localhost:81/pitch_tracker_cordova/php/";

/*next file*/

window.addEventListener('load', initMenu, false);

function initMenu() {
  console.log("reading new pitch");
  document.getElementById("left-nav-menu").style.left = "-18vw";

  $('#menu-btn').click(function() {

    if (document.getElementById("left-nav-menu").style.left == "-18vw") {
      document.getElementById("left-nav-menu").style.left = "0px";
      document.addEventListener("click", closeLeftMenu, true);




    } else {

      closeAllMenus();
    }



  });

  $('#edit-roster').click((e) => {
    window.location.href = "roster_edit.html";
  });
  $('#cubs-pitch').click((e) => {
    window.location.href = "pitch_data.html";
  });

  $('#pitch-tracker').click((e) => {
    window.location.href = "../index.html";
  });

  function closeAllMenus() {
    document.getElementById("left-nav-menu").style.left = "-18vw";
    removeMenuListeners();

  }

  function closeLeftMenu(event) {
    var ele = document.getElementById("left-nav-menu");
    // event.preventDefault();
    // event.stopPropagation();
    if (event.target !== ele && !ele.contains(event.target)) {
      console.log("event clicked");
      closeAllMenus()
    }

  }

  function removeMenuListeners() {
    document.removeEventListener("click", closeLeftMenu, true);

  }


}

/*next file*/

$(function(){
//login modal
  $('#modal-container').append(`<div class="modal" tabindex="-1" role="dialog" id="login-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Login to access feature</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="login-body">
          <form id="login-form">
    <div class="form-group">
      <label for="userName">Username</label>
      <input type="text" class="form-control" id="userName" placeholder="Enter email" name="username">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password" name="password">
    </div>
    <button id="login-submit" type="submit" name="login-submit" class="btn btn-primary">Submit</button>
    <p>Don't have an account?<a id="sign-up"> Sign up</a></p>
  </form>
        </div>
      </div>
    </div>
  </div>
`);

$('#modal-container').append(`<div class="modal" tabindex="-1" role="dialog" id="register-modal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sign Up</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="register-body">
        <form id="register-form">
  <div class="form-group">
    <label for="userName">Username</label>
    <input type="text" class="form-control" id="userName" placeholder="Enter userName" name="username">
  </div>
  <div class="form-group">
    <label for="userName">Email</label>
    <input type="email" class="form-control" id="email" placeholder="Enter email" name="email">
  </div>
  <div class="form-group">
  <label for="role">Role</label>
  <select id="role" class="form-control">
    <option selected>Player</option>
    <option>Coach</option>
  </select>
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" id="pwd" placeholder="Password" name="pwd">
  </div>
  <div class="form-group">
    <label for="confirmPwd">Confirm Password</label>
    <input type="password" class="form-control" id="confirmPwd" placeholder="confirm password" name="confirmPwd">
  </div>
  <button id="register-submit" type="submit" name="register-submit" class="btn btn-primary">Submit</button>
</form>
      </div>
    </div>
  </div>
</div>
`);

      $('#login-form').submit((e)=>{
        var callback = $('#modal-container').attr('data-callback');
          console.log("form submitted", callback);
                var params = `username=${$('#userName').val()}&password=${$('#password').val()}&login-submit=submit`;

                console.log('params',params);
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                      console.log("login response",xhttp.response);

                      var obj = JSON.parse(xhttp.response);
                      console.log("length of errors:",Object.entries(obj.errors).length );
                      if(Object.entries(obj.errors).length!==0){
                        var errors = obj.errors;
                        for(const item in errors){
                              $('#login-body').prepend(`<div class=alert-danger>${errors[item]}</div>`);
                        }
                      }else{
                        $('#login-modal').modal('toggle');
                        window[callback].call();
                      }




                      }
                    }
                    xhttp.onerror = function () {
                    console.error("** An error occurred during the transaction",xhttp.response);
                  };


                xhttp.open("POST",url + "SQLConnect.inc.php");
                xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhttp.send(params);
                e.preventDefault();
              });

    $('#register-form').submit((e)=>{
      console.log("form submitted");
            var params = `username=${$('#userName').val()}&password=${$('#pwd').val()}&confirmPassword=${$('#confirmPwd').val()}&email=${$('#email').val()}&role=${$('#role').val()}&register-submit=submit`;


            console.log('params',params);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  console.log("login response",xhttp.response);
                  console.log("login response",JSON.parse(xhttp.response));
                  var obj = JSON.parse(xhttp.response);
                  if(Object.entries(obj.errors).length!==0!==0){
                    var errors = obj.errors;
                    for(const item in errors){
                          $('#register-body').prepend(`<div class=alert-danger>${errors[item]}</div>`);
                    }
                  }else{
                      $('#register-modal').modal('toggle');
                  }


                // window.open('../links/season_select_menu.html');

                  }
                }
                xhttp.onerror = function () {
                console.error("** An error occurred during the transaction",xhttp.response);
              };


            xhttp.open("POST",url + "SQLConnect.inc.php");
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.send(params);
e.preventDefault();



    });


      $('#logout').click(()=>{
         var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
             if (this.readyState == 4 && this.status == 200) {
                 window.open('../index.html','_self');
               }
             }
             xhttp.onerror = function () {
             console.error("** An error occurred during the transaction",xhttp.response);
           };

         xhttp.open("POST",url + "logout.php");

         xhttp.send();
      });
$('#sign-up').click(()=>{
  $('#login-modal').modal('toggle');
  $('#register-modal').modal('toggle');
});

    });

/*next file*/

//pitch_data.js
var rosterList = [];

var colors = ["red","blue","green","purple","orange"];

function OnDeviceReady(){

  getSeason();

console.log("device ready");
   document.getElementById('season-select').addEventListener('change', (event) => {
                   getPlayers(rosterList[event.target.options.selectedIndex]);
                   console.log("change event fired!",rosterList[event.target.options.selectedIndex]);
            });
   document.getElementById('edit-roster').addEventListener('click', (event) => {

                  window.open('./roster_edit.html');

   });

}

function getStats(e){
  e.preventDefault();

  var player = document.getElementById('pitcherSelect').options,
      player_id = player[player.selectedIndex].dataset.id,
      name = player[player.selectedIndex].innerHTML;

// getPitchersData({player_id: player_id });
 getPitchersData(name, {player_id: player_id, options: ["`srjc_game-pitches`.`firstpitch` =  '1'","`srjc_game-pitches`.`batterhandness` =  'Right'","`srjc_game-pitches`.`batterhandness` =  'Left'" ],
                           titles: ['All Pitches', 'First Pitches', 'Right Handed Hitters', 'Left Handed Hitters'] });





}

function getPitchersData( name, sqlCallData ){

  console.log("sqldata", sqlCallData);

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST",url + "pitch_data.php");

  xhttp.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        var obj = JSON.parse(xhttp.response);

        createView(name , obj);


      }
  };
  xhttp.onerror = function () {
  console.error("** An error occurred during the transaction");
};

  xhttp.send(JSON.stringify(sqlCallData));


}

function createView(name, viewData ){

  var opponent = viewData[opponent] || null;
  var opponent = true;
   $('#statTables').empty();

  console.log("create view:", viewData);
  var htmlString ="";

  var htmlString = `<h1 id='pitcher-title'>${name}</h3>`;

  viewData.forEach(({ tableTitle , data, coords }, index)=>{
    htmlString+=`<div class='row table-group'><div class='col-md-${(coords)?"7":"12"}'>`;
    htmlString+=`<div class='col-sm-12'><div class='pitcher-name'>${name}</div> <div class='${(opponent)? "title" : "game-title"}'>${tableTitle}</div></div>`;

    var {metaStats, pitchTypes} = data;
    var {allBats, allStrikes, allWalks, allHits} = metaStats;

    htmlString+=`<div class='my-tables row'><table class='game-stat table table-striped table-border  table-sm'><thead><tr>
  <th scope='col'>Hitters</th><th scope='col'>Strike Outs</th><th scope='col'>Walks</th><th scope='col'>Hits</th></tr></thead><tbody>
    <tr>
               <td>${allBats}</td>
               <td>${allStrikes}</td>
               <td>${allWalks}</td>
               <td>${allHits}</td>
          </tr>
          </tbody></table></div>
          <div class='row'>
                <div class='col-md-1'>
                <table class='table table-striped table-sm key'>
                <tbody>
                <tr>
                 <th scope='row'>${pitchTypes[0].title}</th>
                </tr>
                <tr>
                 <th scope='row'>${pitchTypes[1].title}</th>
                </tr>
                <tr>
                 <th scope='row'>${pitchTypes[2].title}</th>
                </tr>
                <tr>
                 <th scope='row'>${pitchTypes[3].title}</th>
                </tr>
                <tr>
                 <th scope='row'>${pitchTypes[4].title}</th>
                </tr>
                 <tr>
                 <th scope='row'>${pitchTypes[5].title}</th>
                </tr>
                </tbody>
                </table>
                </div>

  <div class='my-tables col-md-6'><table class='table table-striped table-border table-sm'>
    <thead>
       <tr><th scope='col'></th>
      <th scope='col' colspan='3'>Pitch Strike %</th>
    </tr>
    <tr>
      <th scope='col'>PITCHES</th>
      <th scope='col'>STRIKES</th>
      <th scope='col'>BALLS</th>
      <th scope='col'>STRIKE %</th>
  </tr>
  </thead>
  <tbody>`;

var percTable ="", veloTable="";
        pitchTypes.forEach(({title, total, balls, strikes, strikePerc, minSp, maxSp, avgSp, totalBat })=>{
        percTable+=`<tr>
               <td>${total}</td>
               <td>${strikes}</td>
               <td>${balls}</td>
               <td>${strikePerc}</td>
          </tr>`;
        veloTable+=`<tr>
               <td>${minSp}</td>
               <td>${maxSp}</td>
               <td>${avgSp}</td>
          </tr>`

      });
  htmlString+=percTable+`</tbody></table></div><div class='my-tables col-md-5'>
          <table class='table table-striped table-border table-sm'>
   <thead>
      <tr>
      <th scope='col'></th>
      <th scope='col' colspan='3'>Pitch Velocity</th>
      </tr>
      <tr>
      <th scope='col'>MIN</th>
      <th scope='col'>MAX</th>
      <th scope='col'>AVE</th>
      </tr>
  </thead>
  <tbody>`+veloTable+`</tbody></table></div></div></div>`;

  if(coords){
    var svgId = `mySVG${index}`;
   htmlString+=`<div class="chart-data col-md-5">
                      <div class="chart-key">
                <table class='table table-striped table-border table-sm key2'>
                  <thead>
                    <tr>
                      <th scope="row">Key</th>
                    </tr>
                  </thead>
                <tbody>
                <tr>
                 <th scope='row'><div class ="legend-item" style="background-color:${colors[0]}">FB</div></th>
                </tr>
                <tr>
                  <th scope='row'><div class ="legend-item" style="background-color:${colors[1]}">CB</div></th>
                </tr>
                <tr>
                <th scope='row'><div class ="legend-item" style="background-color:${colors[2]}">CH</div></th>
                </tr>
                <tr>
                  <th scope='row'><div class ="legend-item" style="background-color:${colors[3]}">SL</div></th>
                </tr>
                <tr>
                <th scope='row'><div class ="legend-item" style="background-color:${colors[4]}">OT</div></th>
                </tr>
                </tbody>
                </table>
                </div>
          <svg class="cust-svg" width="432px" height="473px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="${svgId}">
  <rect id="rect"  x="2%" y="0" width="96%" height="100%"
  style="fill:white;stroke:rgba(0,0,0,0);stroke-width:2;fill-opacity:0.9;stroke-opacity:0.9" />
    <rect x="25%" y="20%" width="50%" height="60%"
  style="fill:white;stroke:black;stroke-width:3;fill-opacity:0.1;stroke-opacity:0.9" />
  <line x1="50%" y1="20%" x2="50%" y2="80%" style="stroke:black;stroke-width:3" />
  <line x1="25%" y1="40%" x2="75%" y2="40%" style="stroke:black;stroke-width:3" />
</g>
</svg>
        </div></div>`;
        $('#statTables').append(htmlString);
        plotPoints(coords, colors, svgId);
         htmlString ="";
  }else{

    htmlString+=`</div>`;

  }
   });


   $('#statTables').append(htmlString);

}

function plotPoints(coords, colors, id){


console.log("coords", coords);

 var svgNS = "http://www.w3.org/2000/svg";
console.log(coords);
var color;
coords.forEach((coord)=>{
if(coord.t == "FB"){
color = colors[0];
}else if(coord.t == "CB"){
color = colors[1];
}else if(coord.t == "CH"){
  color = colors[2];
}else if(coord.t == "SL"){
 color = colors[3];
}else if(coord.t == "other"){
  color = colors[4];
}

myCircle = document.createElementNS(svgNS, "circle"); //to create a circle. for rectangle use "rectangle"
myCircle.setAttributeNS(null, "class", "mycircle");
myCircle.setAttributeNS(null, "cx", coord.x+"%");
myCircle.setAttributeNS(null, "cy", coord.y+"%");
myCircle.setAttributeNS(null, "r", 8);
myCircle.setAttributeNS(null, "fill", color);
myCircle.savedToGraph = false;

document.getElementById(id).appendChild(myCircle);
});
}

function addPlayerFormOptions( teamList ){


       var pitcherMenu = document.getElementById("pitcherSelect");
           pitcherMenu.innerHTML = "";

           teamList.forEach(({_id, pitcher_name })=>{
                var node = document.createElement("option");
                node.setAttribute("data-id", _id);
                var textnode = document.createTextNode(pitcher_name);
                node.appendChild(textnode);
                console.log("new node:  ", node);

                pitcherMenu.appendChild(node);
           });


}

function addRosterFormOptions( rosterList ){

  rosterList.forEach((team, index)=>{
       var node = document.createElement("option");
       var textnode = document.createTextNode(team.title + " " + team.season + " " + team.year);
       node.appendChild(textnode);
       var data = document.createAttribute("data-index");
           data.value = index;
       node.setAttributeNode(data);
       if(index == 0){
         var att = document.createAttribute("selected");
                   node.setAttributeNode(att);
       }
       document.getElementById("season-select").appendChild(node);
  });



}

function getPlayers(rosterData){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("RESPONSE::::::::::",xhttp.response);
        var obj = JSON.parse(xhttp.response);

        addPlayerFormOptions(obj);
      }
    };

    xhttp.onerror = function () {
    console.error("** An error occurred during the transaction");
  };
console.log("roster data:  ", rosterData);
  xhttp.open("POST",url + "get_team_byid.php");
  xhttp.send(JSON.stringify(rosterData));

}

function getSeason(){


   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
         console.log("RESPONSE roster list  :  ", xhttp.response);
         var object =  JSON.parse(xhttp.response);
         if(object.loggedIn){
           rosterList = object.teamList;
           console.log("roster list  :  ", rosterList);
           addRosterFormOptions(rosterList);
           getPlayers(rosterList[0]);
         }else{
           console.log("open modal",$('#login-modal'));
           $('#login-modal').modal('toggle');


         }
       }
       xhttp.onerror = function () {
       console.error("** An error occurred during the transaction",xhttp.response);
     };
   };
   xhttp.open("POST",url + "get_team_list.php");

   xhttp.send();




}

window.addEventListener('load', OnDeviceReady);

//# sourceMappingURL=pitch_data_main.js.map