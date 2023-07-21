<script lang="ts">
	import mapboxgl, { Map } from 'mapbox-gl';
	import { onMount, onDestroy } from 'svelte';

	let map: Map;

	onMount(async () => {
		if (!import.meta.env.VITE_MAPBOX_TOKEN) {
			throw new Error('MAPBOX_TOKEN is required');
		}

		mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-122.486052, 37.830348],
			zoom: 15
		});

		map.on('load', function () {
			map.addSource('US_STATES_OUTLINE', {
				type: 'vector',
				url: 'mapbox://<tileset_id>'
			});

			map.addLayer({
				'id': 'US_STATES_OUTLINE-layer',
				'type': 'fill', // You can modify this based on your specific needs
				'source': 'US_STATES_OUTLINE',
				'source-layer': '<layer_name>', 
				'paint': {
					'fill-color': '#888888',
					'fill-opacity': 0.4
				}
			});
		});
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div id="map" style="width: 800px; height: 600px;" />
