<?php
include "./SQL_config.php";

$requestPayload = file_get_contents("php://input");

$object = json_decode($requestPayload);

$id = $object->id;
$pitcher_name = $object->pitcher_name;
$team_id = $object->team_id;

if($id!=0){

  $mysql = "UPDATE `srjc_pitcher-roster`
                            SET `pitcher_name` = ?
                            WHERE `pitcher_id` = ?";
  try{
            $statement = $myconn->prepare($mysql);
            $statement->bind_param("si", $pitcher_name, $id);

            $statement->execute();

            if ($statement -> affected_rows > 0) {
              $object->rows = $statement -> affected_rows;
                          echo json_encode($object);
                        } else {
                          echo json_encode($object);
                        }

            $statement->close();

          }catch(Exception $e){
            echo $e;
          }




}else{
  $mysql = "INSERT INTO `srjc_pitcher-roster` (`pitcher_id`,`pitcher_name`,`team_id`)
                          VALUES(NULL, ?, ?)";
  try{
            $statement = $myconn->prepare($mysql);
            $statement->bind_param("si", $pitcher_name, $team_id);

            $statement->execute();

            if ($statement -> affected_rows > 0) {
              $object->rows = $statement -> affected_rows;
                          echo json_encode($object);
                        } else {
                          echo json_encode($object);
                        }

            $statement->close();

          }catch(Exception $e){
            echo $e;
          }




}


?>
