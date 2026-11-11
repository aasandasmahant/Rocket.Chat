import { Box, Button, Margins } from '@rocket.chat/fuselage';
import { Page, PageContent, PageHeader } from '@rocket.chat/ui-client';
import { css } from '@rocket.chat/css-in-js';
import { useEffect, useState } from 'react';

type ProductReviewItem = {
	_id: string;
	recordId: string;
	version: number;
	product: {
		title?: string;
		description?: string;
		category?: string;
		imageUrl?: string;
		productUrl?: string;
		price?: { amount: number; currency: string };
		source?: string;
	};
	moderation: {
		status: string;
		rejectionReason?: string;
	};
};

type QueueResponse = { success: true; products: ProductReviewItem[] };
type ReviewResponse = { success: true; reviewed: boolean };

const styles = css`
	.yaschat-review { max-width: 1180px; margin: 0 auto; padding: 16px; }
	.yaschat-review-intro { margin: 0 0 18px; color: var(--rcx-color-foreground-secondary, #687080); line-height: 1.55; }
	.yaschat-review-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 16px; }
	.yaschat-review-list { display: grid; gap: 14px; }
	.yaschat-review-card { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 16px; padding: 16px; border: 1px solid var(--rcx-color-stroke-extra-light, #e5e7eb); border-radius: 12px; background: var(--rcx-color-surface, #fff); }
	.yaschat-review-card img { width: 100%; height: 130px; object-fit: contain; border-radius: 8px; background: var(--rcx-color-surface-tint, #f5f6fa); }
	.yaschat-review-card h3 { margin: 0 0 8px; overflow-wrap: anywhere; }
	.yaschat-review-card p { margin: 0 0 8px; color: var(--rcx-color-foreground-secondary, #687080); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
	.yaschat-review-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
	.yaschat-review-reason { width: 100%; max-width: 520px; min-height: 72px; padding: 10px; border: 1px solid var(--rcx-color-stroke-extra-light, #cfd3dc); border-radius: 8px; font: inherit; }
	.yaschat-review-state { padding: 18px; border: 1px solid var(--rcx-color-stroke-extra-light, #e5e7eb); border-radius: 10px; line-height: 1.55; }
	.yaschat-review-error { color: var(--rcx-color-status-font-on-danger, #b42318); }
	@media (max-width: 640px) { .yaschat-review-card { grid-template-columns: 1fr; } .yaschat-review-card img { height: 170px; } }
`;

