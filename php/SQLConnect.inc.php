<?php
if(!isset($_SESSION)) session_start();
include "SQL_config.php";

if($_SERVER['REQUEST_METHOD'] == "POST" && !isset($_SESSION['user_id'])){
try{
    $myQuery = "SELECT `id`
                FROM `users`
                WHERE `username` = ?
                AND `password` = ?";



    $myStatment = $myconn -> prepare($myQuery);

    $myStatment -> bind_param('ss',$username = $_POST['username'], $_POST['password']);

    $myStatment -> execute();

    $myStatment -> bind_result($userid);

    if($myStatment -> fetch()){
        $_SESSION['user_id'] = $userid;
    }else{
      throw new Exception("Oops! Looks like that login information is incorrect!");
    }
    $myStatment -> close();
}catch(Exception $e){

      include "e_message.inc.php";
}

}

if( !isset($_SESSION['user_id'])){

    $myconn -> close();

    session_destroy();
    $obj = new StdClass;
    $obj->$loggedIn = false;

    echo json_encode($obj);

    exit;

}




?>
