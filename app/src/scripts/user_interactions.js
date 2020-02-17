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
