import { YasChatProducts } from '@rocket.chat/models';
import {
	ajv,
	validateBadRequestErrorResponse,
	validateForbiddenErrorResponse,
	validateUnauthorizedErrorResponse,
} from '@rocket.chat/rest-typings';

import { API } from '../api';

type ProductReviewBody = {
	recordId: string;
	expectedVersion: number;
	reason?: string;
};

const approveBodySchema = ajv.compile<ProductReviewBody>({
	type: 'object',
	properties: {
		recordId: { type: 'string', minLength: 1, maxLength: 160 },
		expectedVersion: { type: 'integer', minimum: 1 },
	},
	required: ['recordId', 'expectedVersion'],
	additionalProperties: false,
});

const rejectBodySchema = ajv.compile<ProductReviewBody>({
	type: 'object',
	properties: {
		recordId: { type: 'string', minLength: 1, maxLength: 160 },
		expectedVersion: { type: 'integer', minimum: 1 },
		reason: { type: 'string', minLength: 1, maxLength: 1000 },
	},
	required: ['recordId', 'expectedVersion', 'reason'],
	additionalProperties: false,
});

const reviewResponseSchema = ajv.compile<{ reviewed: boolean }>({
	type: 'object',
	properties: {
		reviewed: { type: 'boolean' },
		success: { type: 'boolean', enum: [true] },
	},
	required: ['reviewed', 'success'],
	additionalProperties: false,
});

const rateLimiterOptions = {
	numRequestsAllowed: 30,
	intervalTimeInMS: 60000,
};

API.v1.post(
	'yaschat.admin.products.approve',
	{
		authRequired: true,
		permissionsRequired: ['access-permissions'],
		body: approveBodySchema,
		rateLimiterOptions,
		response: {
			200: reviewResponseSchema,
			400: validateBadRequestErrorResponse,
			401: validateUnauthorizedErrorResponse,
			403: validateForbiddenErrorResponse,
		},
	},
	async function action() {
		const { recordId, expectedVersion } = this.bodyParams;
		const reviewed = await YasChatProducts.reviewPendingProduct(
			recordId,
			expectedVersion,
			this.userId,
			'approved',
			new Date().toISOString(),
		);

		return API.v1.success({ reviewed });
	},
);

API.v1.post(
	'yaschat.admin.products.reject',
	{
		authRequired: true,
		permissionsRequired: ['access-permissions'],
		body: rejectBodySchema,
		rateLimiterOptions,
		response: {
			200: reviewResponseSchema,
			400: validateBadRequestErrorResponse,
			401: validateUnauthorizedErrorResponse,
			403: validateForbiddenErrorResponse,
		},
	},
	async function action() {
		const { recordId, expectedVersion, reason } = this.bodyParams;
		const reviewed = await YasChatProducts.reviewPendingProduct(
			recordId,
			expectedVersion,
			this.userId,
			'rejected',
			new Date().toISOString(),
			reason.trim(),
		);

		return API.v1.success({ reviewed });
	},
);
