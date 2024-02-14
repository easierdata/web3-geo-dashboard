<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import mapboxgl, { Map } from 'mapbox-gl';
	import { ethers } from 'ethers';
	import { onMount, onDestroy } from 'svelte';
	import type { Web3EnrichedMapboxFeature, metadata, RequestRedirect, RequestInit } from '../types';
	import Modal from './modal.svelte';
	import Accordion from './accordion.svelte';

	let showModal = false;
	let cid = '';

	let deals: any = {};
	let providers: any = [];

	let canvas: HTMLElement;
	let start: any;
	let current;
	let box: any;
	let selectedFeatures: any[] = [];
	let cidArray: string[] = [];

	let autocomplete: any;

	const options = {
		componentRestrictions: { country: 'us' },
		strictBounds: false
	};

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

		const response = await fetch(
			`https://filecoin.tools/api/deals/list?page=1&per_page=20&selector=${properties.piece}&sort_by_column=status&sort_direction=-1`,
			{
				method: 'GET'
			}
		);

		deals = await response.json();
		/*deals = [];
		console.log(deals);*/

		providers = [];
		const metadata = await getPopupMetadata(properties.cid);
		if (!metadata) {
			console.warn(`No metadata found for CID ${properties.cid}.`);
		}

		providers = metadata?.Providers;

		const content = document.createElement('div');
		content.innerHTML = `
		<b>Inspect Tile</b><br>
		<span class="name-text">Name: ${properties.filename}</span><br>
		<span class="cid-text">Filecoin CID: ${properties.cid}</span><br>
		<span class="ipfs-cid-text">IPFS CID: ${properties.ipfs_cid}</span><br>
		Row: ${properties.ROW}<br>
		Path: ${properties.PATH}<br>
		Date acquired: ${new Date(properties.datetime).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}<br>
		<span class="pins">Pinned on ${
			metadata?.ipfs ?? 'N/A'
		} IPFS nodes</span><br> <!-- Example of including metadata -->
		Stored in ${
			metadata?.Providers.length ?? 'N/A'
		} Filecoin Peers<br> <!-- Example of including metadata -->
		${metadata?.unsealed ?? 'N/A'} unsealed copies available<br> <!-- Example of including metadata -->
		<div class="MetamaskContainer">
			<div class="connectedState" style="display: none;">Connected</div>
		</div>
		`;

		const pinButton = document.createElement('button');
		pinButton.setAttribute('id', 'pinButton');
		pinButton.textContent = 'Pin to local';

		/*const downloadButton = document.createElement('button');
		downloadButton.setAttribute('id', 'downloadButton');
		downloadButton.textContent = 'Download Scene';*/

		const fetchButton = document.createElement('button');
		fetchButton.textContent = 'Fetch from cold storage';
		fetchButton.addEventListener('click', connectWallet);

		const codeButton = document.createElement('button');
		codeButton.textContent = 'More';
		codeButton.addEventListener('click', () => {
			showModal = true;
			cid = properties.ipfs_cid;
		});

		content.appendChild(pinButton);
		// content.appendChild(downloadButton);
		content.appendChild(fetchButton);
		content.appendChild(codeButton);

		return content;
	}

	async function connectWallet(): Promise<void> {
		if (window.ethereum) {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			console.log(signer);

			const tx = await signer.sendTransaction({
				to: '0x92d3267215Ec56542b985473E73C8417403B15ac',
				value: ethers.parseUnits('0.001', 'ether')
			});

			alert(`Sent transaction: ${tx.hash}`);

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
		} else {
			alert('Metamask not detected!');
		}
	}

	function setupLayer() {
		map.addSource('LANDSAT_SCENE_OUTLINES', {
			type: 'vector',
			url: 'mapbox://mnanas2004.alx6bsr0'
		});

		map.addLayer({
			id: 'LANDSAT_SCENE_OUTLINES-layer',
			type: 'fill',
			source: 'LANDSAT_SCENE_OUTLINES',
			'source-layer': 'cid_enriched4-49jvb4',
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
			'source-layer': 'cid_enriched4-49jvb4',
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
				if (feature.properties) {
					const path = feature.properties.PATH;
					const row = feature.properties.ROW;
					feature.properties.PATHROW = `${path}${row}`;
				}
			});

			selectedFeatures = features;
			features.forEach((feature) => {
				if (feature.properties) cidArray.push(feature.properties.ipfs_cid);
			});

			const mergedPathRows = features.map(
				(feature) => `${feature.properties?.PATH}${feature.properties?.ROW}`
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
	async function handleKeyDown(event: KeyboardEvent): Promise<void> {
		if (event.key === 'Enter' || event.key === ' ') {
			await filterByQuery();
		}
	}

	async function filterByQuery() {
		console.log(searchTerm);
		if (searchTerm.toUpperCase().includes('PATH') && searchTerm.toUpperCase().includes('ROW')) {
			let query = searchTerm.split(',');
			let path = null,
				row = null;

			query.forEach((e: string) => {
				if (e.toUpperCase().includes('PATH')) path = searchTerm.toUpperCase().split('PATH=')[1];
				if (e.toUpperCase().includes('ROW')) row = searchTerm.toUpperCase().split('ROW=')[1];
			});

			if (path && row) {
				map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', [
					'all',
					['==', 'PATH', parseInt(path)],
					['==', 'ROW', parseInt(row)]
				]);

				var feat = map.querySourceFeatures('LANDSAT_SCENE_OUTLINES', {
					sourceLayer: 'cid_enriched4-49jvb4',
					filter: ['all', ['==', 'PATH', parseInt(path)], ['==', 'ROW', parseInt(row)]]
				});

				updateInspect(feat);
			}
		} else if (searchTerm.toUpperCase().includes('PATH')) {
			// Render path
			let path = searchTerm.toUpperCase().split('PATH=')[1];
			map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', ['all', ['==', 'PATH', parseInt(path)]]);

			let feat = map.querySourceFeatures('LANDSAT_SCENE_OUTLINES', {
				sourceLayer: 'cid_enriched4-49jvb4',
				filter: ['all', ['==', 'PATH', parseInt(path)]]
			});

			updateInspect(feat);
		} else if (searchTerm.toUpperCase().includes('ROW')) {
			// Render row
			let row = searchTerm.toUpperCase().split('ROW=')[1];
			map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', ['all', ['==', 'ROW', parseInt(row)]]);

			let features = map.querySourceFeatures('LANDSAT_SCENE_OUTLINES', {
				sourceLayer: 'cid_enriched4-49jvb4',
				filter: ['all', ['==', 'ROW', parseInt(row)]]
			});

			updateInspect(features);
		} else if (searchTerm.includes(' ') && searchTerm.length > 3) {
			console.log(searchTerm);

			const response = await fetch(
				`https://easier-dashboard-m5eh5d9da-matthewnanas.vercel.app/api/geocode/${searchTerm}`
			);
			if (!response.ok) {
				throw new Error(`Error fetching geolocation for ${searchTerm}: ${response.statusText}`);
			}
			const data = await response.json();

			map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', [
				'all',
				['==', 'PATH', data.path],
				['==', 'ROW', data.row]
			]);
		} else {
			// Clear filter
			map.setFilter('LANDSAT_SCENE_OUTLINES-highlighted', [
				'all',
				['==', 'PATH', ''],
				['==', 'ROW', '']
			]);
		}
	}

	function updateInspect(features: mapboxgl.MapboxGeoJSONFeature[]) {
		let newFeatures: any[] = [];
		features.forEach((feature) => {
			if (feature.properties && !cidArray.includes(feature.properties.ipfs_cid)) {
				cidArray.push(feature.properties.ipfs_cid);
				newFeatures.push(feature);
			}
		});

		selectedFeatures = newFeatures;
	}

	onMount(async () => {
		const loader = new Loader({
			apiKey: import.meta.env.VITE_GOOGLEAPIKEY,
			version: 'weekly',
			libraries: ['places']
		});

		loader.loadCallback((e) => {
			if (e) {
				console.log(e);
			} else {
				autocomplete = new google.maps.places.Autocomplete( //@ts-ignore
					document.getElementById('searchInput'),
					options
				);
			}

			autocomplete.addListener('place_changed', onPlaceChanged);
		});

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

	function onPlaceChanged() {
		let address = autocomplete.getPlace();
		searchTerm = address.formatted_address;
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="search-container">
	<i class="fa fa-search search-icon" />
	<input
		type="text"
		name="autocomplete"
		id="searchInput"
		class="search-bar"
		autocomplete="off"
		placeholder="Search"
		bind:value={searchTerm}
		on:keydown={async (e) => {
			await handleKeyDown(e);
		}}
	/>
	<span
		class="clear-button"
		role="button"
		tabindex="0"
		on:click={clearSearch}
		on:keydown={async (e) => {
			await handleKeyDown(e);
		}}
	>
		x
	</span>
</div>

<div id="map" />

<Modal bind:showModal>
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

	<br />
	<h2>Download Scene with Kubo CLI</h2>
	<hr />
	<div class="snippet">
		<p>ipfs get {cid}</p>
	</div>

	{#if providers.length > 0}
		<h2>Providers {providers.length}</h2>
		<hr />
		{#each providers as prov}
			<Accordion open={false}>
				<span slot="head">Provider [{prov.Provider.ID}]</span>
				<div slot="details">
					<table>
						<tr class="dealRow">
							<th>Context ID</th>
							<th>{prov.ContextID}</th>
						</tr>
						<tr class="dealRow">
							<th>Address</th>
							<th>{prov.Provider.Addrs[0]}</th>
						</tr>
					</table>
				</div>
			</Accordion>
		{/each}
	{/if}

	{#if deals.Deals && deals.Deals?.length > 0}
		<h2>Deals {deals.Deals?.length}</h2>
		<hr />
		{#each deals.Deals as deal}
			<Accordion open={false}>
				<span slot="head">Deal [{deal.DealID}]</span>
				<div slot="details">
					<table>
						<tr class="dealRow">
							<th>Deal Duration</th>
							<th
								>{new Date(deal.DealInfo.Proposal.StartEpochAsDate).toISOString().substring(0, 10)} -
								{new Date(deal.DealInfo.Proposal.EndEpochAsDate).toISOString().substring(0, 10)}</th
							>
						</tr>
						<tr class="dealRow">
							<th>Storage Price Per Epoch</th>
							<th>{deal.DealInfo.Proposal.StoragePricePerEpoch}</th>
						</tr>
						<tr class="dealRow">
							<th>Provider Collateral</th>
							<th>{deal.DealInfo.Proposal.ProviderCollateral}</th>
						</tr>
						<tr class="dealRow">
							<th>Last Updated Epoch</th>
							<th>{deal.DealInfo.State.LastUpdatedEpoch}</th>
						</tr>
						<tr class="dealRow">
							<th>Piece CID</th>
							<th>{deal.DealInfo.Proposal.PieceCID['/']}</th>
						</tr>
						<tr class="dealRow">
							<th>Verified Deal?</th>
							<th>{deal.DealInfo.Proposal.VerifiedDeal}</th>
						</tr>
						<tr class="dealRow">
							<th>Client</th>
							<th>{deal.DealInfo.Proposal.Client}</th>
						</tr>
					</table>
				</div>
			</Accordion>
		{/each}
	{/if}
</Modal>

{#if selectedFeatures.length > 0}
	<div id="side-container">
		<Accordion open={false}>
			<span slot="head">Number of selected features: {selectedFeatures.length}</span>
			<div slot="details">
				{#each selectedFeatures.sort( (a, b) => a.properties.datetime.localeCompare(b.properties.datetime) ) as feature}
					<p id="cid-list">
						<a
							href={`http://easier.umd.edu/browse/collections/landsat-c2l1/items/${feature.properties.filename.slice(
								0,
								-8
							)}`}
							target="_blank"
						>
							{feature.properties.filename}
						</a>
					</p>
					<div>
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img
							src={`https://landsatlook.usgs.gov/gen-browse?size=rrb&type=refl&product_id=${feature.properties.filename.slice(
								0,
								-8
							)}`}
							alt="Reflective Landsat Image"
							style="max-width: 50%"
						/>
					</div>
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
		<h5>Interface</h5>
		<div>
			<button on:click={connectWallet}>Fetch From Cold Storage</button>
			<button id="multiPin">Multi Pin</button>
			<p id="cidArray" class="hidden">{JSON.stringify(cidArray)}</p>
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

	.hidden {
		display: none;
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
	.snippet {
		background-color: #f5f5f5;
		color: #1d1d1d;
		border: solid;
		border-color: #e0e0e0;
		border-radius: 5px;
		padding-left: 2px;
	}

	.dealRow {
		border-bottom: 1px solid #ddd;
		text-align: left;
	}

	.dealRow th {
		padding-left: 15px;
	}
</style>
