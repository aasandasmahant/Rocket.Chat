import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	AffiliateProviderRegistry,
	defaultAffiliateProviderConfigurations,
	normalizeAffiliateCandidate,
	type AffiliateProviderAdapter,
} from './affiliate-provider';

describe('YasChat affiliate provider foundation', () => {
	it('keeps every provider disabled by default', () => {
		const registry = new AffiliateProviderRegistry(defaultAffiliateProviderConfigurations);

		assert.equal(registry.getHealth('clickbank').status, 'disabled');
		assert.equal(registry.getHealth('shareasale').status, 'disabled');
	});

	it('does not call an adapter when its provider is disabled', async () => {
		let calls = 0;
		const adapter: AffiliateProviderAdapter = {
			key: 'clickbank',
			getStatus: () => 'ready',
			searchCandidates: async () => {
				calls += 1;
				return [];
			},
		};
		const registry = new AffiliateProviderRegistry(defaultAffiliateProviderConfigurations);
		registry.register(adapter);

		assert.deepEqual(await registry.searchCandidates('clickbank', 'headphones'), []);
		assert.equal(calls, 0);
	});

	it('reports enabled provider without an adapter as not configured', () => {
		const registry = new AffiliateProviderRegistry({
			clickbank: { enabled: true },
			shareasale: { enabled: false },
		});

		assert.equal(registry.getHealth('clickbank').status, 'not_configured');
		assert.equal(registry.getHealth('clickbank').reason, 'adapter_unavailable');
	});

	it('normalizes a valid candidate and always marks it pending review', () => {
		const fetchedAt = new Date('2026-01-01T00:00:00.000Z');
		const candidate = normalizeAffiliateCandidate(
			'clickbank',
			{
				providerProductId: 'cb-123',
				title: '  Sample product  ',
				price: 12.5,
				currency: 'USD',
				destinationUrl: 'https://merchant.example/product',
			},
			fetchedAt,
		);

		assert.equal(candidate.title, 'Sample product');
		assert.equal(candidate.provider, 'clickbank');
		assert.equal(candidate.status, 'pending_review');
		assert.equal(candidate.sourceFetchedAt, fetchedAt);
	});

	it('rejects malformed candidates and unsafe URL protocols', () => {
		assert.throws(() => normalizeAffiliateCandidate('clickbank', null), /must be an object/);
		assert.throws(
			() =>
				normalizeAffiliateCandidate('clickbank', {
					providerProductId: 'cb-123',
					title: 'Bad URL',
					affiliateUrl: 'javascript:alert(1)',
				}),
			/Unsupported affiliate candidate URL protocol/,
		);
	});

	it('rejects invalid price, currency, query, and limits', async () => {
		assert.throws(
			() => normalizeAffiliateCandidate('clickbank', { providerProductId: 'cb-1', title: 'Bad', price: -1 }),
			/Invalid affiliate candidate field: price/,
		);
		assert.throws(
			() => normalizeAffiliateCandidate('clickbank', { providerProductId: 'cb-1', title: 'Bad', currency: 'usd' }),
			/Invalid affiliate candidate field: currency/,
		);

		const adapter: AffiliateProviderAdapter = {
			key: 'clickbank',
			getStatus: () => 'ready',
			searchCandidates: async () => [],
		};
		const registry = new AffiliateProviderRegistry({
			clickbank: { enabled: true },
			shareasale: { enabled: false },
		});
		registry.register(adapter);

		await assert.rejects(() => registry.searchCandidates('clickbank', '   '), /query must contain/);
		await assert.rejects(() => registry.searchCandidates('clickbank', 'headphones', 51), /limit must be between/);
	});
});
