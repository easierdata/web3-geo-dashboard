<script lang="ts">
	import { ethers } from 'ethers'
	export let title = 'Title According to Layout Component';
	import '../global.css';
	import { onMount } from 'svelte';

	let provider: ethers.BrowserProvider;
	let connectedAccount = "";
	onMount(() => {
		provider = new ethers.BrowserProvider(window.ethereum)
	})

	async function connectWallet() {
		if (window.ethereum) {
			await window.ethereum.request({ method: 'eth_requestAccounts' })
			const signer = await provider.getSigner();
			connectedAccount = await signer.getAddress();
		} else {
			alert('Metamask not detected!');
		}
	}
</script>

<header>
	<h1>{title}</h1>
	<div class="MetamaskContainer">
		<button on:click={connectWallet} class="ConnectButton">Connect wallet</button>
		{#if connectedAccount != ""}
			<div>Connected</div>
		{/if}
	</div>
</header>

<main>
	<slot />
</main>
<footer>
	<a href="/basic_component_example">Basic Component Example</a>
	<a href="/prop_example">Prop Example</a>
	<img src="/easierLogo.png" alt="Easier logo" width="auto" height="100" />
</footer>

<style>
	.MetamaskContainer {
		position: absolute;
		right: 0;
		margin-right: 20px;
		margin-top: -50px;
		float: right;
	}
</style>