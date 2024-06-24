<script lang="ts">
	export let showVeda: boolean; // boolean

	let dialog: HTMLDialogElement; // HTMLDialogElement

	$: if (dialog && showVeda) dialog.showModal();

	/* Front matter contents */
	let export_id: string;
	let name: string;
	let description: string;

	let thematics: string[]; // will be blank
	let sources: string[]; // Will be gateway link to CID export
	let featured: boolean;
	let disabledExplore: boolean;
	let sourceExclusive: string;

	let layers: any[];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (showVeda = false)} on:click|self={() => dialog.close()}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />
		<hr />

		<form>
			<input
				type="text"
				placeholder="Dataset ID"
				bind:value={export_id}
				style="width: 100%; margin-bottom: 10px;"
			/>
			<input
				type="text"
				placeholder="Dataset Name"
				bind:value={name}
				style="width: 100%; margin-bottom: 10px;"
			/>
			<textarea
				placeholder="Datset Description"
				bind:value={description}
				style="width: 100%; margin-bottom: 10px;"
			/>
			<div class="checkRow">
				<p>Featured</p>
				<input
					type="checkbox"
					on:change={() => {
						featured = !featured;
					}}
				/>
			</div>
			<div class="checkRow">
				<p>Disabled Explore</p>
				<input
					type="checkbox"
					on:change={() => {
						disabledExplore = !disabledExplore;
					}}
				/>
			</div>
			<input
				type="text"
				placeholder="Source Exclusive"
				bind:value={sourceExclusive}
				style="width: 100%;"
			/>
			<br />
			<button style="margin-top: 5px;" on:click={async () => alert('Exporting...')}>Export</button>
		</form>

		<slot />
		<hr />
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={() => dialog.close()}>Close</button>
	</div>
</dialog>

<style>
	dialog {
		width: 80%;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
	.checkRow {
		display: flex;
	}
</style>
