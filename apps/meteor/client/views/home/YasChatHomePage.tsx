import { useEffect, useState } from 'react';
import { Box } from '@rocket.chat/fuselage';
import { Page, PageScrollableContent } from '@rocket.chat/ui-client';
import { css } from '@rocket.chat/css-in-js';

type YasChatProduct = {
	_id: string;
	product: {
		title?: string;
		description?: string;
		category?: string;
	};
};

type CatalogueResponse = {
	success: true;
	products: YasChatProduct[];
};

const PAGE_SIZE = 12;

const homeStyles = css`
	.yaschat-home { width: 100%; max-width: 1200px; margin: 0 auto; padding: 24px; box-sizing: border-box; }
	.yaschat-hero { padding: 28px; border-radius: 18px; background: linear-gradient(120deg, #182b63 0%, #3949ab 58%, #6b4fd3 100%); color: #fff; }
	.yaschat-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; opacity: .82; }
	.yaschat-hero h1 { margin: 10px 0 8px; font-size: clamp(25px, 4vw, 38px); line-height: 1.15; }
	.yaschat-hero p { max-width: 620px; margin: 0; line-height: 1.6; opacity: .9; }
	.yaschat-section-title { margin: 28px 0 14px; font-size: 19px; font-weight: 700; color: var(--rcx-color-foreground, #20242b); }
	.yaschat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
	.yaschat-feature { min-width: 0; padding: 18px; border: 1px solid var(--rcx-color-stroke-extra-light, #e5e7eb); border-radius: 14px; background: var(--rcx-color-surface, #fff); }
	.yaschat-feature-mark { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; margin-bottom: 12px; border-radius: 11px; background: #eef0ff; color: #3949ab; font-size: 18px; font-weight: 700; }
	.yaschat-feature h3 { margin: 0 0 6px; font-size: 15px; }
	.yaschat-feature p { margin: 0; color: var(--rcx-color-foreground-secondary, #687080); font-size: 13px; line-height: 1.5; }
	.yaschat-search { display: flex; gap: 8px; margin: 14px 0; }
	.yaschat-search input { flex: 1; min-width: 0; padding: 12px 14px; border: 1px solid var(--rcx-color-stroke-extra-light, #cfd3dc); border-radius: 10px; background: var(--rcx-color-surface, #fff); color: inherit; font: inherit; }
	.yaschat-search button, .yaschat-page-button { padding: 10px 16px; border: 0; border-radius: 10px; background: #3949ab; color: #fff; font: inherit; cursor: pointer; }
	.yaschat-search button:disabled, .yaschat-page-button:disabled { opacity: .45; cursor: not-allowed; }
	.yaschat-products { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
	.yaschat-product { min-width: 0; padding: 18px; border: 1px solid var(--rcx-color-stroke-extra-light, #e5e7eb); border-radius: 14px; background: var(--rcx-color-surface, #fff); }
	.yaschat-product h3 { margin: 0 0 8px; font-size: 16px; overflow-wrap: anywhere; }
	.yaschat-product p { margin: 0 0 10px; color: var(--rcx-color-foreground-secondary, #687080); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
	.yaschat-category { display: inline-block; margin-bottom: 8px; padding: 4px 8px; border-radius: 999px; background: #eef0ff; color: #3949ab; font-size: 11px; }
	.yaschat-state { padding: 18px; border: 1px solid var(--rcx-color-stroke-extra-light, #e5e7eb); border-radius: 12px; background: var(--rcx-color-surface, #fff); line-height: 1.6; }
	.yaschat-pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 18px 0 4px; }
	@media (max-width: 900px) { .yaschat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .yaschat-products { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 600px) { .yaschat-home { padding: 16px; } .yaschat-hero { padding: 22px 18px; border-radius: 14px; } .yaschat-grid, .yaschat-products { grid-template-columns: 1fr; gap: 10px; } .yaschat-feature, .yaschat-product { padding: 15px; } .yaschat-search { flex-wrap: wrap; } .yaschat-search button { width: 100%; } }
`;

const features = [
	{ mark: '⌕', title: 'Discover products', description: 'Find products from supported affiliate partners and compare verified catalogue information.' },
	{ mark: '✎', title: 'Read honest reviews', description: 'Explore product details and evidence-backed community feedback.' },
	{ mark: '◎', title: 'Join communities', description: 'Discuss products, ask questions and share useful experiences.' },
	{ mark: '↗', title: 'Share and earn', description: 'Referral rewards will appear after partner and payout rules are configured.' },
];

