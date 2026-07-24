import { useState, useEffect } from "react";

// Real, license-free ethnic-wear fashion photos (Unsplash License — free for
// commercial use, no attribution required), each individually verified.
// Used as fallbacks when a product's own image is missing or fails to load.
const PHOTO_POOL = [
    "https://images.unsplash.com/photo-1614886137926-0e6a4f2dfc22?w=600&q=75",
    "https://images.unsplash.com/photo-1604502071830-b5e8dce44f83?w=600&q=75",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=75",
    "https://images.unsplash.com/photo-1605902711622-cfb43c4437b1?w=600&q=75",
    "https://images.unsplash.com/photo-1570382667048-23b368c4c24a?w=600&q=75",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=75",
    "https://images.unsplash.com/photo-1745482036066-5d215ed6b910?w=600&q=75",
    "https://images.unsplash.com/photo-1645862755924-9f4e7f200b83?w=600&q=75",
    "https://images.unsplash.com/photo-1693336429270-094637e16d38?w=600&q=75",
    "https://images.unsplash.com/photo-1769500804057-ca1391bf4617?w=600&q=75",
    "https://images.unsplash.com/photo-1654764746225-e63f5e90facd?w=600&q=75",
];

// A themed SVG placeholder, used only as a last resort if even the picked
// fallback photo fails to load (e.g. no network at all).
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

const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

// If `index` is given (the item's position in whatever list is being
// rendered), use it directly — this guarantees two items sitting next to
// each other in a grid never show the same fallback photo, since consecutive
// indexes always land on different pool entries. Falls back to a hash of the
// alt text when no index is available (e.g. one-off images).
const pickFallback = (seed, index) => {
    if (typeof index === "number") {
        return PHOTO_POOL[index % PHOTO_POOL.length];
    }
    const str = String(seed || "product");
    return PHOTO_POOL[hashString(str) % PHOTO_POOL.length];
};

const FallbackImage = ({ src, alt, index, className, style, loading = "lazy" }) => {
    const fallback = pickFallback(alt, index);
    const [imgSrc, setImgSrc] = useState(src || fallback);
    const [usedFallback, setUsedFallback] = useState(!src);

    // Keep in sync if the src/index props change (e.g. list re-renders)
    useEffect(() => {
        setImgSrc(src || fallback);
        setUsedFallback(!src);
        // eslint-disable-next-line
    }, [src, index]);

    const handleError = () => {
        if (!usedFallback) {
            // Real image failed — try the unique themed photo fallback first.
            setImgSrc(fallback);
            setUsedFallback(true);
        } else {
            // Even the fallback photo failed (e.g. fully offline) — final SVG.
            setImgSrc(PLACEHOLDER_IMG);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt || ""}
            className={className}
            style={style}
            loading={loading}
            onError={handleError}
        />
    );
};

export default FallbackImage;