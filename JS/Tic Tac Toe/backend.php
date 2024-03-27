<?php
$memcache = new Memcache;
$memcache -> connect('localhost', 10123) or die("could not connect memcache");

function init() {
    // set data who is o, who is x
    global $memcache;
    $memcache -> set('positions', array(
        "0" => "", "1" => "", "2" => "", 
        "3" => "", "4" => "", "5" => "", 
        "6" => "", "7" => "", "8" => "",
    ), false, 10) or die('failed to save data');
    $memcache -> set('current_move', "o", false, 10) or die('failed to save data');
}

function endGame($gameState) {
    global $memcache;
    $memcache -> flush();
    // who win
}

function beginGame() {
    echo json_encode(array("game" => "start"));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $req = json_decode(file_get_contents('php://input'), true);

    //  start
    if (isset($req["init"])) {
        init();
        echo "game started!";
    } else if (isset($req["player_start"]) && isset($req["date"])) {
        // beginGame();

        $player = $req["player_start"];
        $date = $req["date"];
        
        echo json_encode(array(
            "date" => $date,
            "player" => $player
        ));
        // echo "make a move!";
    } // game
    else {
        $player = $req["player"];
        $position = $req["position"];

        $positions = $memcache -> get('positions');
        $positions[$position] = $player;
        $currMove = $player == "o" ? "x" : "o";
        
        $memcache -> set('positions', $positions);
        $memcache -> set('current_move', $currMove);
    
        echo json_encode(array(
            'positions' => $positions, 
            'currentMove' => $currMove
        ));
    }
}
?>