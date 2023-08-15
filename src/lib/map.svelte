<script lang="ts">
	import mapboxgl, { Map } from 'mapbox-gl';
	import { ethers } from 'ethers';
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
		<div class="MetamaskContainer">
			<button class="connectButton">Fetch from cold storage</button>
			<div class="connectedState" style="display: none;">Connected</div>
		</div>
		`;
	}

	async function connectWallet(): Promise<void> {
		if (window.ethereum) {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();

			// Add logic here to interact with the contract or perform other actions
			// const provider = new ethers.BrowserProvider(window.ethereum);

			const connectButton = document.querySelector(
				'.MetamaskContainer .connectButton'
			) as HTMLButtonElement;
			const connectedState = document.querySelector(
				'.MetamaskContainer .connectedState'
			) as HTMLDivElement;

			if (connectButton) {
				connectButton.style.display = 'none';
			}

			if (connectedState) {
				connectedState.style.display = 'block';
			}

			const connectedAccount = await signer.getAddress();
			console.log(connectedAccount);
		} else {
			alert('Metamask not detected!');
		}
	}

	// async function fetchFromColdStorage() {
	// 	if (window.ethereum) {
	// 		return;
	// 		// Add logic here to interact with the contract or perform other actions
	// 		// const provider = new ethers.BrowserProvider(window.ethereum);
	// 		//await window.ethereum.request({ method: 'eth_requestAccounts' });
	// 		// const signer = await provider.getSigner();
	// 		// const connectedAccount = await signer.getAddress();
	// 	} else {
	// 		alert('Metamask not detected!');
	// 	}
	// }

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
		if (!e.features || !e.features.length) return;
		const feature = e.features[0];
		if (!feature || !feature.properties) return;
		const popup_content = createPopupContent(feature);
		new mapboxgl.Popup().setLngLat(coordinates).setHTML(popup_content).addTo(map);
		// This feels hacky, but it works. The problem is that the popup content
		// is not part of the DOM until the popup is opened, so we can't attach
		// event listeners to the buttons until the popup is opened. So we wait
		// for the next tick of the event loop, then attach the event listeners.
		setTimeout(() => {
			const connectButton = document.querySelector(
				'.MetamaskContainer .connectButton'
			) as HTMLButtonElement;
			if (connectButton) {
				connectButton.addEventListener('click', connectWallet);
			}
		});
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
			map.on('click', 'LANDSAT_SCENE_OUTLINES-layer', handleClick as any);
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

<div id="map" style="width: 800px; height: 600px;" />
