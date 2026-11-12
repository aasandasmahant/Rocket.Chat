import { render, screen } from '@testing-library/react';

import TaggedRocketChatLogo from './TaggedRocketChatLogo';

it('renders the YasChat brand through the tagged compatibility component', () => {
	render(<TaggedRocketChatLogo />);
	expect(screen.getByRole('img', { name: 'YasChat' })).toBeInstanceOf(SVGSVGElement);
});
