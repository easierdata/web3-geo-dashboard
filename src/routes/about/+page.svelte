<section class="container">
	<h1>About</h1>
	<h3>Project Motive</h3>
	<p>
		The purpose of the "Web3 Geospatial Dashboard" is to highlight the use cases of integrating
		decentralized technology into the GIS ecosystem through means of making data more accessible and
		readily explorable. This project was built on IPFS, Filecoin, and
		spatial-temporal-asset-catalogs curated by the <a href="https://www.umd.edu" target="_blank"
			>University of Maryland College Park</a
		>
		in collaboration with the
		<a href="https://ffdweb.org" target="_blank">Filecoin Foundation for the Decentralized Web</a>.
	</p>
	<h3>Project Setup</h3>
	<h5>Configure Node</h5>
	<p>
		Update your IPFS node's configuration to accept requests from your IP and this domain by adding
		the fields to "API"/"HTTPHeaders"/"Accept-Control-Allow-Origin". Alternatively, you can use an
		asterisk for all "*" (not recommended)
	</p>
	<h5>Configure Chrome extension</h5>
	<p>
		Load the EASIER chrome extension by navigating to your Chrome settings, extensions enabling
		"developer mode", and loading the <a
			href="https://github.com/easierdata/web3-geo-extension"
			target="_blank">downloaded repository</a
		> unpacked ("Load unpacked").
	</p>
</section>

<style>
	.container {
		width: 100%;
		margin: 7rem 5rem;
		text-overflow: clip;
	}

	h1 {
		font-size: 3.4rem;
	}
</style>
