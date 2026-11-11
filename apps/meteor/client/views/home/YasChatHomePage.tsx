import { Box } from '@rocket.chat/fuselage';
import { Page, PageScrollableContent } from '@rocket.chat/ui-client';
import { css } from '@rocket.chat/css-in-js';

const homeStyles = css`
	.yaschat-home {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 24px;
		box-sizing: border-box;
	}
	.yaschat-hero {
		padding: 28px;
		border-radius: 18px;
		background: linear-gradient(120deg, #182b63 0%, #3949ab 58%, #6b4fd3 100%);
		color: #fff;
	}
	.yaschat-eyebrow {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: .12em;
		text-transform: uppercase;
		opacity: .82;
	}
	.yaschat-hero h1 {
		margin: 10px 0 8px;
		font-size: clamp(25px, 4vw, 38px);
		line-height: 1.15;
	}
	.yaschat-hero p {
		max-width: 620px;
		margin: 0;
		line-height: 1.6;
		opacity: .9;
	}
	.yaschat-section-title {
		margin: 28px 0 14px;
		font-size: 19px;
		font-weight: 700;
		color: var(--rcx-color-foreground, #20242b);
	}
	.yaschat-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
	}
	.yaschat-feature {
		min-width: 0;
		padding: 18px;
		border: 1px solid var(--rcx-color-stroke-extra-light, #e5e7eb);
		border-radius: 14px;
		background: var(--rcx-color-surface, #fff);
	}
	.yaschat-feature-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		margin-bottom: 12px;
		border-radius: 11px;
		background: #eef0ff;
		color: #3949ab;
		font-size: 18px;
		font-weight: 700;
	}
	.yaschat-feature h3 {
		margin: 0 0 6px;
		font-size: 15px;
	}
	.yaschat-feature p {
		margin: 0;
		color: var(--rcx-color-foreground-secondary, #687080);
		font-size: 13px;
		line-height: 1.5;
	}
	.yaschat-feed-placeholder {
		padding: 20px;
		border: 1px dashed var(--rcx-color-stroke-extra-light, #cfd3dc);
		border-radius: 14px;
		background: var(--rcx-color-surface, #fff);
		color: var(--rcx-color-foreground-secondary, #687080);
		line-height: 1.6;
	}
	@media (max-width: 900px) {
		.yaschat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
	@media (max-width: 600px) {
		.yaschat-home { padding: 16px; }
		.yaschat-hero { padding: 22px 18px; border-radius: 14px; }
		.yaschat-grid { grid-template-columns: 1fr; gap: 10px; }
		.yaschat-feature { padding: 15px; }
	}
`;

const features = [
	{ mark: '⌕', title: 'Discover products', description: 'Find products from supported affiliate partners. Verified catalogue data will appear here when connected.' },
	{ mark: '✎', title: 'Read honest reviews', description: 'Compare product details and evidence-backed community feedback, without invented ratings.' },
	{ mark: '◎', title: 'Join communities', description: 'Discuss products, ask questions and share useful experiences with other members.' },
	{ mark: '↗', title: 'Share and earn', description: 'Eligible referral sharing and reward tracking will be introduced after partner and payout rules are configured.' },
];

const YasChatHomePage = () => (
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
				<Box is='h2' id='yaschat-feed-title' className='yaschat-section-title'>Your community feed</Box>
				<Box className='yaschat-feed-placeholder' role='region' aria-labelledby='yaschat-feed-title'>
					The feed will show posts from For You, Following, Worldwide and Questions. Community posts and translated content will be connected in a later stage. No sample posts or fabricated activity are shown here.
				</Box>
			</Box>
		</PageScrollableContent>
	</Page>
);

export default YasChatHomePage;
