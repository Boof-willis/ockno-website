'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type MenuToggleProps = React.ComponentProps<'svg'> & {
	open: boolean;
	duration?: number;
};

export function MenuToggleIcon({
	open,
	className,
	fill = 'none',
	stroke = 'currentColor',
	strokeWidth = 2.5,
	strokeLinecap = 'round',
	strokeLinejoin = 'round',
	duration = 500,
	...props
}: MenuToggleProps) {
	return (
		<svg
			strokeWidth={strokeWidth}
			fill={fill}
			stroke={stroke}
			viewBox="0 0 32 32"
			strokeLinecap={strokeLinecap}
			strokeLinejoin={strokeLinejoin}
			className={cn(
				'transition-transform ease-in-out',
				open && '-rotate-45',
				className,
			)}
			style={{
				transitionDuration: `${duration}ms`,
			}}
			{...props}
		>
			{/* Dash values are SVG presentation ATTRIBUTES, not CSS (neither
			    Tailwind arbitrary classes nor inline style). The hamburger and
			    the X are the SAME path, masked down to different segments by the
			    dash — and mobile Safari failed to apply the dash geometry from
			    CSS, so the whole path stroked and both glyphs rendered stacked.
			    Attribute parsing of dash lists is original SVG 1.1 behavior and
			    lands in every engine; attributes sit at the bottom of the
			    cascade, so keep any dash styling OUT of CSS or it will silently
			    override these. Engines that transition presentation-attribute
			    changes still animate the morph via transition-all; those that
			    don't just snap to the correct end state. */}
			<path
				className="transition-all ease-in-out"
				strokeDasharray={open ? '20 300' : '12 63'}
				strokeDashoffset={open ? '-32.42' : '0'}
				style={{
					transitionDuration: `${duration}ms`,
				}}
				d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
			/>
			<path d="M7 16 27 16" />
		</svg>
	);
}
