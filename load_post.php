<?php
header('Content-Type: application/json');

$postsFile = 'posts.json';

if (file_exists($postsFile)) {
    echo file_get_contents($postsFile);
} else {
    echo json_encode([]);
}
