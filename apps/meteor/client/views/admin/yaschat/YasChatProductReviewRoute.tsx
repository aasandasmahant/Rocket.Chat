import { usePermission } from '@rocket.chat/ui-contexts';

import YasChatProductReviewPage from './YasChatProductReviewPage';
import NotAuthorizedPage from '../../notAuthorized/NotAuthorizedPage';

const YasChatProductReviewRoute = () => {
	const canReviewProducts = usePermission('yaschat-product-moderation');

	if (!canReviewProducts) {
		return <NotAuthorizedPage />;
	}

	return <YasChatProductReviewPage />;
};

export default YasChatProductReviewRoute;
