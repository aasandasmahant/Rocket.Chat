import { YasChatProducts } from '@rocket.chat/models';
import { ajv, validateBadRequestErrorResponse } from '@rocket.chat/rest-typings';

import { API } from '../api';

const catalogueQuerySchema = ajv.compile<{
	search?: string;
	category?: string;
	limit?: number;
	offset?: number;
}>({
	type: 'object',
	properties: {
		search: { type: 'string', maxLength: 120 },
		category: { type: 'string', maxLength: 100 },
		limit: { type: 'integer', minimum: 1, maximum: 50 },
		offset: { type: 'integer', minimum: 0, maximum: 10000 },
	},
	additionalProperties: false,
});

const catalogueResponseSchema = ajv.compile<{
	products: unknown[];
}>({
	type: 'object',
	properties: {
		products: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					_id: { type: 'string' },
					product: { type: 'object' },
					createdAt: { type: 'string' },
					updatedAt: { type: 'string' },
				},
				required: ['_id', 'product', 'createdAt', 'updatedAt'],
				additionalProperties: false,
			},
		},
		success: { type: 'boolean', enum: [true] },
	},
	required: ['products', 'success'],
	additionalProperties: false,
});

API.v1.get(
	'yaschat.products',
	{
		authRequired: false,
		query: catalogueQuerySchema,
		rateLimiterOptions: {
			numRequestsAllowed: 30,
			intervalTimeInMS: 60000,
		},
		response: {
			200: catalogueResponseSchema,
			400: validateBadRequestErrorResponse,
		},
	},
	async function action() {
		const { search, category, limit, offset } = this.queryParams;
		const products = await YasChatProducts.findApprovedProducts({ search, category, limit, offset }).toArray();

		return API.v1.success({ products });
	},
);
