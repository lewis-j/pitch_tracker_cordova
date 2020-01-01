<?php
include "./SQL_config.php";

$requestPayload = file_get_contents("php://input");

$object = json_decode($requestPayload);

$id = $object->id;


$sql = "DELETE FROM `srjc_team_list`
        WHERE `team_id` = '{$id}'";

$statement = $myconn->prepare($sql);

$statement->execute();



if ($statement -> affected_rows > 0) {
  $obj = new StdClass;
  $obj->rows = $statement -> affected_rows;
              echo json_encode($obj);
            } else {
              echo '{"rows":0}';
            }

$statement->close();
?>
