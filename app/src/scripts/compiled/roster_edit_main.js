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

//dependency: login_modal.js
function initUserInteractions(){

$('.login-btn').click(()=>{
  console.log("login btn pressed");
  $('#login-modal').modal("toggle");
});

$('.signup-btn').click(()=>{
  $('#register-modal').modal("toggle");
  });

$('.signout-btn').click(()=>{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          window.open('./index.html','_self');
        }
      }
      xhttp.onerror = function () {
      console.error("** An error occurred during the transaction",xhttp.response);
    };

  xhttp.open("POST",url + "logout.php");

  xhttp.send();


});





}

window.addEventListener('load', function() {
  initUserInteractions();
}, false);

/*next file*/

window.addEventListener('load', initRosterEdit, false);
//roster_edit.js
function initRosterEdit(){
var yearSelectInit = false;

fetchList();

document.getElementById('edit-add-season').style.display = "none";

$('#add-season').on('click',()=>{
  var d = new Date();
  var year = d.getFullYear();
if(!yearSelectInit){
$('#year-select').append(`<option>${year+2}</option>
                          <option>${year+1}</option>
                          <option selected>${year}</option>
                          <option>${year-1}</option>
                          <option>${year-2}</option>`);
                        yearSelectInit = true;
                      }

  document.getElementById('add-season').style.display = "none";
  document.getElementById('edit-add-season').style.display = "block";
    document.getElementById('input-title').focus();
    document.getElementById('input-title').value = "";

});

$('#cancel-season').click((e)=>{
  document.getElementById('edit-add-season').style.display = "none";
  document.getElementById('add-season').style.display = "block";
});

$('#confirm-add-season').click((e)=>{
  var item = new Object();
  let target = ($(e.target).is('i'))? e.target.parentNode: e.target;
  var domItem = target.parentNode;

   item.team_id = target.dataset.id;
   item.season = domItem.querySelector('#select-season').value;

   item.year = domItem.querySelector('#year-select').value;
   item.title = domItem.querySelector('#input-title').value;

console.log("season item:", item);
   xhrPost(item, url + "add_edit_season_list.php", (obj)=>{

       var {team_id, title, season, year } = obj;



  var documentObj = $.parseHTML(`<div class='col-md-12 season-item' ><div class='seasons-info' data-item='${JSON.stringify(obj)}' data-viewindex='${$('.season-item').length}'>
   <h4 class='inline-title'>${season} ${year} ${title}</h4>
         <button type='button' class='btn btn-dark season-edit'><i class="fas fa-edit"></i></button>
         <button type='button' class='btn btn-danger delete-season' data-toggle='modal' data-target='.season-delete-modal'><i class="fas fa-trash-alt"></i></button>
         </div>
         <div class='season-edit-view'></div></div>`);

      $('#seasons-list').append(documentObj);
      $jqueryObj = $(documentObj);


      $jqueryObj.find('.season-edit').click((e)=>{
        swithToEdit(e);
      });

      $jqueryObj.find('.seasons-info').click((e)=>{
        getSeasonInfo(e);
      });

      $jqueryObj.find('.delete-season').click((e)=>{
        deleteSeason(e);
      });

      document.getElementById('edit-add-season').style.display = "none";
      document.getElementById('add-season').style.display = "block";

         });

});
}

function addeditmenu(){
  var d = new Date();
  var year = d.getFullYear();




}
function fetchList(){



xhrPost(null, url + "get_team_list.php", (res)=>{
  console.log("callback response::", res);
 if(res.loggedIn){
   console.log('logged in');
   listToView(res.teamList);
 }else{
   console.log('modal on');
   $('#login-modal').modal('toggle');
 }


 } );


}

