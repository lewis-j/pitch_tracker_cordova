<?php

session_start();

require 'SQL_config.php';

 $errors = array();
 $username = "";
 $email = "";



if(isset($_POST['register-submit'])){



  $username = $_POST['userName'];
  $email = $_POST['email'];
    $password = $_POST['pwd'];
    $passwordConf = $_POST['confirmPwd'];

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

  $emailQuery = "SELECT * FROM users WHERE email = ? LIMIT 1";

  $stmt = $conn->prepare($emailQuery);
  $stmt->bind_param('s', $email);
  $stmt->execute();
$stmt->fetch();


  $userCount = $stmt->num_rows;




   if($userCount > 0){
     $errors['email'] = "Email already exist";
   }

   if(count($errors) === 0){
     $password = password_hash($password, PASSWORD_DEFAULT);
     $token = bin2hex(random_bytes(50));
     $verified = false;

     $sql = "INSERT INTO users (username, email, verified, token, password) VALUES (?, ?, ?, ?, ?)";

     $stmt = $conn->prepare($sql);
     $stmt->bind_param('ssbss', $username, $email, $verified, $token, $password);
     if($stmt->execute()){
        //login user
     $user_id = $conn->insert_id;
     $_SESSION['id'] = $user_id;
     $_SESSION['username'] = $username;
     $_SESSION['role'] = $role;
     $_SESSION['email'] = $email;
     $_SESSION['verified'] = $verified;

     sendVerificationEmail($email, $token);
      //flash MessageFormatter
      $_SESSION['message'] = "you are now logged in!";
      $_SESSION['alert-class'] = "alert-success";
      header('location: index.php');
      exit();

     }else{
       $errors['db_error'] = "Database error: failed to register";
     }


   }


}

if(isset($_POST['login-btn'])){



    $username = $_POST['username'];
    $password = $_POST['password'];

    if(empty($username)){
      $errors['username'] = "Username required";
    }
    if(empty($password)){
      $errors['password'] = "Password required";
    }


    if(count($errors) === 0){
 echo "zero errors";
      $sql = "SELECT `id`, `username`, `password`, `email`, `verified` FROM users WHERE email=? OR username=? LIMIT 1";
      $stmt = $conn->prepare($sql);
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
           header('location: index.php');
           exit();
        }else{
          $errors['login_fail'] = "Wrong Credentials";
        }
      }else{
        $errors['login_fail'] = "Wrong Credentials";
      }
    }




}

if(isset($_GET['logout'])){
  session_destroy();
  unset($_SESSION['id']);
  unset($_SESSION['username']);
  unset($_SESSION['email']);
  unset($_SESSION['verified']);
  header('location: login.php');
  exit();
}
 ?>
