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
import { Lock, RefreshCw, ChevronDown } from 'lucide-react';

function FontDuoUI() {
  const [vibe, setVibe] = useState('Elegant');

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      <Stack space="small">
        <Columns space="extraSmall">
          <Text muted>Inter</Text>
          <IconButton onClick={() => {}}>
            <Lock size={16} />
          </IconButton>
          <IconButton onClick={() => {}}>
            <RefreshCw size={16} />
          </IconButton>
        </Columns>
        <Text style={{ fontSize: '24px', lineHeight: '28px', fontWeight: 'normal' }}>
          This is a sample headline text
        </Text>
      </Stack>
      <VerticalSpace space="medium" />
      <Stack space="small">
        <Columns space="extraSmall">
          <Text muted>News Gothic</Text>
          <IconButton onClick={() => {}}>
            <Lock size={16} />
          </IconButton>
          <IconButton onClick={() => {}}>
            <RefreshCw size={16} />
          </IconButton>
        </Columns>
        <Text>
          Typography is the art and technique of arranging type to make written
          language legible, readable, and appealing when displayed. It involves
          choosing typefaces, point sizes, line lengths, line-spacing, and letter-
          spacing, and adjusting the space between pairs of letters.
        </Text>
      </Stack>
      <VerticalSpace space="large" />
      <Stack space="small">
        <Text>Choose your vibe:</Text>
        <Columns space="extraSmall">
          {['Elegant', 'Minimalist', 'More'].map((v) => (
            <Button
              key={v}
              onClick={() => setVibe(v)}
              secondary={vibe !== v}
            >
              {v}{v === 'More' && <ChevronDown size={12} style={{ marginLeft: '4px' }} />}
            </Button>
          ))}
        </Columns>
      </Stack>
      <VerticalSpace space="small" />
      <Button fullWidth onClick={() => {}} secondary>
        <RefreshCw size={16} style={{ marginRight: '8px' }} />
        I'm feeling lucky
      </Button>
      <VerticalSpace space="small" />
      <Muted>
        💡 Tip: Edit the preview text to see how your content looks with different font pairings.
      </Muted>
    </Container>
  );
}

export default FontDuoUI;