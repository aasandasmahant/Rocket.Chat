import assert from 'node:assert/strict';
import test from 'node:test';

import {
	parseYasChatProductQuery,
	YasChatProductQuerySchema,
	YasChatProductSyncResultSchema,
	type YasChatProductProvider,
	type YasChatProductQuery,
} from './IProductProvider';

test('provider queries apply safe defaults and accept supported filters', () => {
	assert.deepEqual(parseYasChatProductQuery({ query: ' headphones ' }), {
		query: 'headphones',
		limit: 20,
	});
	const query: YasChatProductQuery = { query: 'headphones', limit: 20, provider: 'shareasale', locale: 'en-IN' };
	assert.equal(query.limit, 20);
});

test('provider queries reject unbounded pagination and malformed filters', () => {
	assert.equal(YasChatProductQuerySchema.safeParse({ limit: 0 }).success, false);
	assert.equal(YasChatProductQuerySchema.safeParse({ limit: 51 }).success, false);
	assert.equal(YasChatProductQuerySchema.safeParse({ cursor: '' }).success, false);
	assert.equal(YasChatProductQuerySchema.safeParse({ category: ' ' }).success, false);
});

test('sync accounting requires fetched to equal accepted plus rejected', () => {
	const valid = {
		source: 'shareasale',
		fetched: 12,
		accepted: 10,
		rejected: 2,
		syncedAt: '2026-11-11T12:00:00.000Z',
	};
	assert.equal(YasChatProductSyncResultSchema.safeParse(valid).success, true);
	assert.equal(YasChatProductSyncResultSchema.safeParse({ ...valid, fetched: 13 }).success, false);
	assert.equal(YasChatProductSyncResultSchema.safeParse({ ...valid, accepted: -1 }).success, false);
});

test('provider interface exposes a source discriminator', () => {
	const providerContract: Pick<YasChatProductProvider, 'source'> = { source: 'shareasale' };
	assert.equal(providerContract.source, 'shareasale');
});
