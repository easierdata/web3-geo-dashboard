<script lang="ts">
	import Accordion from '../accordion.svelte';
	import LayerAccordion from '../layer_accordion.svelte';

	export let stac_api_layers;
	export let selectedFeatures: any[];
	export let stac_endpoint;
	export let cidArray;
	export let exportfeatures;
	export let connectWallet;
	export let toggleAsset;
	export let handle_delete;
	export let showVeda: boolean;
</script>

<div id="side-container">
	{#if stac_api_layers.length > 0}
		<h3>STAC API Layers</h3>
		{#each stac_api_layers as endpoint}
			<LayerAccordion open={false} {handle_delete} bind:endpoint={endpoint.url}>
				<span slot="head">{endpoint.url.match(/:\/\/(.[^/]+)/)[1]}</span>
				<div slot="details">
					<table style="border-collapse: collapse;">
						<thead>
							<tr>
								<th />
								<th class="table">ID</th>
								<th class="table">Title</th>
								<th class="table">Render Asset</th>
							</tr>
						</thead>
						<tbody>
							<!-- Add dynamic content here based on the endpoint value -->
							{#each endpoint.collections as collection}
								<tr>
									<td class="table">
										<input
											type="checkbox"
											id="{endpoint.url}-collection1"
											on:change={(e) => toggleAsset(e, collection, collection.selected_asset)}
										/>
									</td>
									<td class="table">{collection.id}</td>
									<td class="table">{collection.title}</td>
									<td class="table">
										<select id={collection.id} bind:value={collection.selected_asset}>
											{#if collection.features[0]}
												{#each Object.keys(collection.features[0].assets) as asset}
													<option value={asset}>{asset}</option>
												{/each}
											{:else}
												<option value="">N/A</option>
											{/if}
										</select>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</LayerAccordion>
		{/each}
		<hr style="margin-bottom: 30px;" />
	{/if}
	{#if selectedFeatures.length > 1}
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
				my_client = client.Web3(stac_endpoint="{stac_endpoint}", local_gateway="127.0.0.1")
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
			<button id="export">Export</button>
			<button
				on:click={() => {
					showVeda = true;
				}}>Export to Veda Frontmatter</button
			>
			<p id="cidArray" class="hidden">{JSON.stringify(cidArray)}</p>
			<p id="exportFeatures" class="hidden">{JSON.stringify(exportfeatures)}</p>
		</div>
	{/if}
</div>

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

	.table {
		border: 1px solid black;
		padding: 2px;
	}
</style>
