<?php
require('../inc/dbconnect.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));
$id = $data->id;

$sql = "DELETE FROM tasks WHERE id = :id";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':id', $id);

if ($stmt->execute()) {
    echo json_encode(array("status" => "success"));
} else {
    echo json_encode(array("status" => "error"));
}

$conn = null;