// Import the showUI function from the @create-figma-plugin/utilities package
// This function is used to display the plugin's user interface
import { showUI } from '@create-figma-plugin/utilities'

// Main function that initializes the plugin
export default function () {
  // Show the plugin UI with specified dimensions
  showUI({
    width: 300,
    height: 525
  })

  // Handle messages from the UI
  figma.ui.onmessage = async (msg) => {
    // Check if the message is to apply fonts
    if (msg.type === 'apply-fonts') {
      const { fonts } = msg;

      const textNodes = figma.currentPage.selection.filter(node => node.type === "TEXT");

      if (textNodes.length > 0 && textNodes.length <= 2) {
        for (let i = 0; i < textNodes.length; i++) {
          const font = i === 0 ? fonts.headlineFont : fonts.bodyFont;

          try {
            const segments = textNodes[i].getStyledTextSegments(['fontName', 'fontSize', 'fontWeight']);

            for (const segment of segments) {
              const currentStyle = segment.fontName as FontName;
              const currentWeight = getFontWeight(currentStyle.style);
              
              let newStyle;
              if (i === 0) { // Headline font
                newStyle = findMatchingOrNextWeight(currentWeight, font.variants);
              } else { // Body font
                newStyle = 'Regular';
              }
              
              try {
                await figma.loadFontAsync({ family: font.family, style: newStyle });
                
                await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay

                await textNodes[i].setRangeFontName(segment.start, segment.end, {
                  family: font.family,
                  style: newStyle
                });
                
                await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay
              } catch (fontLoadError) {
                newStyle = 'Regular';
                await figma.loadFontAsync({ family: font.family, style: newStyle });
              }
            }
          } catch (error) {
            const fontType = i === 0 ? "headline" : "body";
            figma.notify(`Failed to apply ${fontType} font. Please try a different font.`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 200)); // Add a delay between nodes
        }
        figma.notify("Fonts applied successfully ✨");
      } else {
        figma.notify("Please select 1 or 2 text nodes.");
      }
    }
  }

  // Listen for changes in selection
  figma.on("selectionchange", () => {
    // Filter selected nodes to get only text nodes
    const textNodes = figma.currentPage.selection.filter(node => node.type === "TEXT")
    // Send message to UI with the count of selected text nodes
    figma.ui.postMessage({ type: 'selectionChange', count: textNodes.length })
  })
}

function getFontWeight(style: string): number {
  const weightMap: { [key: string]: number } = {
    'thin': 100, 'extralight': 200, 'light': 300, 'regular': 400,
    'medium': 500, 'semibold': 600, 'bold': 700, 'extrabold': 800, 'black': 900
  }
  const lowercaseStyle = style.toLowerCase()
  for (const [key, value] of Object.entries(weightMap)) {
    if (lowercaseStyle.includes(key)) return value
  }
  return 400 // default to regular if not found
}

function findMatchingOrNextWeight(currentWeight: number, availableVariants: string[]): string {
  const weightMap: { [key: number]: string } = {
    100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
    500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black'
  };
  const weights = [900, 800, 700, 600, 500, 400, 300, 200, 100]; // Reversed order for finding next available weight
  
  // First, check if the exact weight is available
  if (availableVariants.includes(currentWeight.toString())) {
    return weightMap[currentWeight];
  }
  
  // If not, find the next available weight (heavier first, then lighter)
  for (const weight of weights) {
    if (weight <= currentWeight && availableVariants.includes(weight.toString())) {
      return weightMap[weight];
    }
  }
  
  return 'Regular'; // Default to Regular if no match is found
}