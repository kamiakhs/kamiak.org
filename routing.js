// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    mapTypeControl: false,
    center: { lat: -33.8688, lng: 151.2195 },
    zoom: 13,
  });

  window.handler = new AutocompleteDirectionsHandler(map);
}

class AutocompleteDirectionsHandler {
  map;
  placeIds;
  travelMode;
  directionsService;
  directionsRenderer;
  constructor(map) {
    this.map = map;
    this.placeIds = [];
    this.travelMode = google.maps.TravelMode.WALKING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const modeSelector = document.getElementById("mode-selector");

    this.setupClickListener(
      "changemode-walking",
      google.maps.TravelMode.WALKING
    );
    this.setupClickListener(
      "changemode-transit",
      google.maps.TravelMode.TRANSIT
    );
    this.setupClickListener(
      "changemode-driving",
      google.maps.TravelMode.DRIVING
    );
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    this.addInput();
    this.addInput();
  }
  addInput() {
    let i = this.placeIds.length;
    this.placeIds.push(null);
    let input = document.createElement('input');
    input.classList.add('controls', 'place-input');
    input.type = 'text';
    input.placeholder = 'Enter a location';
    let autocomplete = new google.maps.places.Autocomplete(
      input,
      { fields: ["place_id"] }
    );
    this.setupPlaceChangedListener(autocomplete, i);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  }
  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  setupClickListener(id, mode) {
    const radioButton = document.getElementById(id);

    radioButton.addEventListener("click", () => {
      this.travelMode = mode;
      this.route();
    });
  }
  setupPlaceChangedListener(autocomplete, i) {
    autocomplete.bindTo("bounds", this.map);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }

      console.log('yeet '+i);
      this.placeIds[i] = place.place_id;
      this.route();
    });
  }
  route() {
    for (const placeId of this.placeIds) {
      if (!placeId) return;
    }
    
    let waypoints = [];
    for (let i = 1; i < this.placeIds.length-1; i++) {
      waypoints.push({location: {placeId: this.placeIds[i]}, stopover: true});
    }
    console.log(this.placeIds[0], waypoints, this.placeIds[this.placeIds.length-1]);
    this.directionsService.route(
      {
        origin: { placeId: this.placeIds[0] },
        destination: { placeId: this.placeIds[this.placeIds.length-1] },
        travelMode: this.travelMode,
        waypoints: waypoints,
        optimizeWaypoints: true,
      },
      (response, status) => {
        if (status === "OK") {
          console.log('OK', response);
          this.directionsRenderer.setDirections(response);
        } else {
          console.log('NOT OK', response);
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}

window.initMap = initMap;


// Dragbar handling
let $dragLeft = $('#dragLeft');
let dragOffset;
const drag = (e) => {
  // Remove current selection
  if (document.selection) {
    document.selection.empty();
  } else {
    window.getSelection().removeAllRanges();
  }
  $dragLeft.css('width', e.pageX-dragOffset+'px');
}
$('#dragBar').on('mousedown', (e) => {
  let rect = e.target.getBoundingClientRect();
  dragOffset = e.pageX-rect.left;
  $('html, body').css('cursor', 'col-resize');
  $(document).on('mousemove', drag);
});
$(document).on('mouseup', () => {
  if (dragOffset == null) return;
  dragOffset = null;
  $('html, body').css('cursor', '');
  $(document).on('mousemove', drag);
});
