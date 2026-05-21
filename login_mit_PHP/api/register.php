<?php
require ('../inc/dbconnect.php');

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'));

$fullname = trim($data->fullname);
$username = trim($data->username);
$password = $data->password;
$password2 = $data->password2;

if($password == $password2){
    $password = password_hash($password, PASSWORD_DEFAULT);
    register($password);
} else {
    echo json_encode(array("success" => false));
}

function register($pwd){
    global $conn, $fullname, $username;
    $sql = "INSERT INTO login (fullname, username, password) VALUES (:fullname, :username, :password)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':fullname', $fullname, PDO::PARAM_STR);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->bindParam(':password', $pwd, PDO::PARAM_STR);
    if ($stmt->execute()) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false));
    }
}