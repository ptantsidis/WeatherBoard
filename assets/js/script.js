let timeDisplayEl = $("#time-display");
let APIKey = "e0cdfdd3f8280af1549d472c098d3d6e";
let APICall = "https://api.openweathermap.org/data/2.5/weather?q=";
let cityBtn = $("#search-btn");
let cityList = $("#city-list");
let searchInput = $("#input");
// let searchAgainEl = $("")
let newCity = ("");
let oldCity = ("");
let cityArray = [];
let color = ""
let city = ""

function displayTime() {
  let currentTime = moment().format("LLLL");
  timeDisplayEl.text(currentTime);
}
setInterval(displayTime, 1000);

// get old city to resend
// cityList.on("click", function (event) {
//   event.preventDefault();
//   console.log(event.target );
//   let oldCity = $(this).parent().val();
//   console.log(oldCity);
//   currentForecast(oldCity);
// })

//create list element as required
cityBtn.on("click", function (event) {
  event.preventDefault();
  newCity = (searchInput.val());
  if (newCity == "") {
    alert("Try Again");
  } else {
    cityList.append("<li><a href ='#'>" + (searchInput.val() + "</a></li>"));
    cityArray.push(newCity);
    localStorage.setItem("search", JSON.stringify(cityArray));
    currentForecast(newCity);
    searchInput.val("");
    }
})

function currentForecast(cityname) {
  let weatherUrl = APICall + newCity + "&appid=" + APIKey + "&units=imperial";
  $.ajax({
    url: weatherUrl,
    type: "GET"
  })
    .then(function (response) {
      let lat = response.coord.lat;
      let lon = response.coord.lon;
      city = response.name;
      callfiveday(lat, lon);
    })
}

function callfiveday(lat, lon) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
  $.ajax({
    url: weatherUrl,
    type: "GET"
  })
    .then(function (response) {
      let oneMap = response.daily;
      let htmlcode = "";
      for (let i = 0; i < 6; i++) {
        if (oneMap[i].uvi < 3) {
          color = "green"
        }
        else if (oneMap[i].uvi < 6) {
          color = "yellow"
        }
        else if (oneMap[i].uvi  < 8) {
          color = "orange"
        }
        else if (oneMap[i].uvi  < 11) {
          color = "red"
        }
        else {

          color = "indigo"
        }
        if (i === 0) {
          $("#1").html(`<div>
          <h1>City: ${city}</h1>
          <h2>${Math.round(response.current.temp) + " °F"}</h2>
          <h3>${response.current.weather[0].description}</h3>
          <h4>Wind Speed ${Math.round(response.current.wind_speed) + " mph"}</h4>
          <span><img src="http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png" />
          <h5>Humidity: ${response.current.humidity + " %"}</h5>
          <h5 class ="${color}">uvi: ${oneMap[0].uvi}</h5>
          </div>`)
        }
        else {
          htmlcode += `<div class="card">
            <h2>${moment(oneMap[i].dt * 1000).format("ddd")}</h2>
            <h2>${Math.round(oneMap[i].temp.max) + " °F"}</h2>
            <h3>${oneMap[i].weather[0].description}</h3>
            <span><img src="http://openweathermap.org/img/wn/${oneMap[i].weather[0].icon}@2x.png" />
            <h4 class="${color}">uvi: ${oneMap[i].uvi}</h4>
            </div>`
        }
      }
      $("#fiveday").html(htmlcode)
    })
}

