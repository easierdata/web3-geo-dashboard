<script lang="ts">
	import mapboxgl, { Map } from 'mapbox-gl';
	import { ethers } from 'ethers';
	import { onMount, onDestroy } from 'svelte';
	import type { Web3EnrichedMapboxFeature, metadata, RequestRedirect, RequestInit } from '../types';
	import Modal from './modal.svelte';
	import Accordion from './accordion.svelte';

	let showModal = false;
	let cid = '';

	let canvas: HTMLElement;
	let start: any;
	let current;
	let box: any;
	let selectedFeatures: any[] = [];
	let cidArray: string[] = [];

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
		<b>Inspect Tile</b><br>
		<span class="cid-text">Filecoin CID: ${properties.cid}</span><br>
		<span class="cid-text">IPFS CID: ${properties.ipfs_cid}</span><br>
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
		<div class="MetamaskContainer">
			<div class="connectedState" style="display: none;">Connected</div>
		</div>
		`;

		const pinButton = document.createElement('button');
		pinButton.setAttribute('id', 'pinButton');
		pinButton.textContent = 'Pin to local';

		const downloadButton = document.createElement('button');
		downloadButton.textContent = 'Download Scene';
		downloadButton.addEventListener('click', () => alert(properties.cid)); // Send req to download ep of kubo (might have to use extension)

		const fetchButton = document.createElement('button');
		fetchButton.textContent = 'Fetch from cold storage';
		fetchButton.addEventListener('click', connectWallet);

		const codeButton = document.createElement('button');
		codeButton.textContent = 'Code';
		codeButton.addEventListener('click', () => {
			showModal = true;
			cid = properties.cid;
		});

		content.appendChild(pinButton);
		content.appendChild(downloadButton);
		content.appendChild(fetchButton);
		content.appendChild(codeButton);

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
			url: 'mapbox://mnanas2004.97gi5ppc'
		});

		map.addLayer({
			id: 'LANDSAT_SCENE_OUTLINES-layer',
			type: 'fill',
			source: 'LANDSAT_SCENE_OUTLINES',
			'source-layer': 'cid_enriched-a7c996',
			paint: {
				'fill-color': 'grey',
				'fill-opacity': 0.2,
				'fill-outline-color': 'black'
			}
		});

		map.addLayer({
			id: 'LANDSAT_SCENE_OUTLINES-highlighted',
			type: 'fill',
			source: 'LANDSAT_SCENE_OUTLINES',
			'source-layer': 'cid_enriched-a7c996',
			paint: {
				'fill-outline-color': 'black',
				'fill-color': '#484896',
				'fill-opacity': 0.75
			},
			filter: ['all', ['==', 'PATH', ''], ['==', 'ROW', '']]
		});
	}

	function mouseDown(e: any) {
		// Break if shift is released
		if (!(e.shiftKey && e.button === 0)) return;
		map.dragPan.disable();

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('keydown', onKeyDown);

		start = mousePos(e);
	}

	function onKeyDown(e: any) {
		if (e.keyCode === 27) finish(e);
	}

	function mousePos(e: any) {
		const rect = canvas.getBoundingClientRect();
		return new mapboxgl.Point(
			e.clientX - rect.left - canvas.clientLeft,
			e.clientY - rect.top - canvas.clientTop
		);
	}

	function onMouseMove(e: any) {
		current = mousePos(e);

		if (!box) {
			box = document.createElement('div');
			box.classList.add('boxdraw');
			canvas.appendChild(box);
		}

		const minX = Math.min(start.x, current.x),
			maxX = Math.max(start.x, current.x),
			minY = Math.min(start.y, current.y),
			maxY = Math.max(start.y, current.y);

		const pos = `translate(${minX}px, ${minY}px)`;
		box.style.transform = pos;
		box.style.width = maxX - minX + 'px';
		box.style.height = maxY - minY + 'px';
	}

	function onMouseUp(e: any) {
		finish([start, mousePos(e)]);
	}

	function finish(bbox: any) {
		console.log(bbox);
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('keydown', onKeyDown);
		document.removeEventListener('mouseup', onMouseUp);

		if (box) {
			box.parentNode.removeChild(box);
			box = null;
		}

		if (bbox) {
			const features = map.queryRenderedFeatures(bbox, {
				layers: ['LANDSAT_SCENE_OUTLINES-layer']
			});

			features.forEach((feature) => {
				// @ts-ignore
				const path = feature.properties.PATH; //@ts-ignore
				const row = feature.properties.ROW;
				// @ts-ignore
				feature.properties.PATHROW = `${path}${row}`;
			});

			console.log(features);
			selectedFeatures = features;
			features.forEach((feature) => {
				if (feature.properties) cidArray.push(feature.properties.cid);
			});

			// @ts-ignore
			const mergedPathRows = features.map(
				(feature) => `${feature.properties.PATH}${feature.properties.ROW}`
			);

			map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', [
				'in',
				['concat', ['get', 'PATH'], ['get', 'ROW']],
				['literal', mergedPathRows]
			]);
		}

		map.dragPan.enable();
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

		map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', [
			'all',
			['==', 'PATH', feature.properties.PATH],
			['==', 'ROW', feature.properties.ROW]
		]);

		const popup_content = await createPopupContent(feature);
		const popup = new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setDOMContent(popup_content)
			.addTo(map);

		popup.on('close', function () {
			map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', [
				'all',
				['==', 'PATH', ''],
				['==', 'ROW', '']
			]);
		});
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
		// @ts-ignore
		if (!import.meta.env.VITE_MAPBOX_TOKEN) {
			throw new Error('MAPBOX_TOKEN is required');
		}
		// @ts-ignore
		mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mnanas2004/cllzdp0ir01of01phd51o2x3k',
			center: [-98.5795, 39.8283],
			zoom: 3
		});

		map.on('load', () => {
			canvas = map.getCanvasContainer();

			setupLayer();
			map.on('click', 'LANDSAT_SCENE_OUTLINES-layer', (e) => handleClick(e) as any);
			map.on('mouseenter', 'LANDSAT_SCENE_OUTLINES-layer', handleMouseEnter);
			map.on('mouseleave', 'LANDSAT_SCENE_OUTLINES-layer', handleMouseLeave);

			// Multi select controls
			canvas.addEventListener('mousedown', mouseDown, true);
			map.getCanvas().addEventListener('keydown', (e) => {
				e.preventDefault();
				if (e.key == 'Escape') {
					map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', [
						'all',
						['==', 'PATH', ''],
						['==', 'ROW', '']
					]);

					selectedFeatures = [];
					cidArray = [];
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

<Modal bind:showModal bind:cid>
	<h2 slot="header">Python Integration</h2>

	<div>
		<h3>Import ipfs-stac client</h3>
		<div class="snippet">
			<p>from ipfs_stac import client</p>
		</div>
		<br />
		<h3>Connect to STAC server and fetch CID</h3>
		<div class="snippet">
			<p>
				my_client =
				client.Web3(stac_endpoint="http://ec2-54-172-212-55.compute-1.amazonaws.com/api/v1/pgstac/",
				local_gateway="127.0.0.1")
				<br />
				data = my_client.getFromCID("{cid}")
			</p>
		</div>
	</div>

	<br />

	<a href="https://pypi.org/project/ipfs-stac/" target="_blank">Get ipfs-stac</a>
</Modal>

{#if selectedFeatures.length > 0}
	<div id="side-container">
		<Accordion open={false}>
			<span slot="head">Number of selected features: {selectedFeatures.length}</span>
			<div slot="details">
				{#each selectedFeatures as feature}
					<p id="cid-list">{feature.properties.cid}</p>
				{/each}
			</div>
		</Accordion>
		<h4>Code</h4>
		<h5>
			Import <a href="https://pypi.org/project/ipfs-stac/" target="_blank">ipfs-stac</a> client
		</h5>
		<div class="side-snippet">
			<p>from ipfs_stac import client</p>
		</div>
		<h5>Connect to STAC server and fetch CIDs</h5>
		<div class="side-snippet">
			<p>
				my_client =
				client.Web3(stac_endpoint="http://ec2-54-172-212-55.compute-1.amazonaws.com/api/v1/pgstac/",
				local_gateway="127.0.0.1")
				<br />
				<br />
				assets = [] <br />
				cidArray = {JSON.stringify(cidArray)}
				<br />
				<br />
				for x in cidArray: <br />
				&emsp; data = my_client.getFromCID(x) <br />
				&emsp; assets.append(data)
			</p>
		</div>
	</div>
{/if}

<style>
	#map {
		margin: 0.15rem;
		width: 100%;
		height: 83%;
	}
	#side-container {
		background-color: #f5f5f5;
		text-align: center;
		width: 50%;
		word-wrap: break-word;
		overflow: auto;
		z-index: 2;
	}

	#cid-list {
		font-size: 10px;
	}

	.side-snippet {
		background-color: #d2d2d2;
		color: #1d1d1d;
		border: solid;
		border-color: #e0e0e0;
		border-radius: 5px;
		margin-left: 5px;
		margin-right: 5px;
		font-size: 10px;
		text-align: left !important;
		padding-left: 5px;
	}
	.search-container {
		display: flex;
		align-items: center;
		position: absolute;
		width: 80%;
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
	.snippet {
		background-color: #f5f5f5;
		color: #1d1d1d;
		border: solid;
		border-color: #e0e0e0;
		border-radius: 5px;
		padding-left: 2px;
	}
</style>
