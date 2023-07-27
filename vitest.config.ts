import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['lcov', 'text', 'html']
		},
		environment: 'jsdom'
	}
});
