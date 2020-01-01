<?php

class TableData{
public $title;
public $total;
public $balls;
public $strikes;
public $strikePerc;
public $minSp;
public $maxSp;
public $avgSp;
public $totalBat;



function __construct( $title, $s, $b, $min, $max, $avg,$tB)
{

           $t = $s + $b;
  $this->title = $title;
  $this->total = $t;
  $this->balls = $b;
  $this->strikes = $s;
  $this->strikePerc = ($t != 0 )?  number_format( ($s/($t))*100 ,1 ) :  0  ;
  $this->minSp = $min;
  $this->maxSp = $max;
  $this->avgSp = number_format($avg, 1);
  $this->totalBat = $tB;
}
}

class StatView{

public $tableTitle;
public $data;

function __construct($tableTitle, $data, $coords){
$this->tableTitle = $tableTitle;
$this->data = $data;
$this->coords = $coords;

}

}

class MetaTableData{
public $metaStats;
public $pitchTypes;

function __construct($pitchTypes, $metaStats){
$this->metaStats = $metaStats;
$this->pitchTypes = $pitchTypes;

}
}

class MetaStats{
public $totalBats;
public $allStrikes;
public $allWalks;
public $allHits;

function __construct($allBats, $allStrikes, $allWalks, $allHits ){
$this->allBats = $allBats;
$this->allStrikes = $allStrikes;
$this->allWalks = $allWalks;
$this->allHits= $allHits;

}
}

Class GameSessions {


    function __construct($date, $opponent){

        $this->date=$date;
        $this->opponent=$opponent;
      }


    }

    class Coords{
public $x;
public $y;
public $t;

function __construct( $x, $y, $t )
{
$this->x = $x;
$this->y = $y;
$this->t = $t;
}
}



?>
