export type AffiliateProviderKey = 'clickbank' | 'shareasale';

export type AffiliateProviderStatus = 'disabled' | 'not_configured' | 'ready' | 'degraded';

export type AffiliateProductCandidate = {
	provider: AffiliateProviderKey;
	providerProductId: string;
	title: string;
	description?: string;
	category?: string;
	merchantName?: string;
	price?: number;
	currency?: string;
	imageUrl?: string;
	destinationUrl?: string;
	affiliateUrl?: string;
	status: 'pending_review';
	sourceFetchedAt: Date;
};

export type AffiliateProviderHealth = {
	provider: AffiliateProviderKey;
	status: AffiliateProviderStatus;
	reason: 'disabled' | 'credentials_missing' | 'adapter_unavailable' | 'ready' | 'degraded';
};

export type AffiliateProviderAdapter = {
	readonly key: AffiliateProviderKey;
	getStatus(): AffiliateProviderStatus;
	searchCandidates(query: string, limit: number): Promise<AffiliateProductCandidate[]>;
};

export type AffiliateProviderConfiguration = {
	enabled: boolean;
};

export type AffiliateProviderConfigurations = Record<AffiliateProviderKey, AffiliateProviderConfiguration>;

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_CATEGORY_LENGTH = 100;
const MAX_IDENTIFIER_LENGTH = 128;
const MAX_LIMIT = 50;

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const readOptionalString = (value: unknown, field: string, maxLength: number): string | undefined => {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}

	if (typeof value !== 'string' || value.trim().length > maxLength) {
		throw new TypeError(`Invalid affiliate candidate field: ${field}`);
	}

	return value.trim();
};

const readOptionalUrl = (value: unknown, field: string): string | undefined => {
	const candidate = readOptionalString(value, field, 2048);
	if (!candidate) {
		return undefined;
	}

	let parsed: URL;
	try {
		parsed = new URL(candidate);
	} catch {
		throw new TypeError(`Invalid affiliate candidate URL: ${field}`);
	}

	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new TypeError(`Unsupported affiliate candidate URL protocol: ${field}`);
	}

	return parsed.toString();
};

/**
 * Converts an untrusted provider payload into the internal candidate shape.
 * Imported records are always pending review; providers cannot publish products.
 */
export const normalizeAffiliateCandidate = (
	provider: AffiliateProviderKey,
	raw: unknown,
	sourceFetchedAt = new Date(),
): AffiliateProductCandidate => {
	if (!isRecord(raw)) {
		throw new TypeError('Affiliate candidate must be an object');
	}

	const providerProductId = readOptionalString(raw.providerProductId, 'providerProductId', MAX_IDENTIFIER_LENGTH);
	const title = readOptionalString(raw.title, 'title', MAX_TITLE_LENGTH);

	if (!providerProductId || !title) {
		throw new TypeError('Affiliate candidate requires providerProductId and title');
	}

	if (Number.isNaN(sourceFetchedAt.getTime())) {
		throw new TypeError('Invalid sourceFetchedAt timestamp');
	}

	const price = raw.price;
	if (price !== undefined && price !== null && (typeof price !== 'number' || !Number.isFinite(price) || price < 0)) {
		throw new TypeError('Invalid affiliate candidate field: price');
	}

	const currency = readOptionalString(raw.currency, 'currency', 3);
	if (currency && !/^[A-Z]{3}$/.test(currency)) {
		throw new TypeError('Invalid affiliate candidate field: currency');
	}

	return {
		provider,
		providerProductId,
		title,
		...(readOptionalString(raw.description, 'description', MAX_DESCRIPTION_LENGTH) && {
			description: readOptionalString(raw.description, 'description', MAX_DESCRIPTION_LENGTH),
		}),
		...(readOptionalString(raw.category, 'category', MAX_CATEGORY_LENGTH) && {
			category: readOptionalString(raw.category, 'category', MAX_CATEGORY_LENGTH),
		}),
		...(readOptionalString(raw.merchantName, 'merchantName', 160) && {
			merchantName: readOptionalString(raw.merchantName, 'merchantName', 160),
		}),
		...(price !== undefined && price !== null && { price }),
		...(currency && { currency }),
		...(readOptionalUrl(raw.imageUrl, 'imageUrl') && { imageUrl: readOptionalUrl(raw.imageUrl, 'imageUrl') }),
		...(readOptionalUrl(raw.destinationUrl, 'destinationUrl') && {
			destinationUrl: readOptionalUrl(raw.destinationUrl, 'destinationUrl'),
		}),
		...(readOptionalUrl(raw.affiliateUrl, 'affiliateUrl') && { affiliateUrl: readOptionalUrl(raw.affiliateUrl, 'affiliateUrl') }),
		status: 'pending_review',
		sourceFetchedAt,
	};
};

export class AffiliateProviderRegistry {
	private readonly adapters = new Map<AffiliateProviderKey, AffiliateProviderAdapter>();

	constructor(private readonly configuration: AffiliateProviderConfigurations) {}

	register(adapter: AffiliateProviderAdapter): void {
		this.adapters.set(adapter.key, adapter);
	}

	getHealth(provider: AffiliateProviderKey): AffiliateProviderHealth {
		if (!this.configuration[provider].enabled) {
			return { provider, status: 'disabled', reason: 'disabled' };
		}

		const adapter = this.adapters.get(provider);
		if (!adapter) {
			return { provider, status: 'not_configured', reason: 'adapter_unavailable' };
		}

		const status = adapter.getStatus();
		return {
			provider,
			status,
			reason:
				status === 'ready'
					? 'ready'
					: status === 'degraded'
						? 'degraded'
						: status === 'disabled'
							? 'disabled'
							: 'credentials_missing',
		};
	}

	async searchCandidates(provider: AffiliateProviderKey, query: string, limit = 20): Promise<AffiliateProductCandidate[]> {
		const health = this.getHealth(provider);
		if (health.status !== 'ready') {
			return [];
		}

		const normalizedQuery = query.trim();
		if (!normalizedQuery || normalizedQuery.length > 120) {
			throw new TypeError('Affiliate search query must contain 1 to 120 characters');
		}

		if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
			throw new RangeError(`Affiliate search limit must be between 1 and ${MAX_LIMIT}`);
		}

		return this.adapters.get(provider)!.searchCandidates(normalizedQuery, limit);
	}
}

/**
 * Safe default configuration: no affiliate provider is enabled until explicitly configured.
 */
export const defaultAffiliateProviderConfigurations: AffiliateProviderConfigurations = {
	clickbank: { enabled: false },
	shareasale: { enabled: false },
};
