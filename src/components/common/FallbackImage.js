import { useState, useEffect } from "react";

// A themed placeholder (matches the rose/gold palette) shown whenever a
// product image is missing, empty, or fails to load.
export const PLACEHOLDER_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="650" viewBox="0 0 500 650">
      <rect width="500" height="650" fill="#faf4e8"/>
      <rect x="90" y="120" width="320" height="420" rx="14" fill="#fdfaf6" stroke="#c5973e" stroke-width="3"/>
      <circle cx="250" cy="270" r="55" fill="none" stroke="#b5446e" stroke-width="4"/>
      <path d="M195 270 Q250 220 305 270 Q250 340 195 270 Z" fill="none" stroke="#b5446e" stroke-width="4"/>
      <line x1="150" y1="400" x2="350" y2="400" stroke="#c5973e" stroke-width="3" stroke-linecap="round"/>
      <line x1="150" y1="430" x2="320" y2="430" stroke="#c5973e" stroke-width="3" stroke-linecap="round"/>
      <text x="250" y="480" font-family="Georgia, serif" font-size="18" fill="#7a6a5e" text-anchor="middle">Image coming soon</text>
    </svg>
  `);

const FallbackImage = ({ src, alt, className, style, loading = "lazy" }) => {
    const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_IMG);

    // Keep in sync if the src prop changes (e.g. list re-renders with new item)
    useEffect(() => {
        setImgSrc(src || PLACEHOLDER_IMG);
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt={alt || ""}
            className={className}
            style={style}
            loading={loading}
            onError={() => setImgSrc(PLACEHOLDER_IMG)}
        />
    );
};

export default FallbackImage;