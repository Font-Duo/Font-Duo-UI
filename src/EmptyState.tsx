import { h } from "preact";
import styles from "./styles.css";

interface EmptyStateProps {
  onVibeSelect: (vibe: string) => void;
}

const EmptyState = ({ onVibeSelect }: EmptyStateProps): h.JSX.Element => (
  <div className={styles.emptyState}>
    <h2>Craft your perfect font pair ✨</h2>
    <p>Choose a vibe and let's create something awesome</p>
    <div className={styles['empty-state-buttons']}>
      <button onClick={() => onVibeSelect("Modern")} className={styles['empty-state-button']}>
        Modern
      </button>
      <button onClick={() => onVibeSelect("Elegant")} className={styles['empty-state-button']}>
        Elegant
      </button>
    </div>
    <button
      onClick={() => onVibeSelect("lucky")}
      className={styles['empty-state-button-lucky']}
    >
      I'm feeling lucky
    </button>
  </div>
);

export default EmptyState;