<?php
    header('Content-Type: application/json');
    $jsonQuestions = file_get_contents(__DIR__.'/questions.json');
    die($jsonQuestions);
?>