//CONSTANTS
const mediaDuration = 3;  // Длительность показа медиа в секундах

//VARS
let data = {};          //Данные получаемые от сервера
let currentMedia = 0;   //Текущий показываемый медиа файл

let interval_clock = setInterval(update_clock, 1000);
let interval_data = setInterval(process_data, mediaDuration * 1000);

/*
Функция обновления текста в блоке с часами
*/
function update_clock(){
    months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
    daysOfWeek = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресение"];

    var time = new Date();
    var thismonth = months[time.getMonth() + 1];
    var day = time.getDay() + 1;
    var dayOfWeek =  time.getDay();

    document.getElementById('clock__date').innerHTML = day + ' ' + thismonth;
    document.getElementById('clock__time').innerHTML = daysOfWeek[dayOfWeek] + ' ' + time.getHours() + ':' + time.getMinutes();
}

/*
Функция обработки данных получаемых от сервера
*/
function process_data() {

    //Работа с медиа
    if (currentMedia < data['media'].length) {
        let media_str;
        let mediaElement = document.getElementById("media_block");
        clearInterval(interval_data);

        if(data['media'][currentMedia].endsWith("jpg") || data['media'][currentMedia].endsWith("JPG") || data['media'][currentMedia].endsWith("png") || data['media'][currentMedia].endsWith("gif")) {
            media_str = '<img class="media" src="/media/' + data['media'][currentMedia] + '">';
            interval_data = setInterval(process_data, mediaDuration * 1000);
        } else {
            media_str = '<video id="mvideo" class="media" width=500px src="/media/'+ data['media'][currentMedia] + '" autoplay muted>Видео не поддерживвается</video>';
            //var video = document.createElement('video');
            //video.preload = 'metadata';
            //video.onloadedmetadata = function () {
            //    window.URL.revokeObjectURL(video.src);
                //alert("Duration : " + video.duration + " seconds");
                interval_data = setInterval(process_data, mediaDuration * 1000);
            //}
            //video.src = URL.createObjectURL('/media/' + data['media'][currentMedia]);0
        }
        mediaElement.innerHTML = media_str;
        currentMedia += 1;
    } else {
        currentMedia = 0;
    }
}

function get_data() {
    //Создаем функцию обработчик
    var Handler = function(Request) {
        var obj = JSON.parse(Request.responseText);
        data = obj;

        console.log(obj);
    }
    //Отправляем запрос
    SendRequest('GET', '/server/', '', Handler);
}

setInterval(GetData, 30000);
GetData()

//Создает подходящий тип запроса AJAX, Если есть GECKO то XMLHttpRequest, если нет ActiveXObject
function CreateRequest() {
    var Request = false;
    if (window.XMLHttpRequest) {
        //Gecko-совместимые браузеры, Safari, Konqueror
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        //Internet explorer
        try {
            Request = new ActiveXObject("Microsoft.XMLHTTP");
        }    
        catch (CatchException) {
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
function SendRequest(r_method, r_path, r_args, r_handler)
{
    //Создаём запрос
    var Request = CreateRequest();

    //Назначаем пользовательский обработчик
    Request.onreadystatechange = function()
    {
        //Если обмен данными завершен
        if (Request.readyState == 4)
        {
            if (Request.status == 200) {
                //Передаем управление обработчику пользователя
                r_handler(Request);
            }
            else {
                //Оповещаем пользователя о произошедшей ошибке
                alert('Произошла ошибка при выполнении запроса');
            }
        }
    }
    
    //Проверяем, если требуется сделать GET-запрос
    if (r_method.toLowerCase() == "get" && r_args.length > 0)
    r_path += "?" + r_args;
    
    //Инициализируем соединение
    Request.open(r_method, r_path, true);
    
    if (r_method.toLowerCase() == "post") {
        //Если это POST-запрос
        
        //Устанавливаем заголовок
        Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
        //Посылаем запрос
        Request.send(r_args);
    }
    else {
        //Если это GET-запрос
        //Посылаем нуль-запрос
        Request.send(null);
    }
} 




