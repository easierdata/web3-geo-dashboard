import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Hello from '../../src/lib/hello.svelte';

test('hello', async () => {
	const { container } = render(Hello, { props: { count: 2 } });

	// Check for the presence of the expected text in the container
	expect(container.innerHTML).toContain('2 x 2 = 4');

	const button = screen.getByText('x1');
	await fireEvent.click(button);

	// Check for the updated text in the container
	expect(container.innerHTML).toContain('2 x 3 = 6');
});
