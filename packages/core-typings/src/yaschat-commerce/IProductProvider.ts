import * as z from 'zod';

import { YasChatProductSourceSchema, type YasChatProduct, type YasChatProductSource } from './IProduct';

export const YasChatProductQuerySchema = z.object({
	query: z.string().trim().max(200).optional(),
	category: z.string().trim().min(1).max(100).optional(),
	limit: z.number().int().min(1).max(50).default(20),
	cursor: z.string().trim().min(1).max(1000).optional(),
	locale: z.string().trim().min(2).max(35).optional(),
	provider: YasChatProductSourceSchema.optional(),
});

export type YasChatProductQuery = z.input<typeof YasChatProductQuerySchema>;
export const parseYasChatProductQuery = (input: unknown) => YasChatProductQuerySchema.parse(input);

export const YasChatProviderConnectionStateSchema = z.enum(['not-configured', 'connected', 'needs-attention']);
export type YasChatProviderConnectionState = z.infer<typeof YasChatProviderConnectionStateSchema>;

export const YasChatProductSyncResultSchema = z
	.object({
		source: YasChatProductSourceSchema,
		fetched: z.number().int().nonnegative(),
		accepted: z.number().int().nonnegative(),
		rejected: z.number().int().nonnegative(),
		nextCursor: z.string().trim().min(1).max(1000).optional(),
		syncedAt: z.string().datetime(),
	})
	.superRefine((result, context) => {
		if (result.fetched !== result.accepted + result.rejected) {
			context.addIssue({
				code: 'custom',
				message: 'Fetched products must equal accepted plus rejected products',
				path: ['fetched'],
			});
		}
	});

export type YasChatProductSyncResult = z.infer<typeof YasChatProductSyncResultSchema>;

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
