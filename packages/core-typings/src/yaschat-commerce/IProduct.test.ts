import assert from 'node:assert/strict';
import test from 'node:test';

import { parseYasChatProduct, YasChatProductSchema } from './IProduct';

const validProduct = {
	source: 'clickbank',
	externalId: 'vendor-product-01',
	title: 'Example product',
	productUrl: 'https://vendor.example/product',
	disclosureRequired: true,
};

test('accepts a source-attributed product with an explicit disclosure requirement', () => {
	const product = parseYasChatProduct(validProduct);
	assert.equal(product.source, 'clickbank');
	assert.equal(product.disclosureRequired, true);
	assert.deepEqual(product.reviewEvidence, []);
});

test('rejects insecure product and affiliate URLs', () => {
	assert.equal(YasChatProductSchema.safeParse({ ...validProduct, productUrl: 'http://vendor.example/product' }).success, false);
	assert.equal(YasChatProductSchema.safeParse({ ...validProduct, affiliateUrl: 'http://affiliate.example/link' }).success, false);
});

test('rejects unsupported sources and invalid price currencies', () => {
	assert.equal(YasChatProductSchema.safeParse({ ...validProduct, source: 'unknown-network' }).success, false);
	assert.equal(YasChatProductSchema.safeParse({ ...validProduct, price: { amount: 12, currency: 'usd' } }).success, false);
});

test('requires affiliate disclosure metadata', () => {
	const { disclosureRequired: _disclosureRequired, ...withoutDisclosure } = validProduct;
	assert.equal(YasChatProductSchema.safeParse(withoutDisclosure).success, false);
});

test('rejects review evidence without an HTTPS source URL', () => {
	assert.equal(
		YasChatProductSchema.safeParse({
			...validProduct,
			reviewEvidence: [
				{
					source: 'reddit',
					url: 'http://reddit.example/review',
					title: 'Review discussion',
					collectedAt: '2026-11-11T12:00:00.000Z',
				},
			],
		}).success,
		false,
	);
});
