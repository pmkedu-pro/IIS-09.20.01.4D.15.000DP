<?php
//weather
const weather_Api = "3e6dfeac0ade2be0bb772ec3b93b445f";
const weather_lat = "58.1113";
const weather_lon = "56.2858";

date_default_timezone_set('Asia/Yekaterinburg');
session_start();

$data = [];

$data["media"] = array_slice(scandir("../media"), 2);

if (!isset($_SESSION['lastTime'])) {
    $_SESSION['lastTime'] = new DateTime("now");
} else {
    $dateTime = new DateTime("now");
    if($dateTime->diff($_SESSION['lastTime'])->i >= 2){
        $ch = curl_init("http://api.openweathermap.org/data/2.5/weather?lat=" . weather_lat . "&lon=" . weather_lon . "&appid=" . weather_Api . "&units=metric");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $weather = json_decode(curl_exec($ch), true);

        $_SESSION['temp'] = round($weather["main"]["temp"]);
        $_SESSION['code'] = $weather["weather"][0]["icon"];

        $data["weather"]["temp"] = $_SESSION['temp'];
        $data["weather"]["code"] = $_SESSION['code'];

        curl_close($ch);
        $_SESSION['lastTime'] = new DateTime("now");
    } else {
        $data["weather"]["temp"] = "0";
        $data["weather"]["code"] = '01d';
    }
}

$date1 = date('F j');
$date2 = date('l H:i');

$ru_weekdays = array( 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье' );
$en_weekdays = array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' );
$ru_months = array( 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' );
$en_months = array( 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' );

$en_date1 = str_replace($en_months, $ru_months, $date1);
$en_date2 = str_replace($en_weekdays, $ru_weekdays, $date2);

$data["time"][0] = $en_date1;
$data["time"][1] = $en_date2;

$json = json_encode($data);
print_r($json);