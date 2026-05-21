<?php

require ('../inc/dbconnect.php');

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'));

$title = $data->title;
$description = $data->description;
$prio = $data->priority;
//$title = sanitize($data->title);
//$description = sanitize($data->description);
//$prio = sanitize($data->priority);
//
//function sanitize($dataToSanitize) {
//    $dataSanitized = trim($dataToSanitize);
//    $dataSanitized = stripslashes($dataToSanitize);
//    $dataSanitized = htmlspecialchars($dataToSanitize);
//    return $dataSanitized;
//}

$sql = "INSERT INTO tasks (title, description, priority) VALUES (:title, :description, :priority)";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':title', $title);
$stmt->bindParam(':description', $description);
$stmt->bindParam(':priority', $prio);

if ($stmt->execute()) {
    echo json_encode(array("status" => "success"));
} else {
    echo json_encode(array("status" => "error"));
}

$conn = null;

