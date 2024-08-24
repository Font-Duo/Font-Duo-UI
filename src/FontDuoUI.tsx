import { h, Fragment } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
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
import { motion } from "framer-motion";

type Styles = { [key: string]: string };

interface TextAreaProps {
  className?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // Add any other props you need
}

interface CustomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  secondary?: boolean;
  isMore?: boolean;
  isSelected?: boolean;
  tert?: boolean;
}

interface EmptyStateProps {
  onVibeSelect: (vibe: string) => void;
}

const CustomButton = ({
  children,
  onClick,
  secondary,
  isSelected,
}: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      class={`${(styles as Styles)["custom-button"]} ${
        secondary ? (styles as Styles).secondary : (styles as Styles).primary
      } ${isSelected ? (styles as Styles).selected : ""}`}
    >
      {children}
    </button>
  );
};

const EmptyState = ({ onVibeSelect }: EmptyStateProps): h.JSX.Element => (
  <div className={styles.emptyState}>
    <h2>Craft your perfect font pair ✨</h2>
    <p>Choose a vibe and let's create something awesome</p>
    <div className={styles.vibeButtons}>
      {[
        { name: "Modern" },
        { name: "Elegant" },
        { name: "Mono" },
        { name: "Playful" },
      ].map((vibe) => (
        <button
          key={vibe.name}
          onClick={() => onVibeSelect(vibe.name)}
          class={`${styles.vibeButton} ${styles.equalWidth}`}
        >
          {vibe.name}
        </button>
      ))}
    </div>
  </div>
);

function FontDuoUI() {
  const [isVibeSelected, setIsVibeSelected] = useState(false);
  const [vibe, setVibe] = useState("Elegant");
  const [isGeneratingLucky, setIsGeneratingLucky] = useState(false);

  console.log("isVibeSelected:", isVibeSelected);
  console.log("vibe:", vibe);

  const [currentPair, setCurrentPair] = useState<FontPair | null>(null);
  const [headlineText, setHeadlineText] = useState(
    "This is a sample headline text"
  );
  const [bodyText, setBodyText] = useState(
    "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. It involves choosing typefaces, point sizes, line lengths, line-spacing, and letter- spacing, and adjusting the space between pairs of letters."
  );
  const [headlineLocked, setHeadlineLocked] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const headlineRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initializeFonts() {
      await fetchGoogleFonts();
    }
    initializeFonts();
  }, []);

  useEffect(() => {
    if (isVibeSelected) {
      generateNewPair();
    }
  }, [vibe, isVibeSelected]);

  useEffect(() => {
    adjustTextareaHeight(headlineRef.current, containerRef.current);
    adjustTextareaHeight(bodyRef.current, containerRef.current);
  }, []);

  useEffect(() => {
    if (isVibeSelected) {
      adjustTextareaHeight(headlineRef.current, containerRef.current);
      adjustTextareaHeight(bodyRef.current, containerRef.current);
    }
  }, [headlineText, bodyText, isVibeSelected]);

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null, container: HTMLElement | null) => {
    if (textarea && container) {
      const scrollTop = container.scrollTop;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, textarea.clientHeight)}px`;
      container.scrollTop = scrollTop;
    }
  };

  const generateNewPair = async () => {
    setIsGenerating(true);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
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
    setIsLoading(false);
    setIsGenerating(false);
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
    console.log("handleVibeChange called with:", newVibe);
    setVibe(newVibe);
    setIsVibeSelected(true);
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
    setIsGeneratingLucky(true);
    setVibe("lucky");
    generateNewPair().then(() => {
      setIsGeneratingLucky(false);
    });
  };

  const toggleLock = (type: "headline" | "body") => {
    if (type === "headline") {
      setHeadlineLocked((prev) => !prev);
    } else {
      setBodyLocked((prev) => !prev);
    }
  };

  const handleHeadlineChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setHeadlineText(target.value);
    adjustTextareaHeight(target, containerRef.current);
  };

  const handleBodyChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setBodyText(target.value);
    adjustTextareaHeight(target, containerRef.current);
  };

  return (
    <Container
      style={{
        padding: 0,
        marginTop: "-12px",
      }}
      space="medium"
    >
      {!isVibeSelected ? (
        <EmptyState onVibeSelect={handleVibeChange} />
      ) : (
        <>
          <VerticalSpace space="small" />
          <div
            ref={containerRef}
            style={{
              padding: "8px 16px 8px 16px",
              backgroundColor: "#222222",
              height: "256px",
              overflowY: "scroll",
              position: "relative",
            }}
          >
            {isGeneratingLucky ? (
              <div 
                style={{ 
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(34, 34, 34, 1)",
                }}
              >
                <Text style={{ color: "#ffffff" }}>Generating perfect font pair...</Text>
              </div>
            ) : (
              <>
                <div class={styles.top__column}>
                  <p class={styles.top__column_text}>
                    {currentPair?.headlineFont.family || "Inter"}
                  </p>
                  <div class={styles.top__column_icon_container}>
                    <button
                      class={styles.custom_icon}
                      onClick={() => {
                        toggleLock("headline");
                      }}
                    >
                      {headlineLocked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>
                    <span style={{ fontSize: "8px" }}>•</span>
                    <button
                      class={styles.custom_icon}
                      onClick={regenerateHeadlineFont}
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </div>
                <div class={styles.top__column_textarea}>
                  <textarea
                    ref={headlineRef}
                    class={styles.top__column_textarea}
                    value={headlineText}
                    onInput={handleHeadlineChange}
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
                <textarea
                  ref={bodyRef}
                  class={styles.mid__column_textarea}
                  value={bodyText}
                  onInput={handleBodyChange}
                  style={{ fontFamily: currentPair?.bodyFont.family }}
                />
              </>
            )}
          </div>
          <VerticalSpace space="small" />
          <div class={styles.bottom__button}>
            <p class={styles.bottom__button_text}>Choose your vibe:</p>
            <div class={styles.vibeButtons}>
              {["Modern", "Elegant", "Mono", "Playful"].map((v) => (
                <CustomButton
                  key={v}
                  onClick={() => handleVibeChange(v)}
                  isSelected={vibe === v}
                  secondary={vibe !== v}
                >
                  {v}
                </CustomButton>
              ))}
            </div>
          </div>
          <VerticalSpace space="small" />
          <div style={{ padding: "0 16px" }}>
            <button
              class={styles.button__fullWidth}
              onClick={handleFeelingLucky}
            >
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
        </>
      )}
    </Container>
  );
}

export default FontDuoUI;