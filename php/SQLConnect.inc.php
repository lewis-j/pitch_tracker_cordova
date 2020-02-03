<?php
if(!isset($_SESSION)) session_start();
include "SQL_config.php";
$responseObj = new StdClass;

$errors = array();
$username = "";
$email = "";



if($_SERVER['REQUEST_METHOD'] == "POST" && !isset($_SESSION['user_id']) && isset($_POST['username'])){

  if(isset($_POST['register-submit'])){


    $username = $_POST['username'];
    $email = $_POST['email'];
      $password = $_POST['password'];
      $passwordConf = $_POST['confirmPassword'];
      $role = $_POST['role'];

    if(empty($username)){
      $errors['username'] = "Username required";
    }
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
      $errors['email'] = "Email address is invalid";
    }
    if(empty($email)){
      $errors['email'] = "Email required";
    }
    if(empty($password)){
      $errors['password'] = "Password required";
    }

    if($password !== $passwordConf){
      $errors['password'] = "The two password do not match";
    }

    try{

      $emailQuery = "SELECT * FROM users WHERE email = ? LIMIT 1";
      $stmt = $myconn->prepare($emailQuery);
      $stmt->bind_param('s', $email);
      $stmt->execute();
     $stmt->fetch();
     $userCount = $stmt->num_rows;

     $stmt->close();

     if($userCount > 0){
       $errors['email'] = "Email already exist";
     }

    }catch(Exception $e){

      $errors['db_error'] = "email query error:".$e;
    }

    if(count($errors) === 0){
      $password = password_hash($password, PASSWORD_DEFAULT);
      $token = bin2hex(random_bytes(50));

 try{
      $sql = "INSERT INTO `users` (`username`, `email`, `role`, `verified`, `token`, `password`) VALUES (?, ?, ?, ?, ?, ?)";
$verified = 0;
       $errors['testing'] = $verified;
      $stmt = $myconn->prepare($sql);
      $stmt->bind_param('sssiss', $username, $email, $role, $verified, $token, $password);
      if($stmt->execute()){
         //login user
      $user_id = $myconn->insert_id;
      $_SESSION['user_id'] = $user_id;
      $_SESSION['username'] = $username;
      $_SESSION['role'] = $role;
      $_SESSION['email'] = $email;
      $_SESSION['verified'] = $verified;

       //flash MessageFormatter
       $_SESSION['message'] = "you are now logged in!";
       $_SESSION['alert-class'] = "alert-success";
       // header('location: ../app/index.html');
       // exit();

      }

  } catch(Exception $e) {
    $errors['db_error'] = "Insert error:".$e;
  }
  $stmt->close();
}

}

if(isset($_POST['login-submit'])){



    $username = $_POST['username'];
    $password = $_POST['password'];

    if(empty($username)){
      $errors['username'] = "Username required";
    }
    if(empty($password)){
      $errors['password'] = "Password required";
    }


    if(count($errors) === 0){
      $sql = "SELECT `id`, `username`, `password`, `email`, `verified` FROM users WHERE email=? OR username=? LIMIT 1";
      $stmt = $myconn->prepare($sql);
      $stmt->bind_param('ss', $username, $username);
      $stmt->execute();
      $stmt->bind_result($id, $user, $pass, $email, $verified);

      if($stmt->fetch()){
        if(password_verify($password, $pass)){
          $_SESSION['id'] = $id;
          $_SESSION['username'] = $user;
          $_SESSION['email'] = $email;


          $_SESSION['verified'] = $verified;
           //flash MessageFormatter
           $_SESSION['message'] = "you are now logged in!";
           $_SESSION['alert-class'] = "alert-success";
           // header('location: ../app/index.php');
           exit();
        }else{
          $errors['login_fail'] = "Wrong Credentials";
        }
      }else{
        $errors['login_fail'] = "Wrong Credentials";
      }
      $stmt->close();
    }




}
}


if( !isset($_SESSION['user_id'])){

    $myconn -> close();

    session_destroy();
   $responseObj->errors = $errors;
    $responseObj->loggedIn = false;

    echo json_encode($responseObj);

    exit;

}
$responseObj->loggedIn = true;



?>
