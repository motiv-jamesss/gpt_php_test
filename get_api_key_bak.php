<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$api_key = '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';
echo json_encode(array('api_key' => $api_key));
?>