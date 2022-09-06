<?php
    if (empty($_GET) || !isset($_GET['hash'])) {
        header("HTTP/1.1 404 Not Found");
        return;
    }

    if ($_GET['hash'] != "esp8266_") {
        header("HTTP/1.1 404 Not Found");
        return;
    }

    // curl --header "Content-Type: application/json" --request POST --data '{"username":"xyz","password":"xyz"}' http://130.61.119.236/o_sensors/data.php?hash=esp8266_
    // $data = json_decode(file_get_contents('php://input'), true);

    $file = "data.json";
    $prev = file_get_contents($file);
    $jsonPrev = json_decode($prev);
    
    $newData = file_get_contents('php://input');    
    $curJson = json_decode($newData);
    $curJson->{'timestamp'} = time();

//     if (count($jsonPrev) == 0) {
//         $jsonPrev = [];
//     }
// 
//     if (count($jsonPrev) >= 10) {
//         unset($jsonPrev[0]);
//     }

    $jsonPrev->{'last'} = $curJson;
    
    if (!$jsonPrev->{'data'}) {
        $jsonPrev->{'data'} = [];
    }

    $lastTimestamp = end($jsonPrev->{'data'})->{'timestamp'} ? end($jsonPrev->{'data'})->{'timestamp'} : 0;

    if (time() - $lastTimestamp >= 600) {
        if (count($jsonPrev->{'data'}) >= 144) {
            $jsonPrev->{'data'} = array_shift($jsonPrev->{'data'});
        }
        array_push($jsonPrev->{'data'}, $curJson);
    }

    $newDataJson = json_encode($jsonPrev);
    file_put_contents($file, $newDataJson);

    // $dataToFile = file_get_contents('php://input');
    // file_put_contents($file, $dataToFile);

    header("HTTP/1.1 200 OK");
?>
