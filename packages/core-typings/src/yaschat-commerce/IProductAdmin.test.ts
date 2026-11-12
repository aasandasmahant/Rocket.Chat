import assert from 'node:assert/strict';
import test from 'node:test';

import { YasChatProductAdminAuditEventSchema, YasChatProductAdminRecordSchema, YasChatProductModerationSchema } from './IProductAdmin';

const product = {
	source: 'clickbank',
	externalId: 'vendor-product-01',
	title: 'Example product',
	productUrl: 'https://vendor.example/product',
	disclosureRequired: true,
};

const record = {
	recordId: 'catalogue-001',
	product,
	moderation: { status: 'draft' },
	createdBy: 'admin-001',
	createdAt: '2026-11-11T12:00:00.000Z',
	updatedAt: '2026-11-11T12:00:00.000Z',
	version: 1,
};

test('accepts a draft catalogue record with source-attributed product data', () => {
	assert.equal(YasChatProductAdminRecordSchema.safeParse(record).success, true);
});

test('requires reviewer identity and timestamp before approval', () => {
	assert.equal(YasChatProductModerationSchema.safeParse({ status: 'approved' }).success, false);
	assert.equal(
		YasChatProductModerationSchema.safeParse({
			status: 'approved',
			reviewedBy: 'admin-001',
			reviewedAt: '2026-11-11T12:00:00.000Z',
		}).success,
		true,
	);
});

test('requires a reason when rejecting a product', () => {
	assert.equal(YasChatProductModerationSchema.safeParse({ status: 'rejected' }).success, false);
	assert.equal(
		YasChatProductModerationSchema.safeParse({ status: 'rejected', rejectionReason: 'Source could not be verified' }).success,
		true,
	);
});

test('rejects malformed catalogue records and non-positive versions', () => {
	assert.equal(YasChatProductAdminRecordSchema.safeParse({ ...record, version: 0 }).success, false);
	assert.equal(YasChatProductAdminRecordSchema.safeParse({ ...record, createdBy: '' }).success, false);
});

test('requires a reason in rejection audit events', () => {
	const event = {
		recordId: 'catalogue-001',
		actorId: 'admin-001',
		action: 'rejected',
		occurredAt: '2026-11-11T12:00:00.000Z',
	};
	assert.equal(YasChatProductAdminAuditEventSchema.safeParse(event).success, false);
	assert.equal(YasChatProductAdminAuditEventSchema.safeParse({ ...event, reason: 'Unverified source' }).success, true);
});

test('accepts an audit event with an explicit changed-field list', () => {
	assert.equal(
		YasChatProductAdminAuditEventSchema.safeParse({
			recordId: 'catalogue-001',
			actorId: 'admin-001',
			action: 'updated',
			occurredAt: '2026-11-11T12:00:00.000Z',
			changedFields: ['product.title', 'product.price'],
		}).success,
		true,
	);
});
