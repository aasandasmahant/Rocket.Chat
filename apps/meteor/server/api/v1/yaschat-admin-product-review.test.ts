import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = readFileSync(join(__dirname, 'yaschat-admin-product-review.ts'), 'utf8');
const modelSource = readFileSync(join(__dirname, '../../../../../packages/models/src/models/YasChatProducts.ts'), 'utf8');

function routeOptions(routeName: string): string {
	const routeIndex = source.indexOf(`'${routeName}'`);
	assert.notEqual(routeIndex, -1, `Expected route ${routeName} to be registered`);

	const optionsStart = source.indexOf('{', routeIndex);
	const actionStart = source.indexOf('async function action()', optionsStart);
	assert.notEqual(optionsStart, -1, `Expected options for ${routeName}`);
	assert.notEqual(actionStart, -1, `Expected action for ${routeName}`);

	return source.slice(optionsStart, actionStart);
}

describe('YasChat moderation API authorization', () => {
	for (const routeName of ['yaschat.admin.products.approve', 'yaschat.admin.products.reject']) {
		it(`${routeName} requires authentication and the dedicated permission`, () => {
			const options = routeOptions(routeName);

			assert.match(options, /authRequired:\s*true/);
			assert.match(options, /permissionsRequired:\s*\['yaschat-product-moderation'\]/);
			assert.match(options, /401:\s*validateUnauthorizedErrorResponse/);
			assert.match(options, /403:\s*validateForbiddenErrorResponse/);
		});
	}

	it('requires a positive expected version for approve and reject requests', () => {
		const approveSchema = source.slice(source.indexOf('const approveBodySchema'), source.indexOf('const rejectBodySchema'));
		const rejectSchema = source.slice(source.indexOf('const rejectBodySchema'), source.indexOf('const reviewResponseSchema'));

		assert.match(approveSchema, /expectedVersion:\s*\{\s*type:\s*'integer',\s*minimum:\s*1\s*\}/);
		assert.match(rejectSchema, /expectedVersion:\s*\{\s*type:\s*'integer',\s*minimum:\s*1\s*\}/);
	});

	it('requires a non-empty rejection reason', () => {
		const rejectSchema = source.slice(source.indexOf('const rejectBodySchema'), source.indexOf('const reviewResponseSchema'));

		assert.match(rejectSchema, /reason:\s*\{\s*type:\s*'string',\s*minLength:\s*1/);
		assert.match(rejectSchema, /reason:\s*\{[^}]*pattern:\s*'\\\\S'/);
		assert.match(rejectSchema, /'recordId',\s*'expectedVersion',\s*'reason'/);
	});

	describe('YasChat product moderation persistence', () => {
		it('updates the product timestamp in the same atomic versioned review update', () => {
			assert.match(modelSource, /recordId,\s*'version': expectedVersion,\s*'moderation.status': 'pending-review'/);
			assert.match(modelSource, /\$set:\s*\{\s*updatedAt: occurredAt,\s*moderation:/);
			assert.match(modelSource, /\$inc:\s*\{ version: 1 \}/);
			assert.match(modelSource, /\$push:\s*\{ moderationHistory: event \}/);
		});
	});
});
