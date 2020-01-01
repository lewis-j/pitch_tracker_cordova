<?php
include "./SQL_config.php";

class Teams {

public function __construct($id, $title, $year, $season){
  $this->_id = strval($id);
   $this->title = $title;
  $this->year = $year;
  $this->season = $season;
}

}




	 try{

        $allData = "SELECT `team_id`,`title`,`year`,`season`
        FROM `srjc_team_list` ORDER BY `year` ASC";

        $statement = $myconn -> prepare($allData);
        $arrayObject = array();

        $statement -> execute();

        $statement -> bind_result($_id, $title, $year, $season);

        while($statement -> fetch()){

       $object = new Teams($_id, $title, $year, $season);

        	array_push($arrayObject,$object );

        }


       echo json_encode($arrayObject);



                 $statement -> close();



	 } catch(Exception $e) {

        echo $e;
        var_dump("Fetching Connection Error!");

        die ( "<h2>Final message</h2>" );

    }




?>
