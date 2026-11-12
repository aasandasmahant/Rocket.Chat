import { useAbsoluteUrl } from '@rocket.chat/ui-contexts';
import { useEffect } from 'react';

import { callDesktopBridge } from '../../../lib/utils/callDesktopBridge';

export const useDesktopFavicon = () => {
	const absoluteUrl = useAbsoluteUrl();

	useEffect(() => {
		callDesktopBridge((desktop) => desktop.setUrlResolver((relativePath?: string) => absoluteUrl(relativePath ?? '/')));
	}, [absoluteUrl]);

	useEffect(() => {
		callDesktopBridge((desktop) => desktop.setFavicon(absoluteUrl('/images/yaschat/icon.svg')));
	}, [absoluteUrl]);
};
