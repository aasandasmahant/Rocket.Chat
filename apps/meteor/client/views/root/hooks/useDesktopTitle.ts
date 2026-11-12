import { useSetting } from '@rocket.chat/ui-contexts';
import { useEffect } from 'react';

import { callDesktopBridge } from '../../../lib/utils/callDesktopBridge';

export const useDesktopTitle = () => {
	const title = useSetting('Site_Name', 'YasChat');

	useEffect(() => {
		if (!title) return;
		callDesktopBridge((desktop) => desktop.setTitle(title));
	}, [title]);
};
