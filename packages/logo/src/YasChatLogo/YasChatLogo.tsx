import { useId } from 'react';

const YasChatLogo = () => {
	const titleId = useId();
	const descriptionId = useId();
	const gradientId = useId();

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 640 160'
			role='img'
			aria-labelledby={`${titleId} ${descriptionId}`}
			width='100%'
			height='100%'
		>
			<title id={titleId}>YasChat</title>
			<desc id={descriptionId}>YasChat speech bubble logo and wordmark</desc>
			<defs>
				<linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='1'>
					<stop offset='0' stopColor='#635BFF' />
					<stop offset='1' stopColor='#16B8A6' />
				</linearGradient>
			</defs>
			<path
				d='M78 18c-35 0-63 27-63 61v4c0 24 14 45 35 55l-8 18c-2 5 3 10 8 8l34-17h11c35 0 63-27 63-61v-7c0-34-28-61-63-61H78z'
				fill={`url(#${gradientId})`}
			/>
			<circle cx='64' cy='82' r='8' fill='#fff' />
			<circle cx='99' cy='82' r='8' fill='#fff' />
			<circle cx='134' cy='82' r='8' fill='#fff' />
			<text
				x='190'
				y='108'
				fontFamily='Inter, Segoe UI, Arial, sans-serif'
				fontSize='76'
				fontWeight='750'
				letterSpacing='-3'
				fill='currentColor'
			>
				YasChat
			</text>
		</svg>
	);
};

export default YasChatLogo;
