import type { YasChatProductDocument } from '@rocket.chat/model-typings';
import type { Db, IndexDescription } from 'mongodb';

import { BaseRaw } from './BaseRaw';

export class YasChatProductsRaw extends BaseRaw<YasChatProductDocument> {
	constructor(db: Db) {
		super(db, 'yaschat_products');
	}

	protected override modelIndexes(): IndexDescription[] {
		return [
			{ key: { 'product.source': 1, 'product.externalId': 1 }, unique: true, name: 'yaschat_product_source_external_id_unique' },
			{ key: { 'moderation.status': 1, updatedAt: -1 }, name: 'yaschat_product_moderation_updated' },
			{ key: { 'product.category': 1, 'moderation.status': 1 }, name: 'yaschat_product_category_status' },
			{ key: { createdAt: -1 }, name: 'yaschat_product_created_at' },
		];
	}
}
