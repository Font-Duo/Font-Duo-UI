// Preact imports
import { h, Fragment } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";

// UI component imports
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

// Icon imports
import { Lock, RefreshCw, ChevronDown, Unlock, Zap } from "lucide-react";

// Style imports
import "./styles.css";
import styles from "./styles.css";

// Custom component and utility imports
import { fetchGoogleFonts, generateFontPair, FontPair } from "./fontDatabase";
import EmptyState from "./EmptyState";

// Animation library import
import { motion } from "framer-motion";

// Type definitions
type Styles = { [key: string]: string };

interface TextAreaProps {
  className?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

// Main FontDuoUI component
function FontDuoUI() {
  // State variables
  const [isVibeSelected, setIsVibeSelected] = useState(false);
  const [vibe, setVibe] = useState("Elegant");
  const [currentPair, setCurrentPair] = useState<FontPair | null>(null);
  const [headlineText, setHeadlineText] = useState("This is a sample headline text");
  const [bodyText, setBodyText] = useState("Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.");
  const [headlineLocked, setHeadlineLocked] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingLucky, setIsGeneratingLucky] = useState(false);

  // Refs
  const headlineRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch Google Fonts on mount
  useEffect(() => {
    async function initializeFonts() {
      await fetchGoogleFonts();
    }
    initializeFonts();
  }, []);

  // Generate new font pair when vibe is selected
  useEffect(() => {
    if (isVibeSelected) {
      generateNewPair();
    }
  }, [vibe, isVibeSelected]);

  // Adjust textarea height when text changes
  useEffect(() => {
    if (isVibeSelected) {
      adjustTextareaHeight(headlineRef.current);
      adjustTextareaHeight(bodyRef.current);
    }
  }, [headlineText, bodyText, isVibeSelected]);

  // Adjust textarea height function
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Generate new font pair
  const generateNewPair = async () => {
    setIsGenerating(true);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPair = generateFontPair(vibe);
    setCurrentPair((prevPair) => {
      if (!prevPair) return newPair;
      return {
        headlineFont: headlineLocked ? prevPair.headlineFont : newPair.headlineFont,
        bodyFont: bodyLocked ? prevPair.bodyFont : newPair.bodyFont,
      };
    });
    loadFont(newPair.headlineFont.family);
    loadFont(newPair.bodyFont.family);
    setIsLoading(false);
    setIsGenerating(false);
  };

  // Load font from Google Fonts
  const loadFont = (fontFamily: string) => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css?family=${fontFamily.replace(" ", "+")}`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  };

  // Handle vibe change
  const handleVibeChange = (newVibe: string) => {
    console.log("handleVibeChange called with:", newVibe);
    setVibe(newVibe);
    setIsVibeSelected(true);
    generateNewPair();
  };

  // Regenerate headline font
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

  // Regenerate body font
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

  // Handle "I'm feeling lucky" button click
  const handleFeelingLucky = () => {
    setIsGeneratingLucky(true);
    setVibe("lucky");
    generateNewPair().then(() => {
      setIsGeneratingLucky(false);
    });
  };

  // Toggle lock for headline or body
  const toggleLock = (type: "headline" | "body") => {
    if (type === "headline") {
      setHeadlineLocked((prev) => !prev);
    } else {
      setBodyLocked((prev) => !prev);
    }
  };

  // Handle headline text change
  const handleHeadlineChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setHeadlineText(target.value);
    adjustTextareaHeight(target);
  };

  // Handle body text change
  const handleBodyChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setBodyText(target.value);
    adjustTextareaHeight(target);
  };

  // Handle apply button click
  const handleApply = () => {
    console.log("Apply button clicked");
  };

  return (
    <Container space="medium" style={{ padding: 0, marginTop: "-12px" }}>
      {!isVibeSelected ? (
        <EmptyState onVibeSelect={handleVibeChange} />
      ) : (
        <div className={styles['main-content-wrapper']}>
          {/* Font pair display container */}
          <div 
            ref={containerRef} 
            className={styles['preview-container']}
          >
            {isGeneratingLucky ? (
              // Overlay when generating a "lucky" font pair
              <div style={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                backgroundColor: "rgba(34, 34, 34, 1)" 
              }}>
                <Text style={{ color: "#ffffff" }}>Generating perfect font pair...</Text>
              </div>
            ) : (
              // Font pair display
              <div className={styles["text-container"]}>
                {/* Headline font section */}
                <div className={styles["headline-column"]}>
                  <p className={styles["headline-font-name"]}>
                    {currentPair?.headlineFont.family || "Inter"}
                  </p>
                  <div className={styles["headline-controls"]}>
                    {/* Lock/Unlock button for headline font */}
                    <button
                      className={styles.custom_icon}
                      onClick={() => toggleLock("headline")}
                    >
                      {headlineLocked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>
                    <span style={{ fontSize: "8px" }}>•</span>
                    {/* Regenerate headline font button */}
                    <button className={styles.custom_icon} onClick={regenerateHeadlineFont}>
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </div>
                {/* Headline text input */}
                <textarea
                  ref={headlineRef}
                  className={styles["headline-textarea"]}
                  value={headlineText}
                  onInput={handleHeadlineChange}
                  style={{ fontFamily: currentPair?.headlineFont.family }}
                />
                
                {/* Body font section */}
                <div className={styles["body-column"]}>
                  <p className={styles["body-font-name"]}>
                    {currentPair?.bodyFont.family || "News Gothic"}
                  </p>
                  <div className={styles["body-controls"]}>
                    {/* Lock/Unlock button for body font */}
                    <button
                      className={styles.custom_icon}
                      onClick={() => toggleLock("body")}
                    >
                      {bodyLocked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>
                    <span style={{ fontSize: "8px" }}>•</span>
                    {/* Regenerate body font button */}
                    <button className={styles.custom_icon} onClick={regenerateBodyFont}>
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </div>
                {/* Body text input */}
                <textarea
                  ref={bodyRef}
                  className={styles["body-textarea"]}
                  value={bodyText}
                  onInput={handleBodyChange}
                  style={{ fontFamily: currentPair?.bodyFont.family }}
                />
              </div>
            )}
          </div>

          {/* Vibe container */}
          <div className={styles["vibe-container"]}>
            <p className={styles["vibe-title"]}>Choose your vibe:</p>
            <div className={styles["vibe-buttons-row"]}>
              {["Modern", "Elegant"].map((v) => (
                <button
                  key={v}
                  onClick={() => handleVibeChange(v)}
                  className={`${styles['vibe-button']} ${vibe === v ? styles.selected : ''}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={handleFeelingLucky}
              className={styles['lucky-button']}
            >
              <RefreshCw size={12} style={{ marginRight: "8px" }} />
              I'm feeling lucky
            </button>
            {/* Apply button */}
            <button 
              className={styles['apply-button']} 
              onClick={handleApply}
            >
              <Zap size={12} style={{ marginRight: "8px" }} />
              Apply
            </button>
          </div>

          {/* Tip container */}
          <div className={styles["tip-container"]}>
            <p className={styles["tip-text"]}>
              💡 Tip: Select up to 2 text nodes - one for headline and one for body text.
            </p>
            <p className={styles["nodes-selected"]}>
                2 text nodes selected
            </p>
          </div>
        </div>
      )}
    </Container>
  );
}

export default FontDuoUI;