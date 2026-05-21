<?php
require('../inc/dbconnect.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));

$id = $data->id;
$title = $data->title;
$description = $data->description;
$priority = $data->priority;
$status = $data->status;

$sql = "UPDATE tasks SET title = :title, description = :description, priority = :priority, status = :status WHERE id = :id";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':id', $id);
$stmt->bindParam(':title', $title);
$stmt->bindParam(':description', $description);
$stmt->bindParam(':priority', $priority);
$stmt->bindParam(':status', $status);

if ($stmt->execute()) {
    echo json_encode(array("status" => "success"));
} else {
    echo json_encode(array("status" => "error"));
}

$conn = null;