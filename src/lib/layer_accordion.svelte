<script>
	export let open = false;
	export let endpoint;
	export let handle_delete;
	import { slide } from 'svelte/transition';
	const handleClick = () => (open = !open);
</script>

<div class="layer_accordion">
	<div class="header">
		<div class="text">
			<slot name="head" class="head" />
		</div>

		<button on:click={handleClick}> + </button>
		<button on:click={() => handle_delete(endpoint)}> - </button>
	</div>

	{#if open}
		<div class="details" transition:slide>
			<slot name="details" />
		</div>
	{/if}
</div>

<style>
	div.layer_accordion {
		margin: 1rem 0;
	}

	div.header {
		display: flex;
		width: 100%;
	}

	div.header .text {
		flex: 1;
		margin-right: 5px;
	}

	div.details {
		background-color: #cecece;
		padding: 1rem;
	}
</style>
