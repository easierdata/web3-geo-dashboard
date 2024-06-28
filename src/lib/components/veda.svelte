<script lang="ts">
	export let showVeda: boolean; // boolean

	let dialog: HTMLDialogElement; // HTMLDialogElement

	$: if (dialog && showVeda) dialog.showModal();

	/* Front matter contents */
	let export_id: string;
	let name: string;
	let description: string;

	let featured: boolean;
	let disabledExplore: boolean;
	let sourceExclusive: string;
	let geojson_endpoint: string;

	const createExportContent = (): void => {
		const mdx = `
---
id: ${export_id}
name: '${name}'
description: "${description}"
media:
  alt: ${name}
  author:
    name: EASIER
    url: http://easierdata.org
layers:
  - id: ${export_id}
    type: geojson
    tileApiEndpoint: '${geojson_endpoint}'
    name: ${name}
    description: "${description}"
---

<Block>
<Prose>
# Description
${description}
</Prose>
</Block>
		`;
		console.log(mdx);

		// Hacky way of downloading
		const blob = new Blob([mdx], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const hidden = document.createElement('a');
		hidden.href = url;
		hidden.download = `${name}.mdx`;
		document.body.appendChild(hidden);
		hidden.click();
		document.body.removeChild(hidden);
		URL.revokeObjectURL(url);

		alert('Exporting...');
	};
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
			<input
				type="text"
				placeholder="Geojson Endpoint"
				bind:value={geojson_endpoint}
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
			<button style="margin-top: 5px;" on:click={async () => createExportContent()}>Export</button>
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
