<script lang="ts">
	import mapboxgl, { Map, Popup } from 'mapbox-gl';
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
					'fill-color': 'grey',
					'fill-opacity': 0.2,
					'fill-outline-color': 'black'
				}
			});
			// When a click event occurs on a feature in the places layer, open a popup at the
			// location of the feature, with description HTML from its properties.
			map.on('click', 'LANDSAT_SCENE_OUTLINES-layer', (e) => {
				const coordinates = e.lngLat;
				if (!e.features || !e.features.length) {
					console.warn('No features found. Click event ignored.');
					return;
				}
				const feature = e.features[0];
				if (!feature || !feature.properties) {
					console.warn('Feature or feature properties are not defined. Click event ignored.');
					return;
				}
				const popup_content = `
					Popup Title<br>
					CID: QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB<br>
					Row: ${feature.properties.ROW}<br>
					Path ${feature.properties.PATH}<br>
					Date acquired: July 26th, 2023<br>
					Pinned on 5 IPFS nodes<br>
					Stored in 3 Filecoin deals<br>
					2 unsealed copies available<br>
					`;
				new mapboxgl.Popup().setLngLat(coordinates).setHTML(popup_content).addTo(map);
			});
			// Change the cursor to a pointer when the mouse is over the places layer.
			map.on('mouseenter', 'LANDSAT_SCENE_OUTLINES-layer', () => {
				map.getCanvas().style.cursor = 'pointer';
			});

			// Change it back to a pointer when it leaves.
			map.on('mouseleave', 'LANDSAT_SCENE_OUTLINES-layer', () => {
				map.getCanvas().style.cursor = '';
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
