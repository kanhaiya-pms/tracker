const socket = io();
// Check if geolocation is supported
if (navigator.geolocation) {
  // Set up geolocation watcher
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error); // Use console.error for errors
    },
    {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
    }
  );
} else {
  console.log("Geolocation is not supported");
}

// Set up the map
const map = L.map("map").setView([0, 0], 16);

// Add tile layer (fixed URL)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};
const circle = {};
const polyline = {};
const latlngs = [];

socket.on("recieve-location", (data) => {
  console.log(data);
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);

  if (markers[id]) {
    markers[id] = L.setLetLng([latitude, longitude]).addTo(map);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }

  if (polyline[id]) {
    latlngs.push([latitude, longitude]);
    polyline[id] = L.polyline(latlngs, { color: "red" }).addTo(map);
  } else {
    latlngs.push([latitude, longitude]);
    polyline[id] = L.polyline(latlngs, { color: "red" }).addTo(map);
  }


  if (circle[id]) {
    circle[id] = L.circle([latitude, longitude], {
      radius: 1000,
      opacity: 0.1,
      stroke: true,
    }).addTo(map);
  } else {
    circle[id] = L.circle([latitude, longitude], {
      radius: 1000,
      opacity: 0.1,
      stroke: true,
    }).addTo(map);
  }
});

socket.on("user-disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    map.removeLayer();
    delete markers[id];
  }
  if (circle[id]) {
    map.removeLayer(circle[id]);
    delete circle[id];
  }
  if (polyline[id]) {
    map.removeLayer(polyline[id]);
    latlngs.length = 0
  }
});
