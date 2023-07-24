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
			style: 'mapbox://styles/jsolly/clkg6as3i002201r2d79a248x',
			center: [-98.5795, 39.8283],
			zoom: 3
		});

		map.on('load', function () {
			map.addSource('LANDSAT_SCENE_OUTLINES', {
				type: 'vector',
				url: 'mapbox://jsolly.cq2vdng6'
			});

			map.addLayer({
				id: 'LANDSAT_SCENE_OUTLINES-layer',
				type: 'fill',
				source: 'LANDSAT_SCENE_OUTLINES',
				'source-layer': 'landsat_scenes_intersecting_c-22roct',
				paint: {
					'fill-color': 'transparent',
					'fill-opacity': 1,
					'fill-outline-color': 'green'
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
