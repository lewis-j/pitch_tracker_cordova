<?php
include "./SQL_config.php";
include "./pitch_data_classes.php";

$requestPayload = file_get_contents("php://input");

$object = json_decode($requestPayload);

$viewDatastruct = array();
$viewData = new StdClass;
$viewData->option = null;
$viewData->date = null;
$viewData->player_id = $object->player_id;

 $statement = createStatement($viewData);

array_push($viewDatastruct, new StatView($object->titles[0],getPitchData($statement, $myconn), null ));

 if(isset($object->options)){

    $optionCount = count($object->options);

    for($i =0; $i < $optionCount; $i++){

         $viewData->option = $object->options[$i];

          $statement = createStatement($viewData);
        array_push($viewDatastruct, new StatView($object->titles[$i+1] ,getPitchData($statement, $myconn), null ));

    }


 }

 $gamesCollection = getGamesData($object->player_id, $myconn);


for($i =0; $i < count($gamesCollection); $i++){
   $viewData->option = null;
   $viewData->date = $gamesCollection[$i]->date;
   $viewData->player_id = $object->player_id;
   $viewData->opponent = $gamesCollection[$i]->opponent;
   $tableTitle =  $viewData->opponent." ".$viewData->date;
   $statement = createStatement($viewData);
   $viewData->opponent = $gamesCollection[$i]->opponent;
   array_push($viewDatastruct, new StatView($tableTitle, getPitchData($statement, $myconn), getCoords($viewData->player_id , $viewData->date,$viewData->opponent, $myconn) ));
}




echo json_encode($viewDatastruct);

function getCoords($pitcher_id, $date, $opponent, $myconn){
  $coordSQL = "SELECT `srjc_game-pitches`.`xCoord`,`srjc_game-pitches`.`yCoord`,`srjc_game-pitches`.`pitchType`
                      FROM `srjc_game-pitches`
                      INNER JOIN `srjc_game-pitchers` ON `srjc_game-pitches`.`fk_pitchers_id` = `srjc_game-pitchers`.`pitchers_id`
                      WHERE `srjc_game-pitchers`.`pitcher_id` = '{$pitcher_id}' AND `srjc_game-pitchers`.`date` = '{$date}' AND `srjc_game-pitchers`.`opponent` = '{$opponent}'";

  $statement = $myconn->prepare($coordSQL);
  $statement->execute();
  $statement -> bind_result($xCoord, $yCoord, $pType);
  $tempArray = array();
  while($statement -> fetch()){
    array_push($tempArray, new Coords($xCoord, $yCoord,$pType));
  }
  $statement->close();
  return $tempArray;
}

function getGamesData($pitcher_id, $myconn){
  $gamesArray = array();

        $allData = "SELECT `date`, `opponent`
                    FROM `srjc_game-pitchers`
                    WHERE `pitcher_id` = '{$pitcher_id}'";
        $statment = $myconn -> prepare($allData);

        $statment -> execute();

        $statment -> bind_result($date,$opponent);

        while($statment -> fetch()){

          array_push($gamesArray, new GameSessions($date, $opponent));

          }

          $statment -> close();

          return $gamesArray;
}


function getPitchData( $sqlStatement, $myconn){
try {
  $statement = $myconn->prepare($sqlStatement);

  $statement -> execute();

          $statement -> bind_result( $allMinSp, $allMaxSp, $allAvgSp,$allS, $allB,$allBat, $allK, $allW, $allH,
                                    $allSFB, $allBFB, $allMinSpFB,$allMaxSpFB, $allAvgSpFB,$allBatFB,
                                    $allSCB, $allBCB, $allMinSpCB,$allMaxSpCB, $allAvgSpCB,$allBatCB,
                                    $allSCH, $allBCH, $allMinSpCH,$allMaxSpCH, $allAvgSpCH,$allBatCH,
                                    $allSSL, $allBSL, $allMinSpSL,$allMaxSpSL, $allAvgSpSL,$allBatSL,
                                    $allSOT, $allBOT, $allMinSpOT,$allMaxSpOT, $allAvgSpOT,$allBatOT);

          }catch(Exception $e){
            echo $e;
          }
                  $count = 0;
          if($statement -> fetch()){
            $count++;
           $tableCollection = array(new TableData("All",$allS, $allB,$allMinSp, $allMaxSp, $allAvgSp,$allBat),
                               new TableData("FB", $allSFB, $allBFB, $allMinSpFB,$allMaxSpFB, $allAvgSpFB,$allBatFB),
                               new TableData("CB", $allSCB, $allBCB, $allMinSpCB,$allMaxSpCB, $allAvgSpCB,$allBatCB),
                               new TableData("CH", $allSCH, $allBCH, $allMinSpCH,$allMaxSpCH, $allAvgSpCH,$allBatCH),
                               new TableData( "SL",$allSSL, $allBSL, $allMinSpSL,$allMaxSpSL, $allAvgSpSL,$allBatSL),
                               new TableData("OT",$allSOT, $allBOT, $allMinSpOT,$allMaxSpOT, $allAvgSpOT,$allBatOT));

                               $metaStats = new Metastats($allBat, $allK, $allW, $allH);

              }
              $statement->close();
              return new MetaTableData($tableCollection, $metaStats);;
            }





