<?php
include "./SQL_config.php";

$requestPayload = file_get_contents("php://input");

$object = json_decode($requestPayload);

$id = $object->team_id;
$title = $object->title;
$year = $object->year;
$season = $object->season;
if($id!=0){

  $mysql = "UPDATE `srjc_team_list`
                            SET `season` = ?,  `year` = ?, `title` = ?
                            WHERE `team_id` = ?";
  try{
            $statement = $myconn->prepare($mysql);
            $statement->bind_param("sisi", $season, $year, $title, $id);

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

  $mysql = "INSERT INTO `srjc_team_list`
                            (`team_id`, `title`, `year`, `season`)
                            VALUES (NULL, ?, ?, ?)";
  try{
            $statement = $myconn->prepare($mysql);
            $statement->bind_param("sss", $title, $year, $season);

            $statement->execute();

            if ($statement -> affected_rows > 0) {
              $object->rows = $statement -> affected_rows;
                }

            $statement->close();

          }catch(Exception $e){
            echo $e;
          }

          $mysql = "SELECT `team_id`, `title`, `year`, `season`
                    FROM `srjc_team_list` ORDER BY `team_id` DESC LIMIT 1";
          try{
                    $statement = $myconn->prepare($mysql);

                    $statement->execute();

                   $statement->bind_result( $team_id, $title, $year, $season);

                   if($statement->fetch()){

                    $object->team_id = $team_id;
                    $object->title = $title;
                    $object->year =  $year;
                    $object->season = $season;
                    $object->flag = true;
                  }
                   echo json_encode($object);

                    $statement->close();

                  }catch(Exception $e){
                    echo $e;
                  }


}


?>
