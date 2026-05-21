<?php
session_start();
header('Content-Type: application/json');

$_SESSION = array();
session_unset();
session_destroy();

echo json_encode(['success' => true]);