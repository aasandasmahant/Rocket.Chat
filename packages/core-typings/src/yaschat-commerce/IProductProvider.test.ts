import assert from 'node:assert/strict';
import test from 'node:test';

import type { YasChatProductProvider, YasChatProductQuery, YasChatProductSyncResult } from './IProductProvider';

test('provider contracts expose bounded search inputs and explicit sync accounting', () => {
	const query: YasChatProductQuery = { query: 'headphones', limit: 20 };
	const result: YasChatProductSyncResult = {
		source: 'shareasale',
		fetched: 12,
		accepted: 10,
		rejected: 2,
		syncedAt: '2026-11-11T12:00:00.000Z',
	};
	assert.equal(query.limit, 20);
	assert.equal(result.fetched, result.accepted + result.rejected);
	const providerContract: Pick<YasChatProductProvider, 'source'> = { source: 'shareasale' };
	assert.equal(providerContract.source, result.source);
});
