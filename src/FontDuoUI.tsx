import { h } from "preact";
import { useState } from "preact/hooks";
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
import { Lock, RefreshCw, ChevronDown } from "lucide-react";
import "./styles.css";
import styles from "./styles.css";

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
        }}
      >
        <div class={styles.top__column}>
          <p class={styles.top__column_text}>Inter</p>
          <div class={styles.top__column_icon_container}>
            <IconButton onClick={() => {}}>
              <Lock size={12} />
            </IconButton>
            <span
              style={{
                fontSize: "8px",
              }}
            >
              •
            </span>
            <IconButton onClick={() => {}}>
              <RefreshCw size={12} />
            </IconButton>
          </div>
        </div>
        <div class={styles.top__column_textarea_container}>
          <textarea class={styles.top__column_textarea}>
            This is a sample headline text
          </textarea>
        </div>
        <div class={styles.mid__column}>
          <p class={styles.mid__column_text}>News Gothic</p>
          <div class={styles.mid__column_icon_container}>
            <IconButton onClick={() => {}}>
              <Lock size={12} />
            </IconButton>
            <span
              style={{
                fontSize: "8px",
              }}
            >
              •
            </span>
            <IconButton onClick={() => {}}>
              <RefreshCw size={12} />
            </IconButton>
          </div>
        </div>

        <p class={styles.mid__column_text_typography}>
          Typography is the art and technique of arranging type to make written
          language legible, readable, and appealing when displayed. It involves
          choosing typefaces, point sizes, line lengths, line-spacing, and
          letter- spacing, and adjusting the space between pairs of letters.
        </p>
      </div>

      <VerticalSpace space="large" />
      <div class={styles.bottom__button}>
        <p class={styles.bottom__button_text}>Choose your vibe:</p>
        <div class={styles.bottom__button_container}>
          {["Elegant", "Minimalist", "More"].map((v) => (
            <CustomButton
              key={v}
              onClick={() => setVibe(v)}
              secondary={vibe !== v}
              isMore={v === "More"}
            >
              {v}
            </CustomButton>
          ))}
        </div>
      </div>
      <VerticalSpace space="small" />
      <div
        style={{
          padding: "0 16px",
        }}
      >
        <button class={styles.button__fullWidth} onClick={() => {}}>
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
