<?php
if(!isset($_SESSION)) session_start();
include "SQL_config.php";
$responseObj = new StdClass;



if($_SERVER['REQUEST_METHOD'] == "POST" && !isset($_SESSION['user_id']) && isset($_POST['username'])){
try{
    $myQuery = "SELECT `id`
                FROM `users`
                WHERE `username` = ?
                AND `password` = ?";



    $myStatment = $myconn -> prepare($myQuery);

    $myStatment -> bind_param('ss',$_POST['username'], $_POST['password']);

    $myStatment -> execute();

    $myStatment -> bind_result($userid);

    if($myStatment -> fetch()){
        $_SESSION['user_id'] = $userid;
    }else{
      throw new Exception("Oops! Looks like that login information is incorrect!");
    }
    $myStatment -> close();
}catch(Exception $e){

    echo $e;
}

}

if( !isset($_SESSION['user_id'])){

    $myconn -> close();

    session_destroy();

    $responseObj->loggedIn = false;

    echo json_encode($responseObj);

    exit;

}
$responseObj->loggedIn = true;



?>
