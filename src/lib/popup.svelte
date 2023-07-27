<script lang="ts">
	import { onMount } from 'svelte';
	import type { Post } from '../types';

	let post: Post | null = null;

	onMount(async () => {
		const res = await fetch('https://jsonplaceholder.typicode.com/posts/3');
		post = await res.json();
	});
</script>

{#if post}
	<div>
		<h3>{post.title}</h3>
		<p>{post.body}</p>
	</div>
{/if}
