import { useId } from 'react';

const YasChatLogo = () => {
	const titleId = useId();
	const descriptionId = useId();
	const gradientId = useId();
	const wordGradientId = useId();

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 640 160'
			role='img'
			aria-labelledby={titleId}
			aria-describedby={descriptionId}
			width='100%'
			height='100%'
		>
			<title id={titleId}>YasChat</title>
			<desc id={descriptionId}>A blue fish leaping through a splash of water beside the YasChat wordmark</desc>
			<defs>
				<linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='1'>
					<stop offset='0' stopColor='#42D7FF' />
					<stop offset='.48' stopColor='#0878E8' />
					<stop offset='1' stopColor='#073A9C' />
				</linearGradient>
				<linearGradient id={wordGradientId} x1='0' y1='0' x2='1' y2='0'>
					<stop stopColor='#102B59' />
					<stop offset='1' stopColor='#0878E8' />
				</linearGradient>
			</defs>
			<path
				d='M18 130c34-5 51-22 68-43 12-15 20-31 34-47-3 24-14 45-30 62 27-12 44-29 61-54-2 34-25 60-54 75 21-2 39-9 58-22-13 26-39 40-70 39-25 0-45-4-67-10z'
				fill='#12BDEB'
			/>
			<path
				d='M34 113c16-19 24-39 30-59M62 125c23-14 36-31 47-51M96 133c25-6 42-17 58-34'
				fill='none'
				stroke='#8CEBFF'
				strokeWidth='5'
				strokeLinecap='round'
			/>
			<path
				d='M54 45c-7-12-4-22 5-25 11-3 17 9 13 20M25 71c-12-9-13-20-4-25 10-5 20 5 18 17'
				fill='none'
				stroke='#14BDEB'
				strokeWidth='7'
				strokeLinecap='round'
			/>
			<path
				d='M70 79c17-30 49-54 83-52 13 1 25 6 34 15l26-9-12 28c-1 22-20 42-48 51-31 10-66-1-83-20z'
				fill={`url(#${gradientId})`}
				stroke='#063B8C'
				strokeWidth='4'
				strokeLinejoin='round'
			/>
			<path d='M174 45l34-18-9 34z' fill='#FF9B32' stroke='#A94E12' strokeWidth='3' strokeLinejoin='round' />
			<path
				d='M113 44c15-18 37-25 56-20-12 5-20 12-26 23 17-8 31-9 43-5-9 19-28 34-51 39-15 3-30 0-42-8 5-11 11-21 20-29z'
				fill='#FF9B32'
			/>
			<path d='M90 78c22 12 49 13 74 2-11 18-28 27-48 26-13-1-25-8-33-18z' fill='#EAFBFF' />
			<circle cx='169' cy='49' r='7' fill='#fff' />
			<circle cx='171' cy='49' r='3.5' fill='#09244D' />
			<path d='M125 83c13 5 25 5 38 1M111 65c9-8 18-13 28-16' fill='none' stroke='#A9F2FF' strokeWidth='4' strokeLinecap='round' />
			<path d='M25 143c45 10 103 8 153-6' fill='none' stroke='#12BDEB' strokeWidth='5' strokeLinecap='round' />
			<text
				x='245'
				y='105'
				fontFamily='Inter, Segoe UI, Arial, sans-serif'
				fontSize='78'
				fontWeight='800'
				letterSpacing='-3'
				fill={`url(#${wordGradientId})`}
			>
				YasChat
			</text>
			<text
				x='250'
				y='135'
				fontFamily='Inter, Segoe UI, Arial, sans-serif'
				fontSize='17'
				fontWeight='600'
				letterSpacing='2.2'
				fill='currentColor'
			>
				CHAT • SHARE • DISCOVER
			</text>
		</svg>
	);
};

export default YasChatLogo;
