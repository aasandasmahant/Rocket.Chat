import type { SVGAttributes } from 'react';

import YasChatLogo from '../YasChatLogo';

type RocketChatLogoProps = {
	/** Kept for source compatibility with existing upstream component callers. */
	color?: SVGAttributes<SVGSVGElement>['fill'];
};

/**
 * Compatibility export for existing Rocket.Chat UI imports.
 * YasChat deliberately renders its own fish identity in this fork.
 */
const RocketChatLogo = (_props: RocketChatLogoProps) => <YasChatLogo />;

export default RocketChatLogo;
