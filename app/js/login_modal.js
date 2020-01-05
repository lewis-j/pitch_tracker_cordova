$(function(){
      $("#modal-container").load("../includes/login_modal.html",()=>{
              $('#login-form').submit((e)=>{
          console.log("form submitted");

                var params = `username=${$('#userName').val()}&password=${$('#password').val()}&login=true`;
              var callback = $('#modal-container').attr('data-callback');
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

      });

      $('#logout').click(()=>{
         var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
             if (this.readyState == 4 && this.status == 200) {
                 $('#login-modal').modal('toggle');
               }
             }
             xhttp.onerror = function () {
             console.error("** An error occurred during the transaction",xhttp.response);
           };

         xhttp.open("POST",url + "logout.php");

         xhttp.send();
      });


    });