const YasChatHomePage = () => {
	const [searchInput, setSearchInput] = useState('');
	const [activeSearch, setActiveSearch] = useState('');
	const [page, setPage] = useState(0);
	const [products, setProducts] = useState<YasChatProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		const loadProducts = async (): Promise<void> => {
			setLoading(true);
			setError(false);
			try {
				const params = new URLSearchParams({ limit: String(PAGE_SIZE + 1), offset: String(page * PAGE_SIZE) });
				if (activeSearch) {
					params.set('search', activeSearch);
				}
				const response = await fetch(`/api/v1/yaschat.products?${params.toString()}`, {
					credentials: 'same-origin',
					headers: { Accept: 'application/json' },
					signal: controller.signal,
				});
				if (!response.ok) {
					throw new Error(`Catalogue request failed: ${response.status}`);
				}
				const payload = (await response.json()) as CatalogueResponse;
				if (!payload || payload.success !== true || !Array.isArray(payload.products)) {
					throw new Error('Invalid catalogue response');
				}
				setHasMore(payload.products.length > PAGE_SIZE);
				setProducts(payload.products.slice(0, PAGE_SIZE));
			} catch (cause) {
				if (!controller.signal.aborted) {
					setProducts([]);
					setHasMore(false);
					setError(true);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		};
		void loadProducts();
		return () => controller.abort();
	}, [activeSearch, page]);

	const submitSearch = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		setPage(0);
		setActiveSearch(searchInput.trim().slice(0, 120));
	};

	return (
		<Page color='default' background='tint'>
			<PageScrollableContent>
				<Box className={homeStyles}>
					<Box className='yaschat-hero' role='region' aria-label='YasChat introduction'>
						<Box className='yaschat-eyebrow'>YASCHAT · DISCOVER · DISCUSS · DECIDE</Box>
						<Box is='h1'>What do you want to know or share?</Box>
						<Box is='p'>Explore products, learn from real experiences and join conversations that help you make informed decisions.</Box>
					</Box>
					<Box is='h2' id='yaschat-explore-title' className='yaschat-section-title'>Explore YasChat</Box>
					<Box className='yaschat-grid' role='list' aria-labelledby='yaschat-explore-title'>
						{features.map((feature) => (
							<Box key={feature.title} className='yaschat-feature' role='listitem'>
								<Box className='yaschat-feature-mark' aria-hidden='true'>{feature.mark}</Box>
								<Box is='h3'>{feature.title}</Box>
								<Box is='p'>{feature.description}</Box>
							</Box>
						))}
					</Box>
					<Box is='h2' id='yaschat-products-title' className='yaschat-section-title'>Discover products</Box>
					<Box is='form' className='yaschat-search' role='search' onSubmit={submitSearch}>
						<input aria-label='Search approved products' type='search' maxLength={120} placeholder='Search products or categories…' value={searchInput} onChange={(event) => setSearchInput(event.currentTarget.value)} />
						<button type='submit'>Search</button>
					</Box>
					{loading ? (
						<Box className='yaschat-state' role='status' aria-live='polite'>Loading approved products…</Box>
					) : error ? (
						<Box className='yaschat-state' role='alert'>Products could not be loaded right now. Please try again.</Box>
					) : products.length === 0 ? (
						<Box className='yaschat-state' role='status'>{activeSearch ? 'No approved products match your search.' : 'No approved products are available yet. Products will appear here after an administrator approves them.'}</Box>
					) : (
						<Box className='yaschat-products' role='list' aria-label='Approved products'>
							{products.map((item) => (
								<Box key={item._id} className='yaschat-product' role='listitem'>
									{item.product.category && <Box className='yaschat-category'>{item.product.category}</Box>}
									<Box is='h3'>{item.product.title || 'Untitled product'}</Box>
									{item.product.description && <Box is='p'>{item.product.description}</Box>}
								</Box>
							))}
						</Box>
					)}
					{!loading && !error && (products.length > 0 || page > 0) && (
						<Box className='yaschat-pagination' role='navigation' aria-label='Product pages'>
							<button className='yaschat-page-button' type='button' disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</button>
							<Box aria-live='polite'>Page {page + 1}</Box>
							<button className='yaschat-page-button' type='button' disabled={!hasMore} onClick={() => setPage((current) => current + 1)}>Next</button>
						</Box>
					)}
					<Box is='h2' id='yaschat-feed-title' className='yaschat-section-title'>Your community feed</Box>
					<Box className='yaschat-state' role='region' aria-labelledby='yaschat-feed-title'>
						The feed will show posts from For You, Following, Worldwide and Questions when the community service is connected. No sample posts or fabricated activity are shown here.
					</Box>
				</Box>
			</PageScrollableContent>
		</Page>
	);
};

export default YasChatHomePage;
