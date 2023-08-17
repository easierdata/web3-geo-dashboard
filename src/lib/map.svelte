<script lang="ts">
	import mapboxgl, { Map } from 'mapbox-gl';
	import { onMount, onDestroy } from 'svelte';
	import type { Web3EnrichedMapboxFeature } from '../types';

	let map: Map;

	function createPopupContent(feature: Web3EnrichedMapboxFeature): string {
		const properties = feature.properties;
		return `
		<b>Popup Title</b><br>
		<span class="cid-text">CID: QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB</span><br>
		Row: ${properties.ROW}<br>
		Path ${properties.PATH}<br>
		Date acquired: July 26th, 2023<br>
		Pinned on 5 IPFS nodes<br>
		Stored in 3 Filecoin deals<br>
		Available on S3: Yes ✅<br>
		2 unsealed copies available<br>
		<button id="button1">Pin to local</button>
		<button id="button2">Download Scene</button>
		<button id="button3">Fetch from cold storage</button>
		`;
	}

	function setupLayer() {
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
	}

	function handleClick(e: mapboxgl.MapMouseEvent & { features?: Web3EnrichedMapboxFeature[] }) {
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
		const popup_content = createPopupContent(feature);
		new mapboxgl.Popup().setLngLat(coordinates).setHTML(popup_content).addTo(map);
	}

	function handleMouseEnter() {
		map.getCanvas().style.cursor = 'pointer';
	}

	function handleMouseLeave() {
		map.getCanvas().style.cursor = '';
	}

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

		map.on('load', () => {
			setupLayer();
			map.on('click', 'LANDSAT_SCENE_OUTLINES-layer', handleClick);
			map.on('mouseenter', 'LANDSAT_SCENE_OUTLINES-layer', handleMouseEnter);
			map.on('mouseleave', 'LANDSAT_SCENE_OUTLINES-layer', handleMouseLeave);
		});
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div id="map" />

<style>
	#map {
		width: 800px;
		height: 600px;
	}
</style>
