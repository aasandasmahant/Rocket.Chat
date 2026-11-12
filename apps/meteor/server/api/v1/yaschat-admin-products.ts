import { YasChatProducts } from '@rocket.chat/models';
import { ajv, ajvQuery, validateBadRequestErrorResponse, validateForbiddenErrorResponse, validateUnauthorizedErrorResponse } from '@rocket.chat/rest-typings';

import { API } from '../api';

type AdminProductQueueQuery = {
	status?: 'pending-review' | 'rejected' | 'approved' | 'draft' | 'archived';
	limit?: number;
};

const adminProductQueueQuerySchema = ajvQuery.compile<AdminProductQueueQuery>({
	type: 'object',
	properties: {
		status: { type: 'string', enum: ['pending-review', 'rejected', 'approved', 'draft', 'archived'] },
		limit: { type: 'integer', minimum: 1, maximum: 100 },
	},
	additionalProperties: false,
});

const adminProductQueueResponseSchema = ajv.compile<{ products: unknown[] }>({
	type: 'object',
	properties: {
		products: { type: 'array', items: { type: 'object', additionalProperties: true } },
		success: { type: 'boolean', enum: [true] },
	},
	required: ['products', 'success'],
	additionalProperties: false,
});

/**
 * Read-only moderation queue. Queue access is restricted by the dedicated
 * YasChat product-moderation permission; review mutations are handled by the
 * separately protected atomic approve/reject endpoints.
 */
API.v1.get(
	'yaschat.admin.products',
	{
		authRequired: true,
		permissionsRequired: ['yaschat-product-moderation'],
		query: adminProductQueueQuerySchema,
		rateLimiterOptions: {
			numRequestsAllowed: 60,
			intervalTimeInMS: 60000,
		},
		response: {
			200: adminProductQueueResponseSchema,
			400: validateBadRequestErrorResponse,
			401: validateUnauthorizedErrorResponse,
			403: validateForbiddenErrorResponse,
		},
	},
	async function action() {
		const { status = 'pending-review', limit = 50 } = this.queryParams;
		const products = await YasChatProducts.findByModerationStatus(status, limit).toArray();

		return API.v1.success({ products });
	},
);
