import { render, screen } from '@testing-library/react';

import RocketChatLogo from './RocketChatLogo';

it('renders the YasChat brand through the legacy logo compatibility export', () => {
	render(<RocketChatLogo />);
	expect(screen.getByRole('img', { name: 'YasChat' })).toBeInstanceOf(SVGSVGElement);
});
