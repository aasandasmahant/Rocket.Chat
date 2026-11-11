import assert from 'node:assert/strict';
import test from 'node:test';

import { YasChatProductModerationTransitionSchema } from './IProductAdminWorkflow';

const base = {
	actorId: 'admin-001',
	occurredAt: '2026-11-11T12:00:00.000Z',
};

test('allows draft submission and review approval transitions', () => {
	assert.equal(YasChatProductModerationTransitionSchema.safeParse({ ...base, from: 'draft', to: 'pending-review' }).success, true);
	assert.equal(YasChatProductModerationTransitionSchema.safeParse({ ...base, from: 'pending-review', to: 'approved' }).success, true);
});

test('rejects unsupported moderation transitions', () => {
	assert.equal(YasChatProductModerationTransitionSchema.safeParse({ ...base, from: 'draft', to: 'approved' }).success, false);
	assert.equal(YasChatProductModerationTransitionSchema.safeParse({ ...base, from: 'approved', to: 'pending-review' }).success, false);
});

test('requires a reason when transitioning to rejected', () => {
	assert.equal(YasChatProductModerationTransitionSchema.safeParse({ ...base, from: 'pending-review', to: 'rejected' }).success, false);
	assert.equal(
		YasChatProductModerationTransitionSchema.safeParse({
			...base,
			from: 'pending-review',
			to: 'rejected',
			reason: 'Provider source could not be verified',
		}).success,
		true,
	);
});

test('requires a non-empty actor and valid timestamp', () => {
	assert.equal(YasChatProductModerationTransitionSchema.safeParse({ ...base, actorId: ' ', from: 'draft', to: 'pending-review' }).success, false);
	assert.equal(YasChatProductModerationTransitionSchema.safeParse({ ...base, occurredAt: 'not-a-date', from: 'draft', to: 'pending-review' }).success, false);
});
