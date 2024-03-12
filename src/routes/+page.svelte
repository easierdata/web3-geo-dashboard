<!-- <script lang="ts">
	import Map from '../lib/map.svelte';
</script> -->

<!-- <Map /> -->

<script>
	let stac_endpoint = '';
	let geojson_endpoint = '';

	function handleSubmit() {
		window.location.href = `/map?stac=${stac_endpoint}&geojson=${geojson_endpoint}`;
	}
</script>

<div class="window">
	<div class="container">
		<form on:submit|preventDefault={handleSubmit}>
			<input type="text" placeholder="STAC API URL" class="url-input" bind:value={stac_endpoint} />
			<input
				type="text"
				placeholder="GeoJSON URL"
				class="url-input"
				bind:value={geojson_endpoint}
			/>
			<button style="margin-top: 5px;">Load Map</button>
		</form>
		<p>*Leave blank for demo*</p>
	</div>
</div>

<style>
	.window {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100%;
	}

	.container {
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		width: 320px;
		text-align: center;
	}
	.container p {
		font-weight: bold;
		font-size: 12px;
	}

	.url-input {
		margin-top: 5px;
		width: 90%;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
