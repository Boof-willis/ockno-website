import { ICONS } from "@/lib/icon-data";

type IconProps = {
  /** "set:name", e.g. "solar:bolt-linear". Must be one the site already uses, or
   *  be added by re-running `node scripts/build-icons.mjs`. */
  icon: string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * An icon as inline SVG, drawn from lib/icon-data.ts (generated at authoring
 * time from the Iconify sets). No client JS and no network request: the old
 * @iconify/react component fetched each icon from Iconify's API in the
 * visitor's browser, so icons popped in late and depended on a third party.
 */
export function Icon({ icon, width = "1em", className, style }: IconProps) {
  const data = ICONS[icon];
  if (!data) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Icon "${icon}" is not in lib/icon-data.ts. Run: node scripts/build-icons.mjs`);
    }
    return null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${data.width} ${data.height}`}
      width={width}
      height={width}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: data.body }}
    />
  );
}

export default Icon;
