$(function(){

  $('#modal-container').append(`<div class="modal" tabindex="-1" role="dialog" id="login-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Login to access feature</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form id="login-form">
    <div class="form-group">
      <label for="userName">Username</label>
      <input type="text" class="form-control" id="userName" placeholder="Enter email" name="username">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password" name="password">
    </div>
    <button id="login-submit" type="submit" class="btn btn-primary">Submit</button>
  </form>
        </div>
      </div>
    </div>
  </div>
`);
     var callback = $('#modal-container').attr('data-callback');
      $('#login-form').submit((e)=>{
          console.log("form submitted");
                var params = `username=${$('#userName').val()}&password=${$('#password').val()}&login=true`;

                console.log('params',params);
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        $('#login-modal').modal('toggle');

                        window[callback].call();

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


    });
