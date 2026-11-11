import type { YasChatProductAdminRecord, YasChatProductModerationStatus } from '@rocket.chat/core-typings';
import type { FindCursor } from 'mongodb';

import type { IBaseModel } from './IBaseModel';

/**
 * Persistence contract for YasChat's moderated product catalogue.
 *
 * The stored document uses the public record shape plus MongoDB's string _id.
 * Authorization and state-transition checks belong in the service layer, not
 * in this model interface.
 */
export type YasChatProductDocument = YasChatProductAdminRecord & {
	_id: string;
};

export type YasChatApprovedProductView = Pick<YasChatProductDocument, '_id' | 'product' | 'createdAt' | 'updatedAt'>;

export interface YasChatProductsSearchOptions {
	search?: string;
	category?: string;
	limit?: number;
	offset?: number;
}

export interface IYasChatProductsModel extends IBaseModel<YasChatProductDocument> {
	/**
	 * Public catalogue query. The approved-status constraint is enforced by the
	 * model query itself; callers cannot override it through supplied filters.
	 * Services should still apply endpoint-level rate limits and DTO validation.
	 */
	findApprovedProducts(options?: YasChatProductsSearchOptions): FindCursor<YasChatApprovedProductView>;
	findByModerationStatus(status: YasChatProductModerationStatus, limit?: number): FindCursor<YasChatProductDocument>;
}
