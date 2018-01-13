//API endpoints
const GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json"
const GETTRAIL_API = "https://www.hikingproject.com/data/get-trails"
const GETWEATHER_API = "https://api.weatherbit.io/v2.0/forecast/daily"


//Capture user input, which should be a location
function userSubmitData() {
  $('.js-submit-btn').click(function(event) {
    event.preventDefault();
    $('section').removeClass('hidden')

    let userValue = $('#input-field').val();

    fetchAllData(userValue);

    userValue = $('#input-field').val("");
  })
}

//API requests

function fetchAllData(userValue) {

  $('.search-message').html(`<p class="trails-near-text">Trails near ${userValue}</p>`).removeClass('hidden')

  const query = {
    address: `${userValue}`,
    key: "AIzaSyCieNU3oVF-dQYP4iBWoQnc4hqA4zzd4i4"
  }

  $.getJSON(GEOCODE_API, query, function(data) {

    if (data.status === "ZERO_RESULTS") {
      $('.js-error-handle').html('That location must be lost...try again').removeClass('hidden')
      return;
    } else {

      let lat = data.results[0].geometry.location.lat;
      let lon = data.results[0].geometry.location.lng;

      const newQuery = {
        key: "200202949-be5202662091a9dc38356c0c802cd058",
        lat: lat,
        lon: lon,
        maxResults: 500,
        maxDistance: 10
      }

      $.getJSON(GETTRAIL_API, newQuery, function(data) {

        if (data.trails.length === 0) {
          createMap({
            lat: lat,
            lon: lon
          }, data.trails);
          $('.js-search-results').html(`<p class="no-trails-text">No trails found near that location<p><br/><button class="search-again-btn"><a href="#search-banner">Try Another Location</a></button>`)
          $('.js-weather-forecast').addClass('hidden')
        } else {

          let trailInfo = data.trails.map(item =>

            renderResults(item));

          $('.js-search-results').html(trailInfo);

          createMap({
            lat: lat,
            lon: lon
          }, data.trails);
        };
      }).fail(function(err) {
        console.log("Handle Trail API Error", err);
        $('.js-error-handle').html(`<p>Sorry, we hiked into some technical issues. Please try again later.</p>`).removeClass('hidden')
        return;
      })

      const query = {
        key: "561f14cf5f16425a98fb0f2ce6cfe344",
        units: "I",
        days: 5,
        lat: lat,
        lon: lon
      }

      $.getJSON(GETWEATHER_API, query, function(data) {

        let weatherInfo = data.data.map(item =>

          renderWeatherResults(item));

        $('.js-weather-forecast').html(weatherInfo);

      }).fail(function(err) {
        console.log("Handle Weather API Error", err)
        $('.js-error-handle').html(`<p>Sorry, we hiked into some technical issues. Please try again later.</p>`).removeClass('hidden')
        return;
      });
    }
  }).fail(function(err) {

    $('.js-error-handle').html(`<p>Try that location again</p>`).removeClass('hidden')
    return;
  })
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
            <a href="#${trail.id}"><h3>${trail.name}</h3></a>
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
  if (item.imgSmallMed === "") {
    let defImg = [
      "https://images.unsplash.com/photo-1501425359013-96058e410cfc?auto=format&fit=crop&w=1057&q=80",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1053&q=80",
      "https://images.unsplash.com/photo-1486210284477-e900ad8a6820?auto=format&fit=crop&w=1052&q=80",
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=1078&q=80",
      "https://images.unsplash.com/photo-1478555718543-a87aa261dbc4?auto=format&fit=crop&w=967&q=80",
      "https://images.unsplash.com/photo-1499872995989-56985d47da53?auto=format&fit=crop&w=1052&q=80",
      "https://images.unsplash.com/photo-1504193902866-27cfb5aafcc8?auto=format&fit=crop&w=1050&q=80",
      "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=1053&q=80",
      "https://images.unsplash.com/photo-1445207966278-0a0a65a2047b?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1445020902115-024a045d4552?auto=format&fit=crop&w=967&q=80",
      "https://images.unsplash.com/photo-1455741221562-726825b9cb2b?auto=format&fit=crop&w=1010&q=80",
      "https://images.unsplash.com/photo-1446210050316-7c556e3aade0?auto=format&fit=crop&w=967&q=80",
      "https://images.unsplash.com/photo-1420802498636-9d647b43d2eb?auto=format&fit=crop&w=1050&q=80"
    ]
    let newImgSrc = defImg[Math.floor(Math.random()*defImg.length)]
    item.imgSmallMed = newImgSrc
  }

  return `
    <div class="individual-trail" id="${item.id}">
      <h2 class="trail-text-info">${item.name}</h2>
      <p class="trail-text-info">${item.location}</p>
      <p><img src="${item.imgSmallMed}"></p>
      <p class="trail-text-info">${item.summary}</p>
      <p class="trail-text-info">Distance: <b>${item.length} miles</b></p>
      <p class="trail-text-info">High: <b>${item.low}'</b> Low: <b>${item.high}'</b></p>
      <p class="trail-text-info">Ascent: <b>${item.ascent}'</b> Descent: <b>${item.descent}'</b></p>
      <p class="trail-text-info">Rating: ${item.stars} out of 5</p>
      <p class="trail-text-info"><a href="${item.url}" target="_blank">See more details</a></p>
    </div>
  `
};

function renderWeatherResults(item) {
  return `
    <div class="daily-forecast">
      <img width="75px" height="75px" src="https://weatherbit.io/static/img/icons/${item.weather.icon}.png"></img>
      <h3 class="weather-text">${item.datetime}</h3>
      <p class="weather-text">High: ${item.max_temp.toFixed()} F Low: ${item.min_temp.toFixed()} F</p>
      <p class="weather-text">${item.weather.description}</p>
      <p class="weather-text">Chance of Precip: ${item.pop}%</p>
    </div>
  `
}

$(userSubmitData)
