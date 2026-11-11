import type { YasChatProductAdminRecord } from '@rocket.chat/core-typings';

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

export interface IYasChatProductsModel extends IBaseModel<YasChatProductDocument> {}