function listToView( list ){

  list.forEach((item, index)=>{
    var {season, year, title} = item;
            $('#seasons-list').append(`<div class='col-md-12 season-item' ><div class='seasons-info' data-item='${JSON.stringify(item)}' data-viewindex='${index}'>
            <h4 class='inline-title'>${season} ${year} ${title}</h4>
                  <button type='button' class='btn btn-dark season-edit'><i class="fas fa-edit"></i></button>
                  <button type='button' class='btn btn-danger delete-season' data-toggle='modal' data-target='.season-delete-modal'><i class="fas fa-trash-alt"></i></button>
                  </div>
                  <div class='season-edit-view'></div></div>`);

             });

            $('.season-edit').click((e)=>{
                swithToEdit(e);
              });
            $('.seasons-info').click((e)=>{
              getSeasonInfo(e);
              });
            $('.delete-season').click((e)=>{
              deleteSeason(e);
            });


            $('#confirm-delete-season').click((e)=>{

  ;


               xhrPost({id: e.target.dataset.id}, url + "delete_season.php",
                          (res)=>{

                                   $('.seasons-info').each((index, item)=>{

                                           if(JSON.parse(item.dataset.item).team_id == e.target.dataset.id){
                                             item.parentNode.remove();
                                           }

                                   });


                                   });


                    $('#delete-modal').modal('toggle');
            });


}

function xhrPost(sqlCallData, uri, callback){
var xhttp = new XMLHttpRequest();
xhttp.open("POST",uri);


xhttp.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

      var obj = JSON.parse(xhttp.response);

     callback(obj);
     }
};
xhttp.onerror = function () {
console.error("** An error occurred during the transaction");
};

xhttp.send(JSON.stringify(sqlCallData));
}

function getSeasonInfo(e){
  var target  = ($(e.target).is('h4'))? e.target.parentNode : e.target;

  if(target.init){

    var display = ($(target.parentNode).find('.roster-list').css('max-height') == '0px')? '1000px' : '0px';
    $(target.parentNode).find('.roster-list').css('max-height', display);

  }else{

    var item = new Object();
    var obj = JSON.parse(target.dataset.item);
    console.log('getting season list', obj);
     item._id = obj._id;






    xhrPost(item , url + "get_team_byid.php", (res)=>{
        var htmlString = `<div class='roster-list'><table class='game-stat table table-striped table-border'>
                            <thead><tr><th scope='col'><div class="main-header">Pitcher Name<div class='add-icon add-player'><i class="fas fa-plus"></i> Add Player</div>
                            </div>
                            <div class='player-add-view' data-team_id=${obj.team_id}>
                            <label for="input-name" >Add Player:</label>
                            <input type="text" class="form-control name-input" id="input-name" placeholder="Enter Name"'>
                            <button type="button" class="btn btn-secondary mb-2 back-add-player back-btn"'><i class="fas fa-undo"></i></button>
                            <button type="button" class="btn btn-primary mx-sm-3 mb-2 enter-player-new enter-btn"><i class="fas fa-check-circle"></i></button>
                            </div>
                            </th>

                            </tr> </thead><tbody class="player-insert">`;

      res.forEach((player,  index)=>{

    htmlString += `<tr><td ><div class='player-view' data-item=${JSON.stringify({id: player._id, team_id: player.team_id })}  data-viewindex='${JSON.stringify({seasonIndex: target.dataset.viewindex, playerIndex: index})}' ><div class='player-name'>${player.pitcher_name}</div><button type='button' class='btn delete-player' data-toggle='modal' data-target='.player-delete-modal'><i class="fas fa-trash-alt"></i></button><button type='button' class='btn  edit-player'><i class="fas fa-edit"></i></button></div></td>

                        </tr>`;



   });

          htmlString+=`</tbody></table></div>`;
    $(target.parentNode).append(htmlString);
    $('.player-add-view').css('display','none');
    $(target.parentNode).find('.roster-list').css('max-height', '1000px');
   target.init = true;

   $('.add-player').click((e)=>{

   var target = ($(e.target).is('i'))? e.target.parentNode.parentNode: e.target.parentNode;
    $(target.parentNode.querySelector('.player-add-view')).css('display','block');

    $(target.parentNode.querySelector('.main-header')).css('display','none');
target.parentNode.querySelector('#input-name').value = "";
target.parentNode.querySelector('#input-name').focus();
   });



   $('.back-add-player').click((e)=>{
      var target = ($(e.target).is('i'))? e.target.parentNode: e.target;
     $(target.parentNode.parentNode.querySelector('.player-add-view')).css('display','none');
     $(target.parentNode.parentNode.querySelector('.main-header')).css('display','block');
   });

   $('.enter-player-new').click((e)=>{
  var target = ($(e.target).is('i'))? e.target.parentNode: e.target;
     var item = new Object();
     item.pitcher_name = target.parentNode.querySelector('#input-name').value;
     item.team_id =  target.parentNode.dataset.team_id;
     item.id = '0';



   $(target.parentNode.parentNode.querySelector('.player-add-view')).css('display','none');
   $(target.parentNode.parentNode.querySelector('.main-header')).css('display','block');

     if(item.pitcher_name != ''){
       xhrPost(item , url + "add_edit_player.php", (res)=>{
         var $tbody =   $(target.parentNode.parentNode.parentNode.parentNode.parentNode).find('.player-insert')
         var trDomEle = $.parseHTML(`<tr><td ><div class='player-view' data-item=${JSON.stringify({id: res._id, team_id: res.team_id })}><div class='player-name'>${res.pitcher_name}</div><button type='button' class='btn delete-player' data-toggle='modal' data-target='.player-delete-modal'><i class="fas fa-trash-alt"></i></button><button type='button' class='btn  edit-player'><i class="fas fa-edit"></i></button></div></td></tr>`);
       $tbody.append(trDomEle);

      let domele =  $(trDomEle);

        domele.find('.edit-player').click((e)=>{
          console.log('edit player');
          editPlayer(e);
        });
        domele.find('.delete-player').click((e)=>{
          console.log('delete player');
          deletePlayer(e);
        });


            });

     }

   });

   $('.delete-player').click((e)=>{

  deletePlayer(e);

   });

   $('#confirm-delete-player').click((e)=>{

 var { id, team_id } = JSON.parse(e.target.dataset.item);

  xhrPost({id: id}, url + "delete_player.php",
                 (res)=>{
                   $('#player-delete-modal').modal('toggle');
                   $('.seasons-info').each((index, item)=>{
                           if(JSON.parse(item.dataset.item).team_id == team_id){

                             $(item.parentNode).find('.player-view').each((index,player)=>{
                               if(JSON.parse(player.dataset.item).id == id){

                                  player.parentNode.parentNode.remove();

                                            }
                                        });
                                       }
                                  });
                           });



   });

   $('.edit-player').click((e)=>{

     editPlayer(e);


   });

 });
}
}
function deletePlayer(e){
  e.stopPropagation();
 var target = $(e.target).is('i')? e.target.parentNode.parentNode:e.target.parentNode ;

  var { id, team_id } = JSON.parse(target.dataset.item);
    $('#player-delete-modal-body').text(`Are you sure you would like to delete ${target.querySelector('.player-name').innerHTML}?`);
     $('#confirm-delete-player').attr('data-item',target.dataset.item);
       $('#player-delete-modal').modal('toggle');
}

