<script lang="ts">
	import { onMount } from 'svelte';
  
	let post: {id: number, title: string, body: string} = {
	  id: 0,
	  title: '',
	  body: ''
	};
  
	onMount(async () => {
	  const res = await fetch('https://jsonplaceholder.typicode.com/posts/3');
	  post = await res.json();
	});
  </script>
  
  <div>
	<h3>{post.title}</h3>
	<p>{post.body}</p>
  </div>