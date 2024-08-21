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

export async function fetchGoogleFonts() {
  const apiKey = "AIzaSyCQ0-qoFWiSh-as3YqjRFPDStskCxMLymE"; // Replace with your actual API key
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    googleFonts = data.items.map((font: any, index: number) => ({
      family: font.family,
      category: font.category,
      variants: font.variants,
      subsets: font.subsets,
      version: font.version,
      lastModified: font.lastModified,
      files: font.files,
      popularity: data.items.length - index, // Assuming the API returns fonts sorted by popularity
    }));
  } catch (error) {
    console.error("Error fetching Google Fonts:", error);
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

export function generateFontPair(vibe: string): FontPair {
  let headlineFonts: Font[] = [];
  let bodyFonts: Font[] = [];

  // Filter fonts based on vibe
  switch (vibe.toLowerCase()) {
    case "elegant":
      headlineFonts = googleFonts.filter((font) => font.category === "serif");
      bodyFonts = googleFonts.filter((font) =>
        ["serif", "sans-serif"].includes(font.category)
      );
      break;
    case "minimalist":

    case "modern":
      headlineFonts = googleFonts.filter(
        (font) => font.category === "sans-serif"
      );
      bodyFonts = googleFonts.filter((font) => font.category === "sans-serif");
      break;
    case "playful":
      headlineFonts = googleFonts.filter((font) =>
        ["display", "handwriting"].includes(font.category)
      );
      bodyFonts = googleFonts.filter((font) =>
        ["sans-serif", "serif", "display", "handwriting"].includes(
          font.category
        )
      );
      break;
    case "lucky":
      headlineFonts = googleFonts.filter((font) =>
        ["serif", "sans-serif"].includes(font.category)
      );
      bodyFonts = googleFonts.filter((font) =>
        ["serif", "sans-serif"].includes(font.category)
      );
    default:
      headlineFonts = googleFonts;
      bodyFonts = googleFonts;
  }

  // If no fonts match the vibe, use all fonts
  if (headlineFonts.length === 0) headlineFonts = googleFonts;
  if (bodyFonts.length === 0) bodyFonts = googleFonts;

  const headlineFont =
    headlineFonts[Math.floor(Math.random() * headlineFonts.length)];
  let bodyFont;
  do {
    bodyFont = bodyFonts[Math.floor(Math.random() * bodyFonts.length)];
  } while (bodyFont.family === headlineFont.family);

  return { headlineFont, bodyFont };
}
