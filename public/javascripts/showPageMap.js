mapboxgl.accessToken = mapToken;
console.log(camp);
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12', // stylesheet location
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(),'bottom-right'); //for navigation and zoom in

new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${camp.title}</h4><p>${camp.location}</p>`
            )
    )
    .addTo(map)