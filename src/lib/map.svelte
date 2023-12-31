<script lang="ts">
	import mapboxgl, { Map } from 'mapbox-gl';
	import { ethers } from 'ethers';
	import { onMount, onDestroy } from 'svelte';
	import type { Web3EnrichedMapboxFeature, metadata, RequestRedirect, RequestInit } from '../types';

	let map: Map;
	async function getPopupMetadata(cid: string): Promise<metadata | undefined> {
		const requestOptions: RequestInit = {
			method: 'GET',
			redirect: 'follow' as RequestRedirect
		};

		try {
			const response = await fetch(
				`https://easier-dashboard-api.vercel.app/api/metadata/${cid}`,
				requestOptions
			);
			if (!response.ok) {
				throw new Error(`Error fetching metadata for CID ${cid}: ${response.statusText}`);
			}
			const data: metadata = await response.json();
			return data;
		} catch (error) {
			console.error(`Failed to fetch metadata for CID ${cid}:`, error);
			return undefined;
		}
	}

	async function createPopupContent(feature: Web3EnrichedMapboxFeature): Promise<HTMLDivElement> {
		const properties = feature.properties;
		console.log(properties);
		const metadata = await getPopupMetadata(properties.cid);
		if (!metadata) {
			console.warn(`No metadata found for CID ${properties.cid}.`);
		}

		const content = document.createElement('div');
		content.innerHTML = `
		<b>Popup Title</b><br>
		<span class="cid-text">CID: ${properties.cid}</span><br>
		Row: ${properties.ROW}<br>
		Path: ${properties.PATH}<br>
		Date acquired: ${new Date(properties.datetime).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}<br>
		Pinned on ${metadata?.ipfs ?? 'N/A'} IPFS nodes<br> <!-- Example of including metadata -->
		Stored in ${metadata?.filecoin ?? 'N/A'} Filecoin deals<br> <!-- Example of including metadata -->
		${metadata?.unsealed ?? 'N/A'} unsealed copies available<br> <!-- Example of including metadata -->
		<button id="button1">Pin to local</button>
		<button id="button2">Download Scene</button>
		<div class="MetamaskContainer">
			<div class="connectedState" style="display: none;">Connected</div>
		</div>
		`;

		const button = document.createElement('button');
		button.textContent = 'Fetch from cold storage';
		button.addEventListener('click', connectWallet);

		content.appendChild(button);

		return content;
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

	function setupLayer() {
		map.addSource('LANDSAT_SCENE_OUTLINES', {
			type: 'vector',
			url: 'mapbox://mnanas2004.brcihxt7'
		});

		map.addLayer({
			id: 'LANDSAT_SCENE_OUTLINES-layer',
			type: 'fill',
			source: 'LANDSAT_SCENE_OUTLINES',
			'source-layer': 'cid_enriched-dxp1cw',
			paint: {
				'fill-color': 'grey',
				'fill-opacity': 0.2,
				'fill-outline-color': 'black'
			}
		});
	}

	async function handleClick(
		e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }
	) {
		const coordinates = e.lngLat;
		if (!e.features || !e.features.length) {
			console.warn('No features found. Click event ignored.');
			return;
		}
		const feature = e.features[0] as Web3EnrichedMapboxFeature;
		if (!feature || !feature.properties) {
			console.warn('Feature or feature properties are not defined. Click event ignored.');
			return;
		}
		const popup_content = await createPopupContent(feature);
		new mapboxgl.Popup().setLngLat(coordinates).setDOMContent(popup_content).addTo(map);
	}

	function handleMouseEnter() {
		map.getCanvas().style.cursor = 'pointer';
	}

	function handleMouseLeave() {
		map.getCanvas().style.cursor = '';
	}
	let searchTerm = '';

	function clearSearch(): void {
		searchTerm = '';
		const inputElement = document.getElementById('searchInput');
		if (inputElement) {
			inputElement.focus();
		}
	}
	function handleKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ' ') {
			clearSearch();
		}
	}

	onMount(async () => {
		if (!import.meta.env.VITE_MAPBOX_TOKEN) {
			throw new Error('MAPBOX_TOKEN is required');
		}
		mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mnanas2004/cllzdp0ir01of01phd51o2x3k',
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

<div class="search-container">
	<i class="fa fa-search search-icon" />
	<input
		id="searchInput"
		type="text"
		bind:value={searchTerm}
		class="search-bar"
		placeholder="Search"
	/>
	<span
		class="clear-button"
		role="button"
		tabindex="0"
		on:click={clearSearch}
		on:keydown={handleKeyDown}>x</span
	>
</div>

<div id="map" />

<style>
	#map {
		margin: 0.15rem;
		width: 100%;
		height: 83%;
	}
	.search-container {
		display: flex;
		align-items: center;
		position: absolute;
		width: 100%;
		top: 8rem;
		left: 3rem;
		z-index: 1;
	}
	.search-bar {
		border-radius: 0.5rem;
		height: 1.7rem;
		width: 26%;
		max-width: 16rem;
		padding-left: 1.9rem;
	}
	.search-icon {
		position: relative;
		left: 1.5rem;
	}

	.clear-button {
		margin-left: -1.2rem;
		margin-top: -0.2rem;
		cursor: pointer;
	}
</style>