const YasChatProductReviewPage = () => {
	const [products, setProducts] = useState<ProductReviewItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [busyId, setBusyId] = useState('');
	const [reasons, setReasons] = useState<Record<string, string>>({});
	const [notice, setNotice] = useState('');

	const loadQueue = async (signal?: AbortSignal): Promise<void> => {
		setLoading(true);
		setError('');
		try {
			const response = await fetch('/api/v1/yaschat.admin.products?status=pending-review&limit=100', {
				credentials: 'same-origin',
				headers: { Accept: 'application/json' },
				signal,
			});
			if (!response.ok) {
				throw new Error(response.status === 403 ? 'You do not have permission to review products.' : 'The review queue could not be loaded.');
			}
			const payload = (await response.json()) as QueueResponse;
			if (payload.success !== true || !Array.isArray(payload.products)) {
				throw new Error('The server returned an invalid review queue.');
			}
			setProducts(payload.products);
		} catch (cause) {
			if (!signal?.aborted) {
				setError(cause instanceof Error ? cause.message : 'The review queue could not be loaded.');
			}
		} finally {
			if (!signal?.aborted) {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		void loadQueue(controller.signal);
		return () => controller.abort();
	}, []);

	const review = async (item: ProductReviewItem, decision: 'approve' | 'reject'): Promise<void> => {
		const reason = (reasons[item.recordId] || '').trim();
		if (decision === 'reject' && !reason) {
			setError('Please enter a rejection reason before rejecting this product.');
			return;
		}

		setBusyId(item.recordId);
		setError('');
		setNotice('');
		try {
			const response = await fetch(`/api/v1/yaschat.admin.products.${decision}`, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					recordId: item.recordId,
					expectedVersion: item.version,
					...(decision === 'reject' ? { reason } : {}),
				}),
			});
			if (!response.ok) {
				throw new Error(response.status === 403 ? 'You do not have permission to review products.' : 'The review action failed. Refresh the queue and try again.');
			}
			const payload = (await response.json()) as ReviewResponse;
			if (payload.success !== true || payload.reviewed !== true) {
				throw new Error('This product may already have been reviewed. The queue has been refreshed.');
			}
			setProducts((current) => current.filter((product) => product.recordId !== item.recordId));
			setNotice(decision === 'approve' ? 'Product approved and removed from the pending queue.' : 'Product rejected and removed from the pending queue.');
			setReasons((current) => {
				const next = { ...current };
				delete next[item.recordId];
				return next;
			});
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : 'The review action failed.');
			void loadQueue();
		} finally {
			setBusyId('');
		}
	};

	return (
		<Page flexDirection='row'>
			<Page>
				<PageHeader title='YasChat · Product Review' />
				<PageContent>
					<Box className={styles}>
						<Box className='yaschat-review'>
							<Box className='yaschat-review-intro'>
								Review products submitted by partners before they appear in the public YasChat catalogue. Approvals and rejections are recorded with the reviewing administrator.
							</Box>
							<Box className='yaschat-review-toolbar'>
								<Button onClick={() => void loadQueue()} disabled={loading || Boolean(busyId)}>Refresh queue</Button>
								<Box color='hint' fontScale='p2'>{products.length} pending product(s)</Box>
							</Box>
							{notice && <Box className='yaschat-review-state' role='status' aria-live='polite'>{notice}</Box>}
							{error && <Box className='yaschat-review-state yaschat-review-error' role='alert'>{error}</Box>}
							{loading ? (
								<Box className='yaschat-review-state' role='status'>Loading pending products…</Box>
							) : products.length === 0 ? (
								<Box className='yaschat-review-state' role='status'>There are no products waiting for review.</Box>
							) : (
								<Box className='yaschat-review-list'>
									{products.map((item) => (
										<Box key={item.recordId} className='yaschat-review-card'>
											<Box>
												{item.product.imageUrl ? <img src={item.product.imageUrl} alt={item.product.title || 'Product'} loading='lazy' /> : <Box className='yaschat-review-state'>No product image</Box>}
											</Box>
											<Box>
												<Box is='h3'>{item.product.title || 'Untitled product'}</Box>
												{item.product.category && <Box color='hint' fontScale='c1'>{item.product.category}</Box>}
												{item.product.description && <Box is='p'>{item.product.description}</Box>}
												{item.product.price && <Box is='p'>{new Intl.NumberFormat(undefined, { style: 'currency', currency: item.product.price.currency }).format(item.product.price.amount)}</Box>}
												<Box is='p'>Partner: {item.product.source || 'Not specified'} · Version: {item.version}</Box>
												{item.product.productUrl && <Box is='p'><a href={item.product.productUrl} target='_blank' rel='noopener noreferrer'>Open product destination</a></Box>}
												<textarea
													className='yaschat-review-reason'
													aria-label={`Rejection reason for ${item.product.title || item.recordId}`}
													maxLength={1000}
													placeholder='Rejection reason (required only when rejecting)'
													value={reasons[item.recordId] || ''}
													onChange={(event) => setReasons((current) => ({ ...current, [item.recordId]: event.currentTarget.value }))}
													disabled={busyId === item.recordId}
												/>
												<Box className='yaschat-review-actions'>
													<Button primary onClick={() => void review(item, 'approve')} disabled={Boolean(busyId)} loading={busyId === item.recordId}>Approve</Button>
													<Button danger onClick={() => void review(item, 'reject')} disabled={Boolean(busyId)} loading={busyId === item.recordId}>Reject</Button>
												</Box>
											</Box>
										</Box>
									))}
								</Box>
							)}
						</Box>
					</Box>
				</PageContent>
			</Page>
		</Page>
	);
};

export default YasChatProductReviewPage;
