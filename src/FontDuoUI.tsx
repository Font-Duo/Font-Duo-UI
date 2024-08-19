import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import {
  Button,
  VerticalSpace,
  Text,
  Columns,
  IconButton,
  Container,
  Muted,
  Stack,
  render,
} from "@create-figma-plugin/ui";
import { Lock, RefreshCw, ChevronDown, Unlock } from "lucide-react";
import "./styles.css";
import styles from "./styles.css";
import { fetchGoogleFonts, generateFontPair, FontPair } from "./fontDatabase";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  secondary: boolean;
  isMore?: boolean;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  secondary,
  isMore,
  fullWidth,
}) => {
  return (
    <button
      onClick={onClick}
      class={`${styles["custom-button"]} ${
        secondary ? "secondary" : isMore ? "fullWidth" : "primary"
      }`}
    >
      <span class={styles.button_content}>
        {children}
        {isMore && <ChevronDown size={12} />}
      </span>
    </button>
  );
};

function FontDuoUI() {
  const [vibe, setVibe] = useState("Elegant");
  const [currentPair, setCurrentPair] = useState<FontPair | null>(null);
  const [headlineText, setHeadlineText] = useState(
    "This is a sample headline text"
  );
  const [bodyText, setBodyText] = useState(
    "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. It involves choosing typefaces, point sizes, line lengths, line-spacing, and letter- spacing, and adjusting the space between pairs of letters."
  );
  const [headlineLocked, setHeadlineLocked] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);

  // Handle Icon Lock/Unlock Toggle

  useEffect(() => {
    async function initializeFonts() {
      await fetchGoogleFonts();
      generateNewPair();
    }
    initializeFonts();
  }, []);

  const generateNewPair = () => {
    const newPair = generateFontPair(vibe);
    setCurrentPair((prevPair) => {
      if (!prevPair) return newPair;
      return {
        headlineFont: headlineLocked
          ? prevPair.headlineFont
          : newPair.headlineFont,
        bodyFont: bodyLocked ? prevPair.bodyFont : newPair.bodyFont,
      };
    });
    loadFont(newPair.headlineFont.family);
    loadFont(newPair.bodyFont.family);
  };

  const loadFont = (fontFamily: string) => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css?family=${fontFamily.replace(
      " ",
      "+"
    )}`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  };

  const handleVibeChange = (newVibe: string) => {
    setVibe(newVibe);
    generateNewPair();
  };

  const regenerateHeadlineFont = () => {
    if (!headlineLocked) {
      const newPair = generateFontPair(vibe);
      setCurrentPair((prevPair) =>
        prevPair
          ? {
              ...prevPair,
              headlineFont: newPair.headlineFont,
            }
          : newPair
      );
      loadFont(newPair.headlineFont.family);
    }
  };

  const regenerateBodyFont = () => {
    if (!bodyLocked) {
      const newPair = generateFontPair(vibe);
      setCurrentPair((prevPair) =>
        prevPair
          ? {
              ...prevPair,
              bodyFont: newPair.bodyFont,
            }
          : newPair
      );
      loadFont(newPair.bodyFont.family);
    }
  };

  const handleFeelingLucky = () => {
    const vibes = ["Elegant", "Minimalist", "Playful", "Modern"];
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
    setVibe(randomVibe);
    generateNewPair();
  };

  const toggleLock = (type: "headline" | "body") => {
    if (type === "headline") {
      setHeadlineLocked((prev) => !prev);
    } else {
      setBodyLocked((prev) => !prev);
    }
  };

  return (
    <Container
      style={{
        padding: 0,
        marginTop: "-12px",
      }}
      space="medium"
    >
      <VerticalSpace space="small" />
      <div
        style={{
          padding: "8px 16px 8px 16px",
          backgroundColor: "#222222",
          height: "256px",
          overflowY: "scroll",
        }}
      >
        <div class={styles.top__column}>
          <p class={styles.top__column_text}>
            {currentPair?.headlineFont.family || "Inter"}
          </p>
          <div class={styles.top__column_icon_container}>
            {/* Something here */}
            <button
              class={styles.custom_icon}
              onClick={() => {
                toggleLock("headline");
              }}
            >
              {headlineLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>
            <span style={{ fontSize: "8px" }}>•</span>
            <button class={styles.custom_icon} onClick={regenerateHeadlineFont}>
              <RefreshCw size={12} />
            </button>
          </div>
        </div>
        <div class={styles.top__column_textarea_container}>
          <textarea
            class={styles.top__column_textarea}
            value={headlineText}
            onInput={(e) =>
              setHeadlineText((e.target as HTMLTextAreaElement).value)
            }
            style={{ fontFamily: currentPair?.headlineFont.family }}
          />
        </div>
        <div class={styles.mid__column}>
          <p class={styles.mid__column_text}>
            {currentPair?.bodyFont.family || "News Gothic"}
          </p>
          <div class={styles.mid__column_icon_container}>
            <button
              class={styles.custom_icon}
              onClick={() => {
                toggleLock("body");
              }}
            >
              {bodyLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>

            <span style={{ fontSize: "8px" }}>•</span>
            <button class={styles.custom_icon} onClick={regenerateBodyFont}>
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        <p
          class={styles.mid__column_text_typography}
          style={{ fontFamily: currentPair?.bodyFont.family }}
        >
          {bodyText}
        </p>
      </div>

      <VerticalSpace space="large" />
      <div class={styles.bottom__button}>
        <p class={styles.bottom__button_text}>Choose your vibe:</p>
        <div class={styles.bottom__button_container}>
          {["Elegant", "Minimalist", "More"].map((v) => (
            <CustomButton
              key={v}
              onClick={() => handleVibeChange(v)}
              secondary={vibe !== v}
              isMore={v === "More"}
            >
              {v}
            </CustomButton>
          ))}
        </div>
      </div>
      <VerticalSpace space="small" />
      <div style={{ padding: "0 16px" }}>
        <button class={styles.button__fullWidth} onClick={handleFeelingLucky}>
          <RefreshCw size={12} style={{ marginRight: "8px" }} />
          I'm feeling lucky
        </button>
      </div>

      <VerticalSpace space="small" />
      <div
        style={{
          padding: "0 16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-8px",
        }}
      >
        <p class={styles.bottom__tip}>
          💡 Tip: Edit the preview text to see how your content looks with
          different font pairings.
        </p>
      </div>
    </Container>
  );
}

export default FontDuoUI;
