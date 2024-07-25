<?php
header('Content-Type: application/json');

$uploadsDir = 'uploads/';
$postsFile = 'posts.json';

// Создание директории, если её нет
if (!is_dir($uploadsDir)) {
    mkdir($uploadsDir, 0755, true);
}

// Загрузка существующих постов
$posts = [];
if (file_exists($postsFile)) {
    $posts = json_decode(file_get_contents($postsFile), true);
}

// Сохранение нового поста
$post = [
    'text' => $_POST['text'],
    'family' => 'My family', // Или получите это из другого источника
    'timestamp' => time(),
    'media' => []
];

// Обработка загруженных медиа-файлов
if (isset($_FILES['media'])) {
    foreach ($_FILES['media']['tmp_name'] as $index => $tmpName) {
        $fileName = basename($_FILES['media']['name'][$index]);
        $targetFile = $uploadsDir . time() . '_' . $fileName;
        
        if (move_uploaded_file($tmpName, $targetFile)) {
            $post['media'][] = $targetFile;
        }
    }
}

// Добавление поста в массив и сохранение его в файл
$posts[] = $post;

if (file_put_contents($postsFile, json_encode($posts, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