function editPlayer(e){
  var target  = ($(e.target).is('button'))? e.target.parentNode : e.target.parentNode.parentNode;
  $(target).css('display','none');
  if(target.init){
var $playerEdit = $(target.parentNode).find('.player-edit-view').css('display','block');


console.log('init', target);


  }else{

    $(target.parentNode).append(`<div class='player-edit-view'>
    <label for="input-name" class="sr-only">Season title</label>
    <input type="text" class="form-control name-input" id="input-name" value='${ $(target).find('.player-name').text() }'>
    <button type="button" class="btn btn-secondary mb-2 back-edit-player back-btn"'><i class="fas fa-undo"></i></button>
    <button type="button" class="btn btn-primary mx-sm-3 mb-2 enter-player-changes enter-btn"><i class="fas fa-check-circle"></i></button>
    </div>`);
    target.init = true;

    $('.back-edit-player').click((e)=>{
      let target = ($(e.target).is('i'))?e.target.parentNode: e.target;
      var [playerView, playerEditView]  = target.parentNode.parentNode.children;
        playerView.style.display = 'block';
        playerEditView.style.display = 'none';

    });

    $('.enter-player-changes').click((e)=>{
      var item = new Object();
      let target = ($(e.target).is('i'))?e.target.parentNode: e.target;
      item = JSON.parse(target.parentNode.parentNode.querySelector('.player-view').dataset.item);
      item.pitcher_name =  target.parentNode.querySelector('#input-name').value;



        xhrPost(item , url + "add_edit_player.php", (res)=>{



                   var name = target.parentNode.parentNode.querySelector('.player-name').innerHTML = res.pitcher_name;

                   target.parentNode.style.display = 'none';
                   target.parentNode.parentNode.querySelector('.player-view').style.display = 'block';
           });


    });


  }

  $(target.parentNode).find('#input-name').focus();
}

