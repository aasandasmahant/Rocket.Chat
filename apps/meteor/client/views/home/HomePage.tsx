import { useSetting } from '@rocket.chat/ui-contexts';

import CustomHomePage from './CustomHomePage';
import DefaultHomePage from './DefaultHomePage';
import YasChatHomePage from './YasChatHomePage';

const HomePage = () => {
	const customOnly = useSetting('Layout_Custom_Body_Only');
	const siteName = useSetting('Site_Name', '');

	if (customOnly) {
		return <CustomHomePage />;
	}

	if (siteName.trim().toLowerCase() === 'yaschat') {
		return <YasChatHomePage />;
	}

	return <DefaultHomePage />;
};

export default HomePage;
