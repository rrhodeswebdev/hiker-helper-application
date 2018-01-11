//API endpoints
const GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json"
const GETTRAIL_API = "https://www.hikingproject.com/data/get-trails"
const GETWEATHER_API = "https://api.weatherbit.io/v2.0/forecast/daily"


//Capture user input, which should be a location
function userSubmitData() {
  $('.js-search-form').on('click', '.js-submit-btn', function(event) {
    event.preventDefault();

    let userValue = $('#input-field').val();

    fetchAllData(userValue);

    userValue = $('#input-field').val("");
  })
}

//API requests

function fetchAllData(userValue) {

  const query = {
    address: `${userValue}`,
    key: "AIzaSyCieNU3oVF-dQYP4iBWoQnc4hqA4zzd4i4"
  }

  $.getJSON(GEOCODE_API, query, function(data) {

    let lat = data.results[0].geometry.location.lat;
    let lon = data.results[0].geometry.location.lng;

    const newQuery = {
      key: "200202949-be5202662091a9dc38356c0c802cd058",
      lat: lat,
      lon: lon,
      maxResults: 15,
      maxDistance: 10
    }

    $.getJSON(GETTRAIL_API, newQuery, function(data) {

      console.log(data);

      let trailInfo = data.trails.map(item =>
        renderResults(item));

      $('.js-search-results').html(trailInfo);

      createMap({
        lat: lat,
        lon: lon
      }, data.trails);
    })

    const query = {
      key: "561f14cf5f16425a98fb0f2ce6cfe344",
      units: "I",
      days: 5,
      lat: lat,
      lon: lon
    }

    console.log(query);

    $.getJSON(GETWEATHER_API, query, function(data) {

      console.log(data);

      let weatherInfo = data.data.map(item =>
        renderWeatherResults(item));

      console.log(weatherInfo)

      $('.js-weather-forecast').html(weatherInfo);

    });
  });
};

//Display a map and list of trails around the location value

function createMap(coords, trails) {
  $('#map').append(
      function initMap() {
        var myLatLng = {
          lat: coords.lat,
          lng: coords.lon
        };

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: myLatLng
        });

        trails.forEach(trail => {
          var marker = new google.maps.Marker({
            position: {
              lat: trail.latitude,
              lng: trail.longitude
            },
            map: map,
            title: trail.name
          })

          var trailMarkerContent = `
          <div class="trail-marker">
            <h3>${trail.name}</h3>
            <img src=${trail.imgSmall}></img>
            <p class="marker-p">${trail.location}</p>
            <pclass="marker-p">Rating: ${trail.stars} out of 5</p>
          </div>
        `

          var infowindow = new google.maps.InfoWindow({
            content: trailMarkerContent
          });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
            });
          });
        });
      };

      function renderResults(item) {
        return `
    <div class="individual-trail">
      <h2>${item.name}</h2>
      <p><img src="${item.imgSmallMed}"</p>
      <p>Location: ${item.location}</p>
      <p>Hiker Rating: ${item.stars}</p>
      <p>${item.summary}</p>
    </div>
  `
      }

      function renderWeatherResults(item) {
        return `
    <div class="daily-forecast">
      <img width="100px" height="100px" src="https://weatherbit.io/static/img/icons/${item.weather.icon}.png"></img>
      <h3>${item.datetime}</h3>
      <p>High: ${item.max_temp.toFixed()} F</p>
      <p>Low: ${item.min_temp.toFixed()} F</p>
      <p>${item.weather.description}</p>
      <p>Chance of Precipitation: ${item.pop}%</p>
    </div>
  `
      }

      $(userSubmitData)
