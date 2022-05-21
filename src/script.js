//CONSTANTS
let mediaDuration = 3; // Длительность показа медиа в секундах
//

function clock(){
    
    months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
    daysOfWeek = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресение"];

    var time = new Date();
    var thismonth = months[time.getMonth() + 1];
    var date = time.getDate();
    var thisyear = time.getYear();
    var day = time.getDay() + 1;

    //document.getElementById('clock__date').innerHTML = day + ' ' + thismonth + ', ' + daysOfWeek[time.getDate()];
    //document.getElementById('clock__time').innerHTML = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
}

setInterval(clock, 30000);
clock();

var data = {};
let currentMedia = 0;
let timer = setInterval(processData, mediaDuration * 1000); //set to 60000 for 60 seconds

function processData() {

    //Работа с медиа
    if (currentMedia < data['media'].length) {
        let media_str;
        var currentElement = document.getElementById("media_block");
        clearInterval(timer);

        if(data['media'][currentMedia].endsWith("jpg") || data['media'][currentMedia].endsWith("png") || data['media'][currentMedia].endsWith("gif")) {
            media_str = '<img class="media" src="/media/' + data['media'][currentMedia] + '">';
            currentElement.innerHTML = media_str;
            
            timer = setInterval(processData, mediaDuration * 1000);
        } else {
            media_str = '<video id="mvideo" class="media" width=500px src="/media/'+ data['media'][currentMedia] + '" autoplay muted>Видео не поддерживвается</video>';
            currentElement.innerHTML = media_str;

            //var video = document.createElement('video');
            //video.preload = 'metadata';
            //video.onloadedmetadata = function () {
            //    window.URL.revokeObjectURL(video.src);
                //alert("Duration : " + video.duration + " seconds");
                timer = setInterval(processData, mediaDuration * 1000);
            //}
            //video.src = URL.createObjectURL('/media/' + data['media'][currentMedia]);0
        }
        currentMedia += 1;



    } else {
        currentMedia = 0;
    }
}

function GetData() {
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




