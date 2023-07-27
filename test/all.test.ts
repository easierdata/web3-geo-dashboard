import { render } from '@testing-library/svelte';
import Map from '../src/lib/map.svelte';
import Popup from '../src/lib/popup.svelte';
import UpdateText from '../src/lib/updateText.svelte';
import { test, expect } from 'vitest';

test('map component should render', async () => {
	const { container } = render(Map);
	expect(container.innerHTML).not.toBe('');
});

test('Popup component should render', async () => {
	const { container } = render(Popup);
	expect(container.innerHTML).not.toBe('');
});

// <script lang="ts">
// 	export let text = 'UpdateText Component';

// 	const updateText = () => {
// 		text = 'Updated!';
// 	};
// </script>

// <button on:click={updateText}> Update Text </button>

// <input type="text" bind:value={text} />

test('UpdateText component should render with default text', async () => {
	const { container } = render(UpdateText);
	console.log(container.innerHTML);
	expect(container.innerHTML).toContain('Update Text');
});
