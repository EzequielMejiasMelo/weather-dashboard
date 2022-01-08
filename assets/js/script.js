//Global variables
var searchHistory = [];
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var geocodeApiUrl = "http://api.openweathermap.org/geo/1.0/direct?";
var weatherApiKey = "dbfb252a5086fde6ee52e8be5d2fce7f";

//DOM elements
var historyDiv = $(".searchHistory");

function pullHistory(){
    var temp = JSON.parse(localStorage.getItem("history"));
    temp !== null ? searchHistory = temp : null;

    for(var i=0; i<searchHistory.length; i++){
        renderCityBtn(searchHistory[i]);
    }
}

function renderCityBtn(city){
    var buttonNode = $("<button")
        .addClass("btn btn-secondary w-100 m-2 fs-5")
        .attr("data-index", city)
        .text(city);
    
    historyDiv.append(buttonNode);
    
    findCityCoord(city);
    return;
}

function findCityCoord(city){
    $.ajax({
        url: geocodeApiUrl + "q=" + city + "&limit=3&appid=" + weatherApiKey,
        method: "GET"
    }).then(function (response) {
        console.log("GET request from Geocode API \n-----------")
        console.log(response);
        renderCurrentWeather(response);
        renderForecastWeather(response);
    });
    return;
}

function renderCurrentWeather(data){
    return;
}

function renderForecastWeather(data){
    return;
}

function saveHistory(){
    localStorage.setItem("history", JSON.stringify(searchHistory));
    return;
}