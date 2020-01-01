<?php
include "./SQL_config.php";

class pitcher {

	    // constructor
    public function __construct($id, $pitcher_name,$team_id, $year, $season) {
        $this->_id = strval($id);
        $this->pitcher_name = $pitcher_name;
        $this->team_id = $team_id;
        $this->year = $year;
        $this->season = $season;

    }


}









	 try{

        $allData = "SELECT `srjc_pitcher-roster`.`pitcher_id`, `srjc_pitcher-roster`.`pitcher_name`, `srjc_team_list`.`team_id` , `srjc_team_list`.`year`, `srjc_team_list`.`season`
        FROM `srjc_pitcher-roster`
        INNER JOIN `srjc_team_list` ON `srjc_pitcher-roster`.`team_id` = `srjc_team_list`.`team_id`";
        $statement = $myconn -> prepare($allData);
        $arrayObject = array();


        $statement -> execute();

        $statement -> bind_result($_id, $pitcherName, $team_id, $year, $season);

        while($statement -> fetch()){

       $object =	new pitcher($_id, $pitcherName, $team_id, $year, $season);

        	array_push($arrayObject,$object );

        }


       echo json_encode($arrayObject);



                 $statement -> close();



	 } catch(Exception $e) {

        echo $e;
        var_dump("Fetching Connection Error!");

        die ( "<h2>Final message</h2>" );
        // or do I choose to handle this differently?
        // header "Location: error.html";
    }



?>
