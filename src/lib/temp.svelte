map.addSource('US_STATES_OUTLINE', {
    type: 'vector',
    url: 'mapbox://jsolly.8op6itrd'
});

map.addLayer({
    id: 'US_STATES_OUTLINE-layer',
    type: 'fill',
    source: 'US_STATES_OUTLINE',
    'source-layer': 'continental_us_states-1b0e2w',
    paint: {
        'fill-color': '#888888',
        'fill-opacity': 0.4
    }
});