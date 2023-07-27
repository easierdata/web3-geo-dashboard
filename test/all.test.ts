import { render } from '@testing-library/svelte';
import Map from '../src/lib/map.svelte';
import Popup from '../src/lib/popup.svelte';
import { test, expect } from 'vitest';

test('map component should throw error without token', async () => {
	let error;
	try {
		render(Map);
	} catch (e) {
		error = e;
	}
	expect(error).toBeDefined();
	expect(error.message).toBe('MAPBOX_TOKEN is required');
});

// <script lang="ts">
// 	import { onMount } from 'svelte';
// 	import type { Post } from '../types';

// 	let post: Post | null = null;

// 	onMount(async () => {
// 		const res = await fetch('https://jsonplaceholder.typicode.com/posts/3');
// 		post = await res.json();
// 	});
// </script>

// {#if post}
// 	<div>
// 		<h3>{post.title}</h3>
// 		<p>{post.body}</p>
// 	</div>
// {/if}

// test('hello', async () => {
// 	const { container } = render(Hello, { props: { count: 2 } });

// 	// Check for the presence of the expected text in the container
// 	expect(container.innerHTML).toContain('2 x 2 = 4');

// 	const button = screen.getByText('x1');
// 	await fireEvent.click(button);

// 	// Check for the updated text in the container
// 	expect(container.innerHTML).toContain('2 x 3 = 6');
// });

test('Popup component should render', async () => {
	const { container } = render(Popup);
	expect(container.innerHTML).not.toBe('');
});
