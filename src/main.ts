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
      const { fonts } = msg
      // Filter selected nodes to get only text nodes
      const textNodes = figma.currentPage.selection.filter(node => node.type === "TEXT")

      // Check if 1 or 2 text nodes are selected
      if (textNodes.length > 0 && textNodes.length <= 2) {
        // Loop through selected text nodes
        for (let i = 0; i < textNodes.length; i++) {
          // Choose headline font for first node, body font for second
          const font = i === 0 ? fonts.headlineFont : fonts.bodyFont
          // Load the font asynchronously
          await figma.loadFontAsync({ family: font.family, style: "Regular" })
          // Apply the font to the text node
          textNodes[i].fontName = { family: font.family, style: "Regular" }
        }
        // Notify user of successful font application
        figma.notify("Fonts applied successfully ✨")
      } else {
        // Notify user if incorrect number of nodes selected
        figma.notify("Please select 1 or 2 text nodes.")
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