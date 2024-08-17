import FontDuoUI from "./FontDuoUI";

import {
  Button,
  Container,
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h, RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import styles from "./styles.css";
import { InsertCodeHandler } from "./types";

function Plugin() {
  return <FontDuoUI />;
}

export default render(Plugin);
