import { useAbsoluteUrl } from '@rocket.chat/ui-contexts';
import { useEffect } from 'react';

import { callDesktopBridge } from '../../../lib/utils/callDesktopBridge';

export const useDesktopFavicon = () => {
	const absoluteUrl = useAbsoluteUrl();
	const faviconUrl = absoluteUrl('/images/yaschat/favicon.svg');

	useEffect(() => {
		callDesktopBridge((desktop) => desktop.setUrlResolver((relativePath?: string) => absoluteUrl(relativePath ?? '/')));
	}, [absoluteUrl]);

	useEffect(() => {
		let faviconLink = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
		if (!faviconLink) {
			faviconLink = document.createElement('link');
			faviconLink.rel = 'icon';
			document.head.appendChild(faviconLink);
		}
		faviconLink.type = 'image/svg+xml';
		faviconLink.href = faviconUrl;
		callDesktopBridge((desktop) => desktop.setFavicon(faviconUrl));
	}, [faviconUrl]);
};
