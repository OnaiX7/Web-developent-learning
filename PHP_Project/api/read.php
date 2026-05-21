<?php

require ('../inc/dbconnect.php');

$sql = "SELECT * FROM `tasks` ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$data = [];
while($row = $stmt->fetch()) {
    array_push($data, $row);
}

echo json_encode($data);
$conn = null;
