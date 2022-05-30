/* КОНСТАНТЫ START */
//media
const mediaDuration = 3;  // Длительность показа медиа в секундах
//weather
const weather_Api = '3e6dfeac0ade2be0bb772ec3b93b445f';
const weather_lat = '58.1113';
const weather_lon = '56.2858';
/* КОНСТАНТЫ END */

//ПЕРЕМЕННЫЕ
let data = {};          //Данные получаемые от сервера
let currentMedia = 0;   //Номер текущего показываемого медиа-файла

let interval_server = setInterval(get_data, 30000);                     //Запрос данных с сервера каждые 30 секунд
let interval_data = setInterval(update_media, mediaDuration * 1000);    //Обновление медиа каждые mediaDuration секунд
let interval_weather = setInterval(get_weather, 120000);                //Запрос данных с сервера погоды каждые 2 минуты
let interval_clock = setInterval(update_clock, 30000);                  //Обновление часов каждые 30 секунд

//Первичный запуск функций после плной прогрузки страницы
document.addEventListener("DOMContentLoaded", function () {
    update_clock();
    get_data();
    get_weather();
});

/*
Функция обновления текста в блоке с часами
*/
function update_clock() {
    let months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    let daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    let time = new Date();
    let thisMonth = months[time.getMonth()];
    let day = time.getDate();
    let dayOfWeek = time.getDay();

    document.getElementById('clock__date').innerHTML = day + ' ' + thisMonth;
    document.getElementById('clock__time').innerHTML = daysOfWeek[dayOfWeek] + ' ' + time.getHours() + ':' + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
}

/*
Функция обработки ресурсов в блоке медиа
*/
function update_media() {

    //Работа с медиа
    if (currentMedia < data['media'].length) {
        let media_str;
        let mediaElement = document.getElementById("media_block");
        clearInterval(interval_data);

        if (data['media'][currentMedia].endsWith("jpg") || data['media'][currentMedia].endsWith("JPG") || data['media'][currentMedia].endsWith("png") || data['media'][currentMedia].endsWith("gif")) {
            media_str = '<img alt="media" class="media" src="/media/' + data['media'][currentMedia] + '">';
            interval_data = setInterval(update_media, mediaDuration * 1000);
        } else {
            media_str = '<video id="mvideo" class="media" width=500px src="/media/' + data['media'][currentMedia] + '" autoplay muted>Видео не поддерживвается</video>';
            //var video = document.createElement('video');
            //video.preload = 'metadata';
            //video.onloadedmetadata = function () {
            //    window.URL.revokeObjectURL(video.src);
            //alert("Duration : " + video.duration + " seconds");
            interval_data = setInterval(update_media, mediaDuration * 1000);
            //}
            //video.src = URL.createObjectURL('/media/' + data['media'][currentMedia]);0
        }
        mediaElement.innerHTML = media_str;
        currentMedia += 1;
    } else {
        currentMedia = 0;
    }
}

/*
Функция получения данных от сервера
*/
function get_data() {
    //Создаем функцию обработчик
    let Handler = function (Request) {
        let obj = JSON.parse(Request.responseText);
        data['media'] = obj['media'];

        console.log(obj);
    };
    //Отправляем запрос
    SendRequest('GET', '/server/', '', Handler);
}

/*
Функция получения данных о погоде от API погоды
*/
function get_weather() {
    //Создаем функцию обработчик
    let Handler = function (Request) {
        let obj = JSON.parse(Request.responseText);
        data['weather'] = obj;

        let element_wether = document.getElementById('weather__temp');
        let element_wether_icon = document.getElementById('weather__icon');
        element_wether.innerHTML = data['weather']['main'].temp + '&#8451;';
        element_wether_icon.setAttribute('src', '/src/weather_icons/' + data['weather']['weather'][0].icon + '.svg');

        console.log(obj);
    };
    //Отправляем запрос
    SendRequest('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + weather_lat + '&lon=' + weather_lon + '&appid=' + weather_Api + '&units=metric', '', Handler);
}


/*
Вспомогательные функции для AJAX запросов
*/

//Создает подходящий тип запроса AJAX, Если есть GECKO то XMLHttpRequest, если нет ActiveXObject
function CreateRequest() {
    let Request = false;
    if (window.XMLHttpRequest) {        //Cовместимые браузеры
        Request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {  //Internet explorer
        try {
            Request = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (CatchException) {
            Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }

    if (!Request) {
        alert("Невозможно создать XMLHttpRequest");
    }

    return Request;
}

/*
Функция посылки запроса к файлу на сервере
r_method  - тип запроса: GET или POST
r_path    - путь к файлу
r_args    - аргументы вида a=1&b=2&c=3...
r_handler - функция-обработчик ответа от сервера
*/
function SendRequest(r_method, r_path, r_args, r_handler) {
    //Создаём запрос
    let Request = CreateRequest();

    //Назначаем пользовательский обработчик
    Request.onreadystatechange = function () {
        //Если обмен данными завершен
        if (Request.readyState === 4) {
            if (Request.status === 200) {
                //Передаем управление обработчику пользователя
                r_handler(Request);
            } else {
                //Оповещаем пользователя о произошедшей ошибке
                alert('Произошла ошибка при выполнении запроса');
            }
        }
    }

    //Проверяем, если требуется сделать GET-запрос
    if (r_method.toLowerCase() === "get" && r_args.length > 0)
        r_path += "?" + r_args;

    //Инициализируем соединение
    Request.open(r_method, r_path, true);

    if (r_method.toLowerCase() === "post") {
        //Если это POST-запрос

        //Устанавливаем заголовок
        Request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        //Посылаем запрос
        Request.send(r_args);
    } else {
        //Если это GET-запрос
        //Посылаем нуль-запрос
        Request.send(null);
    }
} 
