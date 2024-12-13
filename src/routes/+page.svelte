<script>
	let stac_endpoint = '';
	let geojson_endpoint = '';

	function handleSubmit() {
		window.sessionStorage.setItem('stac', stac_endpoint);
		window.sessionStorage.setItem('geojson', geojson_endpoint);
		window.location.href = '/map';
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
			<button style="margin-top: 5px;" on:click={handleSubmit}>Load Map</button>
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
