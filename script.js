function clock(){
    
    months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
    daysOfWeek = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресение"];

    var time = new Date();
    var thismonth = months[time.getMonth() + 1];
    var date = time.getDate();
    var thisyear = time.getYear();
    var day = time.getDay() + 1;

    document.getElementById('clock__date').innerHTML
        = day + ' ' + thismonth + ', ' + daysOfWeek[day.getDate()];
    document.getElementById('clock__time').innerHTML = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
}
setInterval(clock, 1000);
clock();

