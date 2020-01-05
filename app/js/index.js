



function inititalizeState(){
  //colors for pitch radio buttons and cirlce elements
 // [FASTBALL, CHANGEUP, SLIDER, CURVEBALL, OTHER ]
 const pitchColors = ["red", "blue", "green", "purple", "orange"];

document.body.style.setProperty('--FB-color',pitchColors[0]);
document.body.style.setProperty('--CH-color',pitchColors[1]);
document.body.style.setProperty('--SL-color',pitchColors[2]);
document.body.style.setProperty('--CB-color',pitchColors[3]);
document.body.style.setProperty('--OT-color',pitchColors[4]);

 // object structure for sql database
 var PlayerData = {
   // game session data(persist through game)
   objType: "1",
   /* jad */
   startingPitcher: true,
   //        player_id: "sql index"
   //        gameType : "GAME, InterSquad, OR BULLPEN ",
   //        date : "CURRENT DATE",
   //        time :"Current Time",
   //        team: "SRJC TEAM",
   //        opponent: "RIVAL TEAM",
   //        playerName : "PLAYER NAME",
 }

 // data to collect for each pitch
 var pitchData = [
   //     {
   //        objType: "2", /* jad */
   //        play: "BALL,STRIKE,HIT,MISS",
   //        pitchType: "CHANGEUP, SLIDER, FASTBALL, CURVEBALL",
   //        pitchSpeed:"MPH",
   //        xCoord: "GRAPHS X COORDINATE IN PERCENT",
   //        yCoord: "GRAPHS Y COORDINATE IN PERCENT",
   //        firstPitch: "BOOLEAN FOR FIRST PITCH AT EACH UP AT BAT",
   //        pitchCount: "CURRENT PITCH COUNT",
   //        endPlay:"WALK, STRIKEOUT, HIT",
   //        batterHandedness: "LEFT OR RIGHT HANDED"
   //    }
 ];

 //set dynamic style rules
 document.getElementById("left-nav-menu").style.left = "-17vw";
 $('.clear-header').css('top', $('#header-title').height());
  scalePitchGraph();
 window.addEventListener('resize', ()=>{
   scalePitchGraph();
});


 /* Begin jad */
 var gl_newPitcher = false; /*switching new pitch to boolean 0=false 1=true*/
 /* End jad */
 var gameCount = { totalStrikes: 0, totalBalls: 0, pitchCount: 0, ballCount: 0, strikeCount: 0 };
 var db = new PouchDB("pitch");
 var myCircle;
 var newCircle = true;
 var redoHandlerInit = false;
 var mphValue = 0;
 var redoPitch = [];
 //pitcher id for pouchDB index
 var pitcher_id;
 var arcs, arc, pie, paths, strikePerc;

 renderPie([0,0]);
 change([0,1]);



 $('#mySVG').click((evt) => {

   var event = evt.target.getBoundingClientRect();
   var outerRect = document.getElementById("rect").getBoundingClientRect();
   var x = (((evt.clientX - outerRect.left) / (outerRect.right - outerRect.left)) * 100).toString() + "%";
   var y = (((evt.clientY - outerRect.top) / (outerRect.bottom - outerRect.top)) * 100).toString() + "%";
   var svgNS = "http://www.w3.org/2000/svg";
   if (event.left === outerRect.left) {
     document.getElementById("switch_ball").checked = true;
        if (gameCount.ballCount == 3) {
         // document.getElementById('label_w').classList.add('warning_indicator');

     }
   }
   else {
     document.getElementById("switch_stk").checked = true;
     if (gameCount.strikeCount >= 2) {

       // document.getElementById('label_sOut').classList.add('warning_indicator');
     }
   }

         if (redoHandlerInit) {
       $('#data-entry').text("Enter");
       $('#data-entry').off('click');
       $('#data-entry').on('click', collectData);

       redoHandlerInit = false;
       newCircle = true;
       redoPitch = [];

     }



   if (newCircle) {
     myCircle = document.createElementNS(svgNS, "circle"); //to create a circle. for rectangle use "rectangle"
     myCircle.setAttributeNS(null, "class", "mycircle");
     myCircle.setAttributeNS(null, "cx", x);
     myCircle.setAttributeNS(null, "cy", y);
     myCircle.setAttributeNS(null, "r", 8);
     myCircle.setAttributeNS(null, "fill", "black");
     // myCircle.setAttributeNS(null, "stroke", "black");
     // myCircle.setAttributeNS(null, "stroke-width", "1px");
     myCircle.savedToGraph = false;

     document.getElementById("mySVG").appendChild(myCircle);
     newCircle = false;

       if (document.getElementById('mph-dropdown').classList.value != "mph-slide") {
     document.getElementById('mph-dropdown').classList.toggle('mph-slide');
   }
   }
   else {
     myCircle.setAttributeNS(null, "cx", x);
     myCircle.setAttributeNS(null, "cy", y);
   }




 });

 $('#data-entry').on("click", collectData);


 function collectData() {


   var pitchObject = {};

   pitchObject.objType = "2"; /* jad */

   if (isValid()) {
     pitchObject.xCoord = myCircle.getAttributeNS(null, "cx");
     pitchObject.yCoord = myCircle.getAttributeNS(null, "cy");

     if (pitchObject.firstPitch = document.getElementById('first-pitch').checked) {
       document.getElementById('first-pitch').checked = false;
     }

     if (document.getElementById("switch_lhh").checked) {
       pitchObject.batterHandedness = "Left";
     }
     else if (document.getElementById("switch_rhh").checked) {
       pitchObject.batterHandedness = "Right";
     }

     var radioEle = document.getElementsByName("switch_play");
     for (var i = 0; i < radioEle.length; i++) {
       if (radioEle[i].checked) {
         radioEle[i].checked = false;
         pitchObject.play = radioEle[i].getAttribute('value');
         if (pitchObject.play == "Strike") {
           gameCount.totalStrikes++;
           gameCount.strikeCount++;



         }
         else {
           gameCount.totalBalls++;
           gameCount.ballCount++;
         }
       }
     }


     var radioEle = document.getElementsByName("switch_pitch");
     for (var i = 0; i < radioEle.length; i++) {
       if (radioEle[i].checked) {
         radioEle[i].checked = false;
         pitchObject.pitchType = radioEle[i].getAttribute('value');

         //assign colors to circles based on pitch selected

         pitchObject.pitchColor = pitchColors[i];


       }

     }

     var radioEle = document.getElementsByName("switch_end");
     pitchObject.endPlay = "continue";
     for (var i = 0; i < radioEle.length; i++) {
       if (radioEle[i].checked) {
         radioEle[i].checked = false;
         pitchObject.endPlay = radioEle[i].getAttribute('value');
         document.getElementById('first-pitch').checked = true;
         resetBatterStance();
         gameCount.ballCount = 0;
         gameCount.strikeCount = 0;
         // document.getElementById('label_sOut').classList.remove("warning_indicator");
         // document.getElementById('label_w').classList.remove("warning_indicator");

       }
     }

     pitchObject.pitchSpeed = mphValue;
     document.getElementById('mph-text').innerHTML = "00";
     mphValue = 0;
     myCircle.savedToGraph = true;
     gameCount.pitchCount++;

     pitchObject.gameCount = gameCount;
     pitchObject.date = getTodaysDate("yyyy/mm/dd");
     pitchObject.timeStamp = getCurrentTime();
     myCircle.setAttributeNS(null, "fill", pitchObject.pitchColor);
     newCircle = true;
     /* Begin jad */
     if (gl_newPitcher) /*switching new pitch to boolean 0=false 1=true*/ {
       gl_newPitcher = false;
       pitchObject._id = new Date();
       PlayerData._id = new Date();

       pitchObject.pitcher_id = PlayerData._id;


       storePouch(PlayerData).then(function(res) {
         return storePouch(pitchObject);
       }).catch(function(err) {
         console.error(err)
       });

     }
     else {
       pitchObject._id = new Date();
       pitchObject.pitcher_id = PlayerData._id;
       storePouch(pitchObject).catch((err) => {
         console.error(err);
       });
     }
     /* End jad */
     pitchData.push(pitchObject);

     //updatedata on left panel ui
     updateGameCountUI(gameCount);



   }







 }

 function isValid() {
   var valid = true;
   if (newCircle) {
     alert('No coordinate point added to pitch zone! Add a coordinate to continue.');
     valid = false;
   }
   if (mphValue == 0) {
     document.getElementById('mph-ui').classList.add('ui_invalid');
     valid = false;
   }

   var batterUI = document.querySelectorAll("#batter-handedness label");
   if ((!document.getElementById("switch_lhh").checked) && (!document.getElementById("switch_rhh").checked)) {
     batterUI.forEach(function(item) {
       item.classList.remove("ui_invalid");
       setTimeout(function() {
         item.classList.add("ui_invalid");
       }, 1);

     });
     valid = false;
   }
   else {
     batterUI.forEach(function(item) { item.classList.remove("ui_invalid"); });
   }
   var radioEle = document.getElementsByName("switch_pitch");
   var wasChecked = false;
   for (var i = 0; i < radioEle.length; i++) {
     if (radioEle[i].checked) {
       wasChecked = true;
     }
   }
   if (!wasChecked) {
     valid = false;
     var pitchSelectUI = document.querySelectorAll("#pitch-fields label");
     pitchSelectUI.forEach(function(item) {
       item.classList.add('ui_invalid');

     });
   }

   return valid;




 }
 //Remove last entered pitch data
 $('#undo-entry').click((event) => {
   if (pitchData.length > 0) {
     var circle = document.getElementsByClassName('mycircle');
     var lastElement = circle[circle.length - 1];
     if (lastElement.savedToGraph) {
       db.allDocs({ include_docs: true, startkey: '_', limit: 2, descending: true })
         .then(res => {
           if (pitchData.length == 0) {

             updateGameCountUI(zeroGameCount(gameCount));
           }
           else {
             gameCount = res.rows[1].doc.gameCount;
             updateGameCountUI(gameCount);

           }

           return db.get(res.rows[0].id);



         }).then((doc) => {

           redoPitch.push({ circle: lastElement, pitchData: doc });

           return db.remove(doc);

         }).catch((err) => {
           console.error(err);
         });

       pitchData.pop();


     }
      if (!redoHandlerInit) {
         $('#data-entry').text("Redo");
         $('#data-entry').off('click');
         $('#data-entry').on('click', redoEntry);
         redoHandlerInit = true;

       }
     //Remove data from array and erase circle
     lastElement.parentNode.removeChild(lastElement);
   }
 });

 function redoEntry() {
   if (redoPitch.length > 0) {


     delete redoPitch[redoPitch.length - 1].pitchData._rev;


     gameCount = redoPitch[redoPitch.length - 1].pitchData.gameCount;
     updateGameCountUI(gameCount);

     pitchData.push(redoPitch[redoPitch.length - 1].pitchData);

     storePouch(redoPitch[redoPitch.length - 1].pitchData, "pitch").catch((err) => {
       console.error(err);

     });
     document.getElementById("mySVG").appendChild(redoPitch[redoPitch.length - 1].circle);
     redoPitch.pop();

   }




 }

 function zeroGameCount(gameCount) {

   gameCount.ballCount = 0;
   gameCount.strikeCount = 0;
   gameCount.totalBalls = 0;
   gameCount.totalStrikes = 0;
   gameCount.pitchCount = 0;

   return gameCount;
 }

 function getCurrentTime() {

   var today = new Date();
   return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
 }

 function getTodaysDate(format) {
   var today = new Date();
   var dd = today.getDate();
   var mm = today.getMonth() + 1; //January is 0!

   var yyyy = today.getFullYear();
   if (dd < 10) { dd = '0' + dd; }
   if (mm < 10) { mm = '0' + mm; }

   if (format === "yyyy/mm/dd") {
     return (yyyy + '/' + mm + '/' + dd);
   }
   else {
     return (mm + '/' + dd + '/' + yyyy);
   }

 }

 function resetBatterStance() {

   //    document.getElementById('right-batter').style.backgroundColor = "white";
   //    document.getElementById('right-batter').style.color = "black";
   //    document.getElementById('left-batter').style.backgroundColor = "white";
   //    document.getElementById('left-batter').style.color = "black";
   document.getElementById("switch_rhh").checked = false;
   document.getElementById("switch_lhh").checked = false;
   document.getElementById('right-batter').style.display = "none";
   document.getElementById('left-batter').style.display = "none";
 }

 var pitchersData = [];



 getPouchRosterList().then((res) => {

   res.forEach((item,index) => {
     item = item.doc;

     if(res.length-1 == index){
       $('#roster-list').append("<option selected data-id="+item._id+">" + item.year + " " + item.season + " " + item.title +"</option");
       rosterIndex = parseInt(item._id);
     }else{
         $('#roster-list').append("<option data-id="+item._id+">" + item.year + " " + item.season + " " + item.title +"</option");
     }

   });
   return getPouchRoster(1);

 }).then((res)=>{
   pitchersData = res;
     res.forEach((item)=>{
         $('#pitcher-name').append("<option data-id="+item._id+">" + item.pitcher_name +"</option");
     });

 }).catch((err) => {
   console.error(err)
 });


$('#roster-list').change((e)=>{
 var index = parseInt(e.target.options[e.target.selectedIndex].dataset.id);
   getPouchRoster(index).then((res)=>{
     console.log("roster response", res);
     $('#pitcher-name').empty();
     $('#pitcher-name').append("<option selected disabled value='unselected'><i>Select Pitcher</i></option>");
     pitchersData = res;
     res.forEach((item)=>{
         $('#pitcher-name').append("<option data-id="+item._id+">" + item.pitcher_name +"</option");
     });
 });
});

 var opposingTeams = ["SRJC", "Chabot", "De Anza", "Marin", "Laney", "Canada", "Solano", "Contra Costa", "Cabrillo", "San Juaquin Delta", "Modesto", "Diablo Valley", "Folsom Lake", "American River", "Cosumnes River", "Monterey Peninsula", "Sacromento City", "Seirra"];

 opposingTeams.forEach((team) => {
   $('#op-team-name').append(`<option>${team}</option`);

 });



 var mphFirstClick = true;
 var pitcherSelectInit = false;
 var styledCircle;



 // Open numerical keybaord
 $('#HUD-2 g ').click(function(event) {

   //Assign value from first click
   var value = $(this)[0].lastElementChild.innerHTML;
   if (mphFirstClick) {
     mphValue = 0;
     mphValue = value;
     mphFirstClick = false;
     styledCircle = this.children[0].style;
     styledCircle.fill = "red";

   }
   else {
     //Assign value from second click
     mphValue += value;
     document.getElementById('mph-dropdown').classList.toggle('mph-slide');
     mphFirstClick = true;
     styledCircle.fill = "white";
     document.getElementById('mph-text').innerHTML = mphValue;
     document.getElementById("mph-ui").classList.remove("ui_invalid");
   }

 });
 $('#mph-ui').click(function(event) {
   document.getElementById('mph-dropdown').classList.toggle('mph-slide');


 });
 $('#batter-handedness input').click((e) => {

   var backgrnClr = "#A90714";

   var batterUI = document.querySelectorAll("#batter-handedness label");
   batterUI.forEach(function(item) {
     item.classList.remove("ui_invalid");

   });

   if (e.target.id === "switch_lhh") {
     document.getElementById('right-batter').style.display = "none";
     document.getElementById('left-batter').style.display = "block";
   }
   else {
     document.getElementById('left-batter').style.display = "none";
     document.getElementById('right-batter').style.display = "block";
   }

 });
 $('#pitch-fields input').click(() => {
   var pitchSelectUI = document.querySelectorAll("#pitch-fields label");
   pitchSelectUI.forEach(function(item) {
     item.classList.remove("ui_invalid");

   });

 });

 $("#new-btn").click((e)=>{

   console.log("#new-btn clicked");
     $('#opening-menu').css('display', 'none');
     $('#select-menu').css('display', 'block');



 });

 $('#new-btn-back').click((e)=>{
   $('#opening-menu').css('display', 'block');
   $('#select-menu').css('display', 'none');
 });

 // $("#new-btn").on("touchend", function () {alert('hello touch ! =o' )});


 $('#database-btn').click(()=>{

   window.location.href = "links/pitchData.html";
 });



 $('#start-btn').click(() => {
var valid = true;
 if((document.getElementById("pitcher-name").selectedIndex-1)!= -1){

   PlayerData.playerName = pitchersData[document.getElementById("pitcher-name").selectedIndex-1].pitcher_name;
   PlayerData.player_id = pitchersData[document.getElementById("pitcher-name").selectedIndex-1]._id;

   if((document.getElementById("game-type").selectedIndex-1)!= -1){
   PlayerData.gameType = $('#game-type').val();
   if($('#game-type').val() == "Game"){
     if((document.getElementById("op-team-name").selectedIndex-1)!= -1){
       PlayerData.opponent = $('#op-team-name').val();
       PlayerData.gameNum = $('#game-num').val()
     }else{
        document.getElementById("op-team-name").classList.add('ui_invalid');
        valid = false;
     }
   }else{
     PlayerData.opponent = "SRJC";
     PlayerData.gameNum = "1";
   }

   }else{
     document.getElementById("game-type").classList.add('ui_invalid');
   valid = false;
   }
 }else{
   document.getElementById("pitcher-name").classList.add('ui_invalid');
   valid = false;
 }

   if(valid){

   gl_newPitcher = true; /* jad */
   $('#start-background').css('display', 'none');
   document.getElementById('first-pitch').checked = true;
   PlayerData.objType = "1";
   PlayerData.date = getTodaysDate("yyyy/mm/dd");
   PlayerData.timeStamp = getCurrentTime();
   updateLeftPanel(PlayerData, { gameCount });
   }

 });

 $('#sync-roster').click(()=>{

     syncRoster().then((rosterList)=>{


       $('#roster-list').empty();
       rosterList.forEach((item,index) => {
         item = item.doc;

         if(rosterList.length-1 == index){
           $('#roster-list').append("<option selected data-id="+item._id+">" + item.year + " " + item.season + " " + item.title +"</option");
           rosterIndex = parseInt(item._id);
         }else{
             $('#roster-list').append("<option data-id="+item._id+">" + item.year + " " + item.season + " " + item.title +"</option");
         }
       });

         return getPouchRoster(1);

     }).then((res)=>{
         pitchersData = res;
         $('#pitcher-name').empty();
         $('#pitcher-name').append("<option selected disabled value='unselected'><i>Select Pitcher</i></option>");
           res.forEach((item)=>{
               $('#pitcher-name').append("<option data-id="+item._id+">" + item.pitcher_name +"</option");
           });

         }).catch((err) => {
         console.error(err)
         });
     });


 $('#pitcher-name').change((e)=>{
   $('#game-type-group').css('opacity','1');
   $('#game-type-group').css('visibility','visible');
 });

 $('#pitcher-name').click((e)=>{
   document.getElementById("pitcher-name").classList.remove('ui_invalid');
 });

 $('#game-type').change((e)=>{
if( e.target.value == "Game"){
  $('#op-team-group').css('opacity','1');
  $('#op-team-group').css('visibility','visible');
}else{
  $('#op-team-group').css('opacity','0');
  $('#game-num-group').css('opacity','0');
  $('#op-team-group').css('visibility','hidden');
  $('#game-num-group').css('visibility','hidden');
}
});

$('#game-type').click((e)=>{
   document.getElementById("game-type").classList.remove('ui_invalid');
 });

$('#op-team-name').change((e)=>{
 $('#game-num-group').css('opacity','1');
 $('#game-num-group').css('visibility','visible');
});

$('#op-team-name').click((e)=>{
   document.getElementById("op-team-name").classList.remove('ui_invalid');
 });


 $('#load-btn').click(() => {
   $('.transfer-edit-screen').addClass('full-open-menu');
   $('#transfer-edit-content').empty();
  loadPouchPitchMenu();
   // loadPitchGame();
   });

 function loadPitchGame(id){
     var tempPitcher;
   getPouchPitcher(id).then((res) => {
      tempPitcher = res;
     $('#start-background').css('width', '0');
     PlayerData._id = res._id;

      return getPouchPitches(res._id);

    }).then((res)=>{
   var pitchesArray = pitchData = res.docs;
   updateLeftPanel(tempPitcher, pitchesArray[pitchesArray.length - 1]);
   gameCount = pitchesArray[pitchesArray.length - 1].gameCount;

   var svgNS = "http://www.w3.org/2000/svg";
   pitchesArray.forEach((item) => {

     myCircle = document.createElementNS(svgNS, "circle"); //to create a circle. for rectangle use "rectangle"
     myCircle.setAttributeNS(null, "class", "mycircle");
     myCircle.setAttributeNS(null, "cx", item.xCoord);
     myCircle.setAttributeNS(null, "cy", item.yCoord);
     myCircle.setAttributeNS(null, "r", 8);
     myCircle.setAttributeNS(null, "fill", item.pitchColor);
     // myCircle.setAttributeNS(null, "stroke", "black");
     // myCircle.setAttributeNS(null, "stroke-width", "1px");
     myCircle.savedToGraph = true;

     document.getElementById("mySVG").appendChild(myCircle);
     newCircle = true;
   });
    }).catch((err) => {
      console.error(err);
    });;

 }

 function   loadPouchPitchMenu(){

   getPouchPitchers().then((res)=>{

    var body = document.getElementById('transfer-edit-content');
    var button = document.createElement('button');
        button.setAttribute('class', 'delete-pouch');
        // button.setAttribute('data-toggle','modal');
        // button.setAttribute('data-target','#delete-local-modal');

     res.forEach((item)=>{

       playerInfo = item.doc;
        tr =  document.createElement('tr');
        tr.setAttribute('class', 'row-items');
        tr.setAttribute('data-id',playerInfo._id);
        td = document.createElement('td');
        td.innerHTML = playerInfo.playerName;
        tr.appendChild(td);
        td = td.cloneNode(true);
        td.innerHTML = playerInfo.date;
        tr.appendChild(td);
        td = td.cloneNode(true);
        td.innerHTML = playerInfo.gameType;
        tr.appendChild(td);
        td = td.cloneNode(true);
        td.innerHTML = playerInfo.opponent;
        button = button.cloneNode(true);
        button.innerHTML = 'Delete';
        tr.appendChild(td);
        tr.appendChild(button);

    body.appendChild(tr);


     });

     $('.row-items').click((e)=>{

       clearCircles();
       loadPitchGame(e.target.parentNode.dataset.id);
       closeAllMenus(document.getElementById('transfer-edit-screen'));
     });




     $('.delete-pouch').click((e)=>{
       e.stopPropagation();
    var htmlCollection =  e.target.parentNode.children;
    var rowTitles =  e.target.parentNode.parentNode.parentNode.children[0].children[0].children;

    var table = document.createElement('table');
    table.setAttribute('class','game-stat table table-striped table-border  table-sm');
    var body = document.createElement('tbody');

    for(var i=0; i< htmlCollection.length -1; i++){


      var tr =  document.createElement('tr');
      var th =  document.createElement('th');
      var thProp =  document.createElement('th');

      th.innerHTML = `${rowTitles[i].innerHTML}`;
      thProp.innerHTML = htmlCollection[i].innerHTML;

      tr.appendChild(th);
      tr.appendChild(thProp);
      body.appendChild(tr);
      table.appendChild(body);

    }


   document.getElementById('delete-local-modal-body').innerHTML="";
   document.getElementById('delete-local-modal-body').appendChild(table);

      var deleteBtn = document.getElementById('confirm-local-delete');
      deleteBtn.setAttribute('data-id',e.target.parentNode.dataset.id);

       $("#delete-local-modal").modal('show');
     });


   }).catch((err)=>{
     console.error("Error in script.js:", err);

   });

 }

 function updateLeftPanel(pitcherObj, pitchObj) {

   $('#date').text(pitcherObj.date);
   $('#game-type-dspy').text(pitcherObj.gameType);
   $('#pitcher-name-dspy').text(pitcherObj.playerName);
   $('#op-team-name-dspy').text(pitcherObj.opponent);

   updateGameCountUI(pitchObj.gameCount);

 }

 function renderPie(data){


   var svg = d3.select("#strike-pie"),
        width = svg.attr("width"),
        height = svg.attr("height"),
       radius = Math.min(width, height) / 2,
       g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

       g.append("circle")
                         .attr("cx", 0)
                         .attr("cy", 0)
                         .attr("r", radius)
                         .attr("fill", "#F1F1F1");


       strikePerc = svg.append("text").attr(
                 "transform", "translate(" + width/2 + "," + height/5 + ")")

  .attr('dy', '2em')
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .style("text-decoration", "bold")
  .text("$");

   var color = d3.scaleOrdinal(['#A70415','#15172C']);

   // Generate the pie
    pie = d3.pie();

   // Generate the arcs
    arc = d3.arc()
               .innerRadius(radius * .7)
               .outerRadius(radius);



   //Generate groups
   arcs = g.selectAll("arc")
               .data(pie(data))
               .enter()
               .append("g")
               .attr("class", "arc");

       arcs.transition()
     .duration(500)
     .attr("fill", function(d, i) { return color(i); })
     .attr("d", arc)
     .each(function(d) { this._current = d; }); // store the initial angles

   //Draw arc paths
   arcs.append("path")
       .attr("fill", function(d, i) {
           return color(i);
       })
       .attr("d", arc);

   paths = svg.selectAll('path');
 }
function change(data){
   var perc = 0;
   var total = data[0] + data[1];
   paths.data(pie(data));
   paths.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
   if(total!=0){
   perc = ((data[0] / total) * 100);
   }

   strikePerc.text(perc.toFixed(1) + "%");


}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
 var i = d3.interpolate(this._current, a);
 this._current = i(1);
 return function(t) {
   return arc(i(t));
 };
}
 function updateGameCountUI(x) {
   $('#pitch-count').text(x.pitchCount);
   $('#total-balls').text(x.totalBalls);
   $('#total-strikes').text(x.totalStrikes);
   $('#balls').text(x.ballCount);
   $('#strikes').text(x.strikeCount);
    change([x.totalStrikes, x.totalBalls]);
 }


 $('#switch_stk').click(()=>{
   if(gameCount.strikeCount >= 2){

     // document.getElementById('label_sOut').classList.add('warning_indicator');
   }

 });

 $('[name="switch_end"]').on("click", (e) => {
   if (e.target.clickedOnce) {
     e.target.clickedOnce = false;
     e.target.checked = false;
   }
   else {
     $('[name="switch_end"]').each((index) => {
       $('[name="switch_end"]')[index].clickedOnce = false;
     });
   }
   if (e.target.checked) {
     e.target.clickedOnce = true;
   }
 });

 $('#switch-pitcher').click(function() {

     // closeAllMenus(document.getElementById('transfer-edit-screen'));
      hideMenu(document.getElementById('transfer-edit-screen'));

   $('#select-pitcher-screen').css('width', '83vw');
   $('#select-pitcher-screen').css('left', '17vw');

   if(!pitcherSelectInit){
     pitcherSelectInit = true;
     pitchersData.forEach((pitcher) => {
       $('#new-pitcher-select').append(`<option>${pitcher.pitcher_name}</option`);
   });
   }


 });

 $('#transfer-data').click(() => {

   $('.transfer-edit-screen').css('width', '83vw');
   $('.transfer-edit-screen').css('left', '17vw');
   $('#transfer-edit-content').empty();

  loadPouchPitchMenu();
// closeAllMenus(document.getElementById('select-pitcher-screen'));
hideMenu(document.getElementById('select-pitcher-screen'));

 });

 $('#confirm-local-upload').click((e)=>{

   document.getElementById('upload-btn').innerHTML = "Uploading Pitch Data <div class='loader'></div>";
   transferPouchToSql().then((res) => {


   document.getElementById('upload-btn').innerHTML = "Transfer Success";
   document.getElementById('upload-btn').setAttribute("class", "btn btn-success");

   setTimeout( ()=> {window.open("./");}, 3000);


   });
 });

 $('#confirm-local-delete').click((e)=>{

   deletePouchPitches(e.target.dataset.id);

 });


  function hideMenu( menuPage ){
    menuPage.style.visibility = 'hidden';
    menuPage.style.left = "17vw";
    menuPage.style.width = "0px";
    removeMenuListeners();
    setTimeout(() => {
                       menuPage.style.visibility = 'visible'; }, 1000);

  }

 $('#view-data').click(()=>{
   window.open("links/pitchData.html");
 });

 $('#enter-new-pitcher').click(() => {
   PlayerData.playerName = pitchersData[document.getElementById("new-pitcher-select").selectedIndex].pitcher_name;
   PlayerData.pitcher_id =  pitchersData[document.getElementById("new-pitcher-select").selectedIndex]._id;
   PlayerData.startingPitcher = false;

   clearCircles();
   //close nav menus
   document.getElementById("left-nav-menu").style.left = "-17vw";
   document.getElementById('select-pitcher-screen').style.left = "-17vw";
   document.getElementById('select-pitcher-screen').style.width = "0px";
   removeMenuListeners();
   setTimeout(() => { document.getElementById('select-pitcher-screen').style.left = "17vw"; }, 1000);

   //update UI
   resetBatterStance();
   $('#pitcher-name-dspy').text(PlayerData.playerName);
   gl_newPitcher = true; /* jad */
   updateGameCountUI(zeroGameCount(gameCount));
   document.getElementById('first-pitch').checked = true;

 });

 function clearCircles(){
   //clear pitch graph
   var circles = document.getElementsByClassName('mycircle');
   if (circles.length > 0) {
     for (var i = circles.length - 1; i >= 0; i--) {
       document.getElementById('mySVG').removeChild(circles[i]);

     }
     newCircle = true;
   }
 }

 $('#menu-btn').click(function() {

   if (document.getElementById("left-nav-menu").style.left == "-17vw") {
     document.getElementById("left-nav-menu").style.left = "0px";
     $(".nav-close").get(0).addEventListener("click", closeLeftMenu, true);
     $(".nav-close").get(1).addEventListener("click", closeLeftMenu, true);

   }
   else {

     closeAllMenus(document.getElementById('select-pitcher-screen'));
     closeAllMenus(document.getElementById('transfer-edit-screen'));
   }

 });

 $(".close-btn").click(function(e) {

   closeAllMenus(e.target.parentNode);

 });

 function closeAllMenus(openMenu) {
   document.getElementById("left-nav-menu").style.left = "-17vw";
   openMenu.style.left = "-17vw";
   openMenu.style.width = "0px";
   removeMenuListeners();
   setTimeout(() => { openMenu.style.left = "17vw"; }, 1000);

 }

 function closeLeftMenu(event) {
   event.preventDefault();
   event.stopPropagation();
   document.getElementById("left-nav-menu").style.left = "-17vw";
   removeMenuListeners();
 }

 function removeMenuListeners() {
   $(".nav-close").get(0).removeEventListener("click", closeLeftMenu, true);
   $(".nav-close").get(1).removeEventListener("click", closeLeftMenu, true);

 }

 //definition for full screen mode
 function GoInFullscreen(element) {

 if(element.requestFullscreen)
   element.requestFullscreen();
 else if(element.mozRequestFullScreen)
   element.mozRequestFullScreen();
 else if(element.webkitRequestFullscreen)
   element.webkitRequestFullscreen();
 else if(element.msRequestFullscreen)
   element.msRequestFullscreen();
}
//definitijon for full screen exit
function GoOutFullscreen() {
 if(document.exitFullscreen)
   document.exitFullscreen();
 else if(document.mozCancelFullScreen)
   document.mozCancelFullScreen();
 else if(document.webkitExitFullscreen)
   document.webkitExitFullscreen();
 else if(document.msExitFullscreen)
   document.msExitFullscreen();
}

//open app in full screen mode using body elemnt
$('#fullscreen').click((e)=>{
 if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null){

    GoOutFullscreen($('body').get(0));
e.target.classList.remove("fa-compress");
e.target.classList.add("fa-expand");

 }else{
   GoInFullscreen($('body').get(0));
   e.target.classList.remove("fa-expand");
   e.target.classList.add("fa-compress");
 }
});

}
function scalePitchGraph(){
  let h = window.innerHeight;
  let w = $('#pitch-zone').width();
  $('#pitch-zone').height(h-$('#header-title').height());
    console.log(Math.min(h,w));
  if(h == Math.min(h,w)){
  console.log("height");
    $('#pitch-zone > svg').css('height','100%');
    $('#pitch-zone > svg').css('width',h * .91);
    $('#pitch-zone > svg').css('margin-top', 0);
  }else{
    console.log("width");
    $('#pitch-zone > svg').css('height',w * 1.099);
    $('#pitch-zone > svg').css('width',w);
    $('#pitch-zone > svg').css('margin-top', ($('#pitch-zone').height()-$('#pitch-zone > svg').height())*.5);
  }
}

window.addEventListener('load', function () {
  inititalizeState();
}, false);
