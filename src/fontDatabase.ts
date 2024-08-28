export interface Font {
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  popularity: number;
}

export interface FontPair {
  headlineFont: Font;
  bodyFont: Font;
}

let googleFonts: Font[] = [];

import { GOOGLE_FONTS_API_KEY } from './config';

// Load environment variables
export async function fetchGoogleFonts() {
  const apiKey = GOOGLE_FONTS_API_KEY;
  if (!apiKey) {
    console.error("API key not found");
    return;
  }
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;

  try {
    console.log("Fetching fonts from Google Fonts API...");
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      throw new Error("Unexpected API response format");
    }

    console.log(`Received ${data.items.length} fonts from API`);

    googleFonts = data.items
      .filter((font: any) => {
        // Check if the font has a weight less than 400
        return font.variants.some((variant: string) => {
          const weight = parseInt(variant);
          return !isNaN(weight) && weight < 400;
        });
      })
      .map((font: any, index: number) => ({
        family: font.family,
        category: font.category,
        variants: font.variants,
        subsets: font.subsets,
        version: font.version,
        lastModified: font.lastModified,
        files: font.files,
        popularity: index + 1, // This now represents the font's rank within the filtered list
      }));
    
    console.log(`After filtering, ${googleFonts.length} fonts remain`);
    console.log("First 5 fonts:", googleFonts.slice(0, 5).map(f => f.family));
  } catch (error) {
    console.error("Error fetching Google Fonts:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    console.log("Falling back to hardcoded font list");
    // Fallback to hardcoded fonts if the API call fails
    googleFonts = [
      {
        family: "Roboto",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 1,
      },
      {
        family: "Open Sans",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 2,
      },
      {
        family: "Lato",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 3,
      },
      {
        family: "Montserrat",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 4,
      },
      {
        family: "Roboto Condensed",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 5,
      },
      {
        family: "Source Sans Pro",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 6,
      },
      {
        family: "Oswald",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 7,
      },
      {
        family: "Roboto Mono",
        category: "monospace",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 8,
      },
      {
        family: "Raleway",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 9,
      },
      {
        family: "Noto Sans",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 10,
      },
      {
        family: "Roboto Slab",
        category: "serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 11,
      },
      {
        family: "Merriweather",
        category: "serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 12,
      },
      {
        family: "PT Sans",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 13,
      },
      {
        family: "Ubuntu",
        category: "sans-serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 14,
      },
      {
        family: "Playfair Display",
        category: "serif",
        variants: [],
        subsets: [],
        version: "",
        lastModified: "",
        files: {},
        popularity: 15,
      },
    ];
  }
}

function isLikelyAllCaps(font: Font): boolean {
  const allCapsKeywords = ["caps", "uppercase", "majuscule"];
  const iconKeywords = ["icon", "material", "fontawesome", "glyphicon"];
  return (
    allCapsKeywords.some((keyword) =>
      font.family.toLowerCase().includes(keyword)
    ) ||
    iconKeywords.some((keyword) => font.family.toLowerCase().includes(keyword))
  );
}

export function generateFontPair(vibe: string): FontPair {
  console.log("Generating font pair for vibe:", vibe);
  let headlineFonts: Font[] = [];
  let bodyFonts: Font[] = [];

  // Filter fonts based on vibe
  switch (vibe.toLowerCase()) {
    case "elegant":
      headlineFonts = googleFonts.filter(
        (font) => font.category === "serif" && !isLikelyAllCaps(font)
      );
      bodyFonts = googleFonts.filter(
        (font) =>
          ["serif", "sans-serif"].includes(font.category) &&
          !isLikelyAllCaps(font)
      );
      break;
    case "mono":
      const monoFonts = googleFonts.filter(
        (font) =>
          font.category === "monospace" ||
          (font.family.toLowerCase().includes("mono") && !isLikelyAllCaps(font))
      );
      headlineFonts = monoFonts;
      bodyFonts = monoFonts;
      break;
    case "modern":
      headlineFonts = googleFonts
        .filter(
          (font) => font.category === "sans-serif" && !isLikelyAllCaps(font)
        )
        .sort((a, b) => a.popularity - b.popularity)
        .slice(0, 200);
      bodyFonts = googleFonts
        .filter(
          (font) => font.category === "sans-serif" && !isLikelyAllCaps(font)
        )
        .sort((a, b) => a.popularity - b.popularity)
        .slice(0, 200);
      
      console.log(`Modern vibe - Headline fonts: ${headlineFonts.length}, Body fonts: ${bodyFonts.length}`);
      console.log("Headline fonts:", headlineFonts.map(f => f.family));
      console.log("Body fonts:", bodyFonts.map(f => f.family));
      break;
    case "playful":
      headlineFonts = googleFonts.filter(
        (font) =>
          ["display", "handwriting"].includes(font.category) &&
          !isLikelyAllCaps(font)
      );
      bodyFonts = googleFonts.filter(
        (font) =>
          ["sans-serif", "serif"].includes(font.category) &&
          !isLikelyAllCaps(font)
      );
      break;
    case "lucky":
      headlineFonts = googleFonts.filter(
        (font) =>
          ["serif", "sans-serif"].includes(font.category) &&
          !isLikelyAllCaps(font)
      );
      bodyFonts = googleFonts.filter(
        (font) =>
          ["serif", "sans-serif"].includes(font.category) &&
          !isLikelyAllCaps(font)
      );
      break;
    default:
      headlineFonts = googleFonts.filter((font) => !isLikelyAllCaps(font));
      bodyFonts = googleFonts.filter((font) => !isLikelyAllCaps(font));
  }

  // If no fonts match the vibe, use all fonts except all-caps and icon fonts
  if (headlineFonts.length === 0)
    headlineFonts = googleFonts.filter((font) => !isLikelyAllCaps(font));
  if (bodyFonts.length === 0)
    bodyFonts = googleFonts.filter((font) => !isLikelyAllCaps(font));

  const headlineFont =
    headlineFonts[Math.floor(Math.random() * headlineFonts.length)];
  let bodyFont;
  do {
    bodyFont = bodyFonts[Math.floor(Math.random() * bodyFonts.length)];
  } while (bodyFont.family === headlineFont.family);

  console.log("Selected headline font:", headlineFont);
  console.log("Selected body font:", bodyFont);

  return {
    headlineFont: headlineFont,
    bodyFont: bodyFont
  };
}