function createStatement($object){


$player_id = $object->player_id;

$option = null;

if (isset($object->option)){
  $option = $object->option;
  $minMaxAve = "MIN(CASE WHEN  {$option} THEN `srjc_game-pitches`.`pitchspeed` END) as 'allMinSpFB',
                MAX(CASE WHEN  {$option} THEN `srjc_game-pitches`.`pitchspeed` END) as 'allMaxSpFB',
                AVG(CASE WHEN  {$option} THEN `srjc_game-pitches`.`pitchspeed` END) as 'allAvgSpFB',";
   $option= "AND ".$option;
}else{
  $minMaxAve = "MIN(`srjc_game-pitches`.`pitchspeed`),
                MAX(`srjc_game-pitches`.`pitchspeed`),
                AVG(`srjc_game-pitches`.`pitchspeed`),";
  $option ="";
}
if (isset($object->date)){
  $dateOption = "AND `srjc_game-pitchers`.`date` = '{$object->date}'";
}else{
  $dateOption = null;
}

if (isset($object->opponent)){
  $opponentOption = "AND `srjc_game-pitchers`.`opponent` = '{$object->opponent}'";
}else{
  $opponentOption = null;
}




$pitchT = array("FB","CB","CH","SL","other");


 $statement = "SELECT ".$minMaxAve;

 $statement = $statement . "
                   SUM(CASE WHEN  `srjc_game-pitches`.`play` =  'Strike' {$option} THEN 1 ELSE 0 END) as 'allS',
                   SUM(CASE WHEN  `srjc_game-pitches`.`play` =  'Ball' {$option} THEN 1 ELSE 0 END) as 'allB',
                   SUM(CASE WHEN  `srjc_game-pitches`.`firstpitch` =  '1' {$option} THEN 1 ELSE 0 END) as 'allbatFB',
                   SUM(CASE WHEN  `srjc_game-pitches`.`endPlay` =  'Strike Out' {$option} THEN 1 ELSE 0 END) as 'allK',
                   SUM(CASE WHEN  `srjc_game-pitches`.`endPlay` =  'Walk' {$option} THEN 1 ELSE 0 END) as 'allW',
                   SUM(CASE WHEN  `srjc_game-pitches`.`endPlay` =  'Hit' {$option} THEN 1 ELSE 0 END) as 'allH',";

                   for($i=0; $i < count($pitchT); $i++) {
                                        $statement = $statement.
                                     "SUM(CASE WHEN  `srjc_game-pitches`.`play` =  'Strike' AND `srjc_game-pitches`.`pitchType` = '{$pitchT[$i]}' {$option} THEN 1 ELSE 0 END) as 'allSFB',
                                     SUM(CASE WHEN  `srjc_game-pitches`.`play` =  'Ball' AND `srjc_game-pitches`.`pitchType` = '{$pitchT[$i]}' {$option} THEN 1 ELSE 0 END) as 'allBFB',
                                     MIN(CASE WHEN  `srjc_game-pitches`.`pitchType` = '{$pitchT[$i]}' {$option} THEN `srjc_game-pitches`.`pitchspeed` END) as 'allMinSpFB',
                                     MAX(CASE WHEN  `srjc_game-pitches`.`pitchType` = '{$pitchT[$i]}' {$option} THEN `srjc_game-pitches`.`pitchspeed` END) as 'allMaxSpFB',
                                     AVG(CASE WHEN  `srjc_game-pitches`.`pitchType` = '{$pitchT[$i]}' {$option} THEN `srjc_game-pitches`.`pitchspeed` END) as 'allAvgSpFB',
                                     SUM(CASE WHEN  `srjc_game-pitches`.`pitchType` = '{$pitchT[$i]}' AND `srjc_game-pitches`.`firstpitch` =  '1' {$option} THEN 1 ELSE 0 END) as 'allbatFB'";
                                     if($i != (count($pitchT) - 1)){
                                       $statement = $statement.",";
                                     }

                                     }

                                     $statement = $statement."FROM `srjc_game-pitches`
                    INNER JOIN `srjc_game-pitchers` ON `srjc_game-pitches`.`fk_pitchers_id` = `srjc_game-pitchers`.`pitchers_id`
                    WHERE `srjc_game-pitchers`.`pitcher_id` = '{$player_id}' {$dateOption} {$opponentOption}";

                    return $statement;
                  }

?>
