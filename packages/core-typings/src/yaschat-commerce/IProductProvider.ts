import type { YasChatProduct, YasChatProductSource } from './IProduct';

export type YasChatProductQuery = {
	query?: string;
	category?: string;
	limit?: number;
	cursor?: string;
};

export type YasChatProviderConnectionState = 'not-configured' | 'connected' | 'needs-attention';

export type YasChatProductSyncResult = {
	source: YasChatProductSource;
	fetched: number;
	accepted: number;
	rejected: number;
	nextCursor?: string;
	syncedAt: string;
};

export interface YasChatProductProvider {
	readonly source: YasChatProductSource;
	getConnectionState(): Promise<YasChatProviderConnectionState>;
	searchProducts(query: YasChatProductQuery): Promise<{
		products: YasChatProduct[];
		nextCursor?: string;
	}>;
}

/**
 * Provider adapters must map only verified upstream fields into YasChat's
 * canonical product schema. Credentials belong in server-side secret storage,
 * never in this contract or client-visible product records.
 */
