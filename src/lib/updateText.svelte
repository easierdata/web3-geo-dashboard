<script lang="ts">
	export let text: string = 'UpdateText Component';

	const updateText = () => {
		text = 'Updated!';
	};
</script>

<button on:click={updateText}> Update Text </button>

<input type="text" bind:value={text} />
