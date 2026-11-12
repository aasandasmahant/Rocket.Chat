import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { permissions } from './permissions';

describe('YasChat product moderation permission', () => {
	it('is registered exactly once', () => {
		const matches = permissions.filter(({ _id }) => _id === 'yaschat-product-moderation');

		assert.equal(matches.length, 1);
	});

	it('is granted to administrators by default only', () => {
		const permission = permissions.find(({ _id }) => _id === 'yaschat-product-moderation');

		assert.ok(permission, 'YasChat moderation permission must be registered');
		assert.deepEqual(permission.roles, ['admin']);
	});

	it('does not grant moderation access to ordinary users by default', () => {
		const permission = permissions.find(({ _id }) => _id === 'yaschat-product-moderation');

		assert.ok(permission, 'YasChat moderation permission must be registered');
		assert.equal(permission.roles.includes('user'), false);
		assert.equal(permission.roles.includes('guest'), false);
		assert.equal(permission.roles.includes('bot'), false);
	});
});
