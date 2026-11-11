import type { IYasChatProductsModel, YasChatApprovedProductView, YasChatProductDocument, YasChatProductsSearchOptions } from '@rocket.chat/model-typings';
import type { YasChatProductModerationStatus } from '@rocket.chat/core-typings';
import { escapeRegExp } from '@rocket.chat/tools';
import type { Db, Filter, FindCursor, IndexDescription } from 'mongodb';

import { BaseRaw } from './BaseRaw';

export class YasChatProductsRaw extends BaseRaw<YasChatProductDocument> implements IYasChatProductsModel {
	constructor(db: Db) {
		super(db, 'yaschat_products');
	}

	protected override modelIndexes(): IndexDescription[] {
		return [
			{
				key: { 'product.source': 1, 'product.externalId': 1 },
				unique: true,
				name: 'yaschat_product_source_external_id_unique',
			},
			{
				key: { 'moderation.status': 1, updatedAt: -1 },
				name: 'yaschat_product_moderation_updated',
			},
			{
				key: { 'product.category': 1, 'moderation.status': 1 },
				name: 'yaschat_product_category_status',
			},
			{
				key: { createdAt: -1 },
				name: 'yaschat_product_created_at',
			},
		];
	}

	findApprovedProducts(options: YasChatProductsSearchOptions = {}): FindCursor<YasChatApprovedProductView> {
		const limit = Number.isInteger(options.limit) ? Math.min(Math.max(options.limit as number, 1), 50) : 20;
		const offset = Number.isInteger(options.offset) ? Math.max(options.offset as number, 0) : 0;
		const search = options.search?.trim().slice(0, 120);
		const category = options.category?.trim().slice(0, 100);

		const query: Filter<YasChatProductDocument> = {
			'moderation.status': 'approved',
			...(category ? { 'product.category': category } : {}),
			...(search
				? {
						$or: [
							{ 'product.title': { $regex: escapeRegExp(search), $options: 'i' } },
							{ 'product.description': { $regex: escapeRegExp(search), $options: 'i' } },
							{ 'product.category': { $regex: escapeRegExp(search), $options: 'i' } },
						],
					}
				: {}),
		};

		return this.find<YasChatApprovedProductView>(query, {
			projection: { _id: 1, product: 1, createdAt: 1, updatedAt: 1 },
			sort: { updatedAt: -1, createdAt: -1 },
			limit,
			skip: offset,
		});
	}

	findByModerationStatus(status: YasChatProductModerationStatus, limit = 50): FindCursor<YasChatProductDocument> {
		const safeLimit = Number.isInteger(limit) ? Math.min(Math.max(limit, 1), 100) : 50;
		return this.find({ 'moderation.status': status }, { sort: { updatedAt: -1 }, limit: safeLimit });
	}
}
