<?php
require('../inc/dbconnect.php');
header('Content-Type: application/json');

$id = $_GET['id'] ?? 0;

$sql = "SELECT * FROM tasks WHERE id = :id";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':id', $id);
$stmt->execute();
$task = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($task);
$conn = null;