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
