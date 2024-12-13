<script lang="ts">
	export let searchTerm: string;
	export let handleKeyDown;
	export let clearSearch;
</script>

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

<style>
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
