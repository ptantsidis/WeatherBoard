let timeDisplayEl = $("#time-display");
let APIKey = "e0cdfdd3f8280af1549d472c098d3d6e";
let APICall = "https://api.openweathermap.org/data/2.5/weather?q=";
//ttps://openweathermap.org/api/one-call-api
let cityBtn = $("#search-btn");
let cityList = $("#city-list");
let searchInput = $("#input");
let newCity = ("");

function displayTime() {
  let currentTime = moment().format("LLLL");
  timeDisplayEl.text(currentTime);
}
setInterval(displayTime, 1000);

//create list element as required
cityBtn.on("click", function (event) {
  event.preventDefault();
  newCity = (searchInput.val());
  if (newCity == "") {
    alert("Try Again");
  } else {
    cityList.append("<li><a href ='#'>" + (searchInput.val() + "</a></li>"));
    // localStorage.setItem(key.newCity);
    currentForecast(newCity);
  }
})
function currentForecast(cityname) {
  let weatherUrl = APICall + newCity + "&appid=" + APIKey + "&units=imperial";
  $.ajax({
    url: weatherUrl,
    type: "GET"
  })
    .then(function (response) {
      // if (response.ok) {
      //   response.json().then(function (data) {
      console.log(response);
      let lat = response.coord.lat;
      let lon = response.coord.lon;
      callfiveday(lat, lon);
      $("#1").html(`<div>
          <h1>City: ${response.name}</h1>
          <h2>${response.main.temp + " °F"}</h2>
          <h3>${response.weather[0].description}</h3>
          <h4>Wind Speed ${response.wind.speed + " mph"}</h4>
          <span><img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" />
          <h5>Humidity: ${response.main.humidity + " %"}</h5>
          </div>`)
    })
}
let color = ""
function callfiveday(lat, lon) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
  $.ajax({
    url: weatherUrl,
    type: "GET"
  })
    .then(function (response) {
      // if (response.ok) {
      //   response.json().then(function (data) {
      console.log(response);

      let daily = response.daily;
      let htmlcode = "";
      for (let i = 0; i < 5; i++) {
        console.log(daily[i].uvi);
        if (daily[i].uvi < 3) {
          let color = "green"
        }
        else if (daily[i] < 6) {
          let color = "yellow"
        }
        else if (daily[i] < 8) {
          let color = "orange"
        }
        else if (daily[i] < 10) {
          let color = "red"
        }
        else {
          let color = "indigo"
        }
        htmlcode += `<div class="card">
           <h2>${daily[i].temp.max + " °F"}</h2>
           <h3>${daily[i].weather[0].description}</h3>
           <span><img src="http://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png" />
           <h4 class="${color}">uvi:${daily[i].uvi}</h4>
           </div>`
      }
      $("#fiveday").html(htmlcode)
    })
}