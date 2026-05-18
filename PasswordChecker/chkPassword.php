<?php
header("Content-type: text/html; charset=utf-8");
$pwd = file_get_contents("php://input");
$points = 0;

// Length
if (strlen($pwd) >= 8)  $points++;
if (strlen($pwd) >= 12) $points++;

// Upper and lower case
if (preg_match('/[a-z]/', $pwd) && preg_match('/[A-Z]/', $pwd)) {
    $points++;
}

// Numbers
if (preg_match('/[0-9]/', $pwd)) {
    $points++;
}

// Symbols
if (preg_match('/[^a-zA-Z0-9]/', $pwd)) {
    $points++;
}

// Score
if ($points <= 2) {
    echo "schwach";
} elseif ($points <= 4) {
    echo "ok";
} else {
    echo "super";
}