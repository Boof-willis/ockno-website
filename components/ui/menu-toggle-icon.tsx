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
			{/* Dash values are set inline rather than via Tailwind arbitrary
			    classes ([stroke-dasharray:12_63]). Both icons showed at once in
			    mobile Safari: the hamburger and the X are the SAME path, masked
			    down to different segments by the dash — so if those declarations
			    don't land, the whole path strokes and you see both at once.
			    Inline style is the most reliable way to set SVG geometry
			    properties, and even where the transition can't interpolate the
			    end state is still correct. The closed state also declares an
			    explicit dashoffset (it was previously unset) so both ends of the
			    transition are defined instead of animating from a default. */}
			<path
				className="transition-all ease-in-out"
				style={{
					transitionDuration: `${duration}ms`,
					strokeDasharray: open ? '20 300' : '12 63',
					strokeDashoffset: open ? '-32.42px' : '0px',
				}}
				d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
			/>
			<path d="M7 16 27 16" />
		</svg>
	);
}
