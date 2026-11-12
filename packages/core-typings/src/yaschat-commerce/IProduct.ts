import * as z from 'zod';

export const YasChatProductSourceSchema = z.enum(['clickbank', 'shareasale']);
export type YasChatProductSource = z.infer<typeof YasChatProductSourceSchema>;

export const YasChatProductPriceSchema = z.object({
	amount: z.number().finite().nonnegative(),
	currency: z.string().regex(/^[A-Z]{3}$/),
});

export const YasChatProductReviewEvidenceSchema = z.object({
	source: z.enum(['youtube', 'reddit', 'publisher', 'customer']),
	url: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'Evidence URLs must use HTTPS'),
	title: z.string().trim().min(1).max(240),
	publishedAt: z.string().datetime().optional(),
	collectedAt: z.string().datetime(),
});

/**
 * Normalised, source-attributed product metadata.
 * This schema deliberately does not contain fabricated ratings, stock, or earnings.
 */
export const YasChatProductSchema = z.object({
	source: YasChatProductSourceSchema,
	externalId: z.string().trim().min(1).max(160),
	title: z.string().trim().min(1).max(240),
	description: z.string().trim().max(5000).optional(),
	productUrl: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'Product URLs must use HTTPS'),
	affiliateUrl: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'Affiliate URLs must use HTTPS')
		.optional(),
	imageUrl: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'Image URLs must use HTTPS')
		.optional(),
	price: YasChatProductPriceSchema.optional(),
	category: z.string().trim().min(1).max(100).optional(),
	disclosureRequired: z.literal(true),
	reviewEvidence: z.array(YasChatProductReviewEvidenceSchema).default([]),
	lastSyncedAt: z.string().datetime().optional(),
});

export type YasChatProduct = z.infer<typeof YasChatProductSchema>;
export type YasChatProductReviewEvidence = z.infer<typeof YasChatProductReviewEvidenceSchema>;

export const parseYasChatProduct = (input: unknown): YasChatProduct => YasChatProductSchema.parse(input);
