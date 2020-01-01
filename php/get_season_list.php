<?php
include "./SQL_config.php";


class Season{

function __construct($id, $t, $y, $s){

   $this->team_id = $id;
   $this->title=$t;
   $this->year=$y;
   $this->season=$s;
}



}


      $allSeasons = array();
      // Define SQL statement
      $mysql = "SELECT `team_id`,`title`,`year`, `season`
      FROM `srjc_team_list`";


      // I am sending the templated text of my SELECT command to MySQL
      $mystatement = $myconn -> prepare( $mysql );

      // tell mysql to perform the SQL command with our values
      $mystatement -> execute();

      // Bind results: id, name, address, hours
      $mystatement -> bind_result($id,$title, $year, $season);
        while ( $mystatement -> fetch() ) {

           array_push($allSeasons, new Season($id, $title, $year, $season));
        }

        $mystatement->close(); 

        echo json_encode($allSeasons);


      ?>
