/* КОНСТАНТЫ START */
//media
const mediaDuration = 3;  // Длительность показа медиа в секундах

/* КОНСТАНТЫ END */

//ПЕРЕМЕННЫЕ
let data = {};          //Данные получаемые от сервера
let currentMedia = 0;   //Номер текущего показываемого медиа-файла

let interval_server = setInterval(get_data, 30000);                     //Запрос данных с сервера каждые 30 секунд
let interval_data = setInterval(update_media, mediaDuration * 1000);    //Обновление медиа каждые mediaDuration секунд

//Первичный запуск функций после плной прогрузки страницы
document.addEventListener("DOMContentLoaded", function () {
    get_data();
});


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
            let video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                //alert("Duration : " + video.duration + " seconds");
                interval_data = setInterval(update_media, video.duration * 1000);
            }
            video.src = '/media/' + data['media'][currentMedia];
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
        data = obj;

        let element_wether = document.getElementById('weather__temp');
        let element_wether_icon = document.getElementById('weather__icon');
        element_wether.innerHTML = data['weather']['temp'] + '&#8451;';
        element_wether_icon.setAttribute('src', '/src/weather_icons/' + data['weather']['code'] + '.svg');

        document.getElementById('clock__date').innerHTML = data['time'][0];
        document.getElementById('clock__week').innerHTML = data['time'][1];
        document.getElementById('clock__time').innerHTML = data['time'][2];
    };
    //Отправляем запрос
    SendRequest('GET', '/server/', '', Handler);
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
