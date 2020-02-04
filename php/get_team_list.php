<?php
include "./SQLConnect.inc.php";

class Teams {

public function __construct($id, $title, $year, $season){
  $this->_id = strval($id);
   $this->title = $title;
  $this->year = $year;
  $this->season = $season;
}

}


$user_id = $_SESSION['user_id'];

	 try{

        $allData = "SELECT `team_id`,`title`,`year`,`season`
        FROM `srjc_team_list` where `user_id` = ?";

        $statement = $myconn -> prepare($allData);
        $arrayObject = array();

        $statement->bind_param('i',$user_id);

        $statement -> execute();

        $statement -> bind_result($_id, $title, $year, $season);

        while($statement -> fetch()){

       $object = new Teams($_id, $title, $year, $season);

        	array_push($arrayObject,$object );

        }
          $responseObj->user_id = $user_id;
          $responseObj->teamList = $arrayObject;


       echo json_encode($responseObj);



                 $statement -> close();



	 } catch(Exception $e) {

        echo $e;
        var_dump("Fetching Connection Error!");

        die ( "<h2>Final message</h2>" );

    }




?>
