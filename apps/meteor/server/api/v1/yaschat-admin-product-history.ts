import { YasChatProducts } from '@rocket.chat/models';
import {
	ajv,
	ajvQuery,
	validateBadRequestErrorResponse,
	validateForbiddenErrorResponse,
	validateUnauthorizedErrorResponse,
} from '@rocket.chat/rest-typings';

import { API } from '../api';

type ProductHistoryQuery = { recordId: string };

const productHistoryQuerySchema = ajvQuery.compile<ProductHistoryQuery>({
	type: 'object',
	properties: {
		recordId: { type: 'string', minLength: 1, maxLength: 160 },
	},
	required: ['recordId'],
	additionalProperties: false,
});

const productHistoryResponseSchema = ajv.compile<{ history: unknown[] }>({
	type: 'object',
	properties: {
		history: { type: 'array', items: { type: 'object', additionalProperties: true } },
		success: { type: 'boolean', enum: [true] },
	},
	required: ['history', 'success'],
	additionalProperties: false,
});

/**
 * Read-only product moderation audit history.
 * Access is restricted to authenticated users granted the dedicated YasChat product-moderation permission.
 */
API.v1.get(
	'yaschat.admin.products.history',
	{
		authRequired: true,
		permissionsRequired: ['yaschat-product-moderation'],
		query: productHistoryQuerySchema,
		rateLimiterOptions: {
			numRequestsAllowed: 30,
			intervalTimeInMS: 60000,
		},
		response: {
			200: productHistoryResponseSchema,
			400: validateBadRequestErrorResponse,
			401: validateUnauthorizedErrorResponse,
			403: validateForbiddenErrorResponse,
		},
	},
	async function action() {
		const { recordId } = this.queryParams;
		const product = await YasChatProducts.findOne(
			{ recordId },
			{ projection: { _id: 0, recordId: 1, moderationHistory: 1 } },
		);

		return API.v1.success({ history: product?.moderationHistory ?? [] });
	},
);