function swithToEdit(e){

    e.stopPropagation();
    let ele = ($(e.target).is('button'))? e.target.parentNode: e.target.parentNode.parentNode;


    var newEle = ele.parentNode.querySelector('.season-edit-view');
    var oldEle = ele;
    var item = JSON.parse(ele.dataset.item);


    var {team_id: id, title, season, year } = item;
    oldEle.style.display = "none";

          if(newEle.style.display == "none"){
            newEle.style.display = "block";

          }else{

  var htmlString= `<form class="form-inline">
  <div class="form-group mb-2">
    <label for="inputTitle" class="sr-only">Season title</label>
    <input type="text" class="form-control" id="inputTitle"`;
    htmlString+=(title)?`value = '${title}'`:`placeholder='title'`;
    htmlString+=`>
  </div>
            <div class="form-group mx-sm-3 mb-2">
              <label for="selectSeason" class="sr-only">season</label>
              <select class="form-control" id="selectSeason">
            <option>${season}</option>
            <option>${(season=="fall")?"Spring":"Fall"}</option>
          </select>
            </div>
            <div class="form-group mb-2">
              <label for="inputPassword2" class="sr-only">Password</label>
              <select class="form-control" id="selectYear">
              <option>${year+4}</option>
              <option>${year+3}</option>
              <option>${year+2}</option>
              <option>${year+1}</option>
            <option selected>${year}</option>
            <option>${year-1}</option>
            <option>${year-2}</option>
            <option>${year-3}</option>
            <option>${year-4}</option>
          </select>
            </div>
            <button type="button" class="btn btn-primary mx-sm-3 mb-2 add-season-changes" data-id='${id}'><i class="fas fa-check-circle"></i></button>
            <button type="button" class="btn btn-secondary mb-2 back-edit"'><i class="fas fa-undo"></i></button>
          </form>`;

            newEle.innerHTML = htmlString;

            ele.parentNode.querySelector('#inputTitle').focus();
  $('.add-season-changes').click((e)=>{
     var item = new Object();
     let target = ($(e.target).is('i'))?e.target.parentNode: e.target;
     var domItem = target.parentNode;

      item.team_id = target.dataset.id;
      item.season = domItem.querySelector('#selectSeason').value;
      item.year = domItem.querySelector('#selectYear').value;
      item.title = domItem.querySelector('#inputTitle').value;


      xhrPost(item, url + "add_edit_season_list.php", (obj)=>{

          var {team_id, title, season, year } = item;



        var [seasoninfo, editScreen, rosterList ] = domItem.parentNode.parentNode.children;
        seasoninfo.style.display = "block";
        editScreen.style.display = "none";

        seasoninfo.setAttribute('data-item', JSON.stringify(item));
        seasoninfo.children[0].innerHTML = `${season} ${year} ${title}`;

            });
          });

  $('.back-edit').click((e)=>{
  let target = ($(e.target).is('i'))?e.target.parentNode: e.target;
    var editScreen = target.parentNode.parentNode;
    var seasonInfo = target.parentNode.parentNode.parentNode.firstChild;

    seasonInfo.style.display = "block";
    editScreen.style.display = "none";
  });

  }




}

function deleteSeason(e){
  e.stopPropagation();
 var target = $(e.target).is('i')? e.target.parentNode.parentNode:e.target.parentNode ;

  var {team_id: id, title, season, year } = JSON.parse(target.dataset.item);
    $('#delete-modal-body').text(`Are you sure you would like to delete ${season} ${year} ${title}?`);
    $('#confirm-delete-season').attr('data-id',id);
       $('#delete-modal').modal('toggle');
}
