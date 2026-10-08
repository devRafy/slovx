const BASE = import.meta.env.BASE_URL;

// variant "light" = white wordmark for dark backgrounds, "dark" = dark wordmark for light backgrounds.
export default function Logo({ variant = 'light', className = 'h-10' }) {
  return (
    <img
      src={`${BASE}logo-${variant}.png`}
      alt="SlovX"
      className={`${className} w-auto select-none`}
      draggable="false"
    />
  );
}
