import { Box } from '@rocket.chat/fuselage';
import { MessageComposerAction } from '@rocket.chat/ui-composer';
import type { ComposerAPI } from '../../../../lib/chats/ChatAPI';
import { useEffect, useState } from 'react';
import { css } from '@rocket.chat/css-in-js';

type YasChatProduct = {
	_id: string;
	product: {
		title?: string;
		description?: string;
		category?: string;
		productUrl: string;
		price?: { amount: number; currency: string };
		source: 'clickbank' | 'shareasale';
	};
};

type CatalogueResponse = {
	success: true;
	products: YasChatProduct[];
};

const pickerStyles = css`
	.yaschat-composer-product-picker { position: relative; }
	.yaschat-composer-product-list { position: absolute; z-index: 20; inset-block-end: calc(100% + 8px); inset-inline-start: 0; width: min( min(360px, calc(100vw - 32px)), 360px); max-height: 320px; overflow: auto; padding: 8px; border: 1px solid var(--rcx-color-stroke-extra-light, #d8dce5); border-radius: 12px; background: var(--rcx-color-surface, #fff); box-shadow: 0 8px 28px rgb(0 0 0 / 16%); }
	.yaschat-composer-product-option { display: block; width: 100%; padding: 10px; border: 0; border-radius: 8px; background: transparent; color: inherit; text-align: start; cursor: pointer; }
	.yaschat-composer-product-option:hover, .yaschat-composer-product-option:focus-visible { background: var(--rcx-color-surface-tint, #f0f2fa); outline: none; }
	.yaschat-composer-product-option strong, .yaschat-composer-product-option span { display: block; overflow-wrap: anywhere; }
	.yaschat-composer-product-option span, .yaschat-composer-product-state { margin-top: 4px; color: var(--rcx-color-foreground-secondary, #687080); font-size: 12px; }
`;

const YasChatComposerProductPicker = ({ composer, disabled }: { composer?: ComposerAPI; disabled: boolean }) => {
	const [open, setOpen] = useState(false);
	const [products, setProducts] = useState<YasChatProduct[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!open || products.length > 0 || loading) {
			return;
		}

		const controller = new AbortController();
		const load = async (): Promise<void> => {
			setLoading(true);
			setError(false);
			try {
				const response = await fetch('/api/v1/yaschat.products?limit=20&offset=0', {
					credentials: 'same-origin',
					headers: { Accept: 'application/json' },
					signal: controller.signal,
				});
				if (!response.ok) {
					throw new Error('Catalogue request failed');
				}
				const payload = (await response.json()) as CatalogueResponse;
				if (payload?.success !== true || !Array.isArray(payload.products)) {
					throw new Error('Invalid catalogue response');
				}
				setProducts(payload.products);
			} catch {
				if (!controller.signal.aborted) {
					setError(true);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		};
		void load();
		return () => controller.abort();
	}, [loading, open, products.length]);

	const insertProduct = (item: YasChatProduct): void => {
		const product = item.product;
		let destination: URL;
		try {
			destination = new URL(product.productUrl);
		} catch {
			return;
		}
		if (destination.protocol !== 'https:') {
			return;
		}
		const details = [
			`Product: ${product.title || 'Untitled product'}`,
			product.category ? `Category: ${product.category}` : undefined,
			product.price ? `Price: ${new Intl.NumberFormat(undefined, { style: 'currency', currency: product.price.currency }).format(product.price.amount)}` : undefined,
			`Partner: ${product.source === 'clickbank' ? 'ClickBank' : 'ShareASale'}`,
			`Link: ${destination.toString()}`,
			'Shared from the YasChat catalogue. Please verify current price and details with the seller.',
		].filter((line): line is string => Boolean(line));
		composer?.insertText(details.join('\n'));
		composer?.focus();
		setOpen(false);
	};

	return (
		<Box className={pickerStyles}>
			<MessageComposerAction
				icon='shopping-cart'
				title='Insert YasChat product'
				aria-label='Insert YasChat product'
				aria-expanded={open}
				disabled={disabled || !composer}
				onClick={() => setOpen((current) => !current)}
			/>
			{open && (
				<Box className='yaschat-composer-product-list' role='dialog' aria-label='Choose a YasChat product'>
					{loading && <Box className='yaschat-composer-product-state' role='status'>Loading approved products…</Box>}
					{error && <Box className='yaschat-composer-product-state' role='alert'>Products could not be loaded. Close and try again.</Box>}
					{!loading && !error && products.length === 0 && <Box className='yaschat-composer-product-state' role='status'>No approved products are available.</Box>}
					{products.map((item) => (
						<button className='yaschat-composer-product-option' type='button' key={item._id} onClick={() => insertProduct(item)}>
							<strong>{item.product.title || 'Untitled product'}</strong>
							<span>{item.product.category || (item.product.source === 'clickbank' ? 'ClickBank' : 'ShareASale')}</span>
						</button>
					))}
				</Box>
			)}
		</Box>
	);
};

export default YasChatComposerProductPicker;
