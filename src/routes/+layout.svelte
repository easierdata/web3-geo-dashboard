<script lang="ts">
	import '../global.css';
</script>

<header>
	<img src="easierLogo.png" alt="easier logo" />
	<div class="header-txt">
		<a href="/">Home</a>
		<a href="/about">About Us</a>
		<a href="/contact">Contact</a>
	</div>
</header>

<main>
	<slot />
</main>

<footer>
	<div class="footer-logo">
		<a href="https://twitter.com/easierdataorg" target="_blank"
			><i class="fab fa-twitter fa-2x" /></a
		>
		<a href="https://www.youtube.com/@easierdataorg" target="_blank"
			><i class="fab fa-youtube fa-2x" /></a
		>
		<a href="https://github.com/easierdata" target="_blank"><i class="fab fa-github fa-2x" /></a>
	</div>
	<div class="footer-icon">
		<p>powered by</p>
		<img src="ipfs.png" alt="IPFS logo" />
	</div>
</footer>
