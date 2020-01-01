<?php
 header("Access-Control-Allow-Origin: *");
  header("Content-Type", "application/json");
//phpmyadmin connection
$mydbserver = 'localhost';
$mydbname = 'baseball_app';
$mydbuser = 'root';
$mydbpass = 'root';

mysqli_report( MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);


 try {
   $myconn = new mysqli(
            $mydbserver,
            $mydbuser,
            $mydbpass,
            $mydbname
        );

 }
 catch( Exception $e){

    include "e_message.inc.php";

 }

?>
