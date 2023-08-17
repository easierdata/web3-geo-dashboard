<section class="container">
	<h1 class="contact-text">Contact</h1>
	<input type="text" placeholder="name *" />
	<input type="email" name="" placeholder="email address *" />
	<textarea rows="10" placeholder="Message *" />
	<button type="submit">Submit</button>
</section>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		padding: 5rem 0 0 9rem;
		height: 100vh;
		width: 40%;
	}
	section h1 {
		font-size: 3.3rem;
	}
	input {
		padding-left: 1rem;
		height: calc(2.4em + 1.2rem + 2px);
		border-radius: 0.2rem;
		background-clip: padding-box;
		transition: border-color 0.15s ease-in-out;
	}
	textarea {
		padding-left: 1rem;
		padding-top: 1rem;
		font-family: 'Open Sans', sans-serif;
	}
	button {
		width: 20%;
		background-color: black;
		border-radius: 0;
		height: 2.4rem;
	}

	@media only screen and (max-width: 800px) {
		.container {
			padding: 2rem;
		}
		section h1 {
			font-size: 1.5rem;
		}
		button {
			width: 30%;
			height: 2rem;
		}
	}
</style>
