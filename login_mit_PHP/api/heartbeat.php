<?php
session_start();
header('Content-Type: application/json');

$TIMEOUT = 60;

if (!isset($_SESSION['id'])) {
    echo json_encode(['success' => false]);
    exit;
}

if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $TIMEOUT) {
    session_unset();
    session_destroy();
    echo json_encode(['success' => false, 'reason' => 'timeout']);
    exit;
}

$_SESSION['last_activity'] = time();
echo json_encode(['success' => true]);