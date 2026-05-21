<?php
session_start();
require ('../inc/dbconnect.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));

$username = $data->username ?? '';
$password = $data->password ?? '';

$sql = "SELECT * FROM login WHERE username = :username";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':username', $username);
$stmt->execute();
$row = $stmt->fetch();

if ($row && password_verify($password, $row['password'])) {
    $_SESSION['id'] = $row['id'];
    $_SESSION['fullname'] = $row['fullname'];
    $_SESSION['last_activity'] = time();
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false));
}