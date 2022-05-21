<?php

$data = [
    'media' => [],
    ''
];

$data['media'] = array_slice(scandir("../media"), 2);




$json = json_encode($data);
print_r($json);

?>