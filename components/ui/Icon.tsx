import { Icon as Iconify, type IconProps as IconifyProps } from "@iconify/react";

type IconProps = {
  icon: string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
} & Omit<IconifyProps, "icon">;

/**
 * Thin wrapper over @iconify/react so component markup reads like the original
 * `<iconify-icon icon="..." width="..." />` usage — no CDN web component needed.
 */
export function Icon({ icon, width, className, style, ...rest }: IconProps) {
  return (
    <Iconify
      icon={icon}
      width={width}
      height={width}
      className={className}
      style={style}
      {...rest}
    />
  );
}

export default Icon;
