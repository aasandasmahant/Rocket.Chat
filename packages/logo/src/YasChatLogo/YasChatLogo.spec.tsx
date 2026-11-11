import { render, screen } from '@testing-library/react';

import YasChatLogo from './YasChatLogo';

it('renders the accessible YasChat logo', () => {
	render(<YasChatLogo />);
	expect(screen.getByRole('img', { name: 'YasChat' })).toBeInstanceOf(SVGSVGElement);
});
