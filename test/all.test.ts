import { render } from '@testing-library/svelte';
import Map from '../src/lib/map.svelte';
import { test, expect } from 'vitest';

test('map component should render', async () => {
	const { container } = render(Map);
	expect(container.innerHTML).not.toBe('');
});
