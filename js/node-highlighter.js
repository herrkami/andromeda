// Node highlighting utilities for click interaction
const NodeHighlighter = {
  currentHighlighted: null,
  highlightColor: '#ffeb3b', // Yellow highlight for clicked nodes
  
  getNodeElementsFromMermaidID(id) {
    return document.querySelectorAll(`g[id*=-${id}-]`);
  },

  getLabelContainersFromMermaidID(id) {
    const elem = this.getNodeElementsFromMermaidID(id);
    const containers = [];
    elem.forEach((e) => {
      const container = e.getElementsByClassName("basic label-container")[0];
      if (container) {
        containers.push(container);
      }
    });
    return containers;
  },

  clearHighlight() {
    if (this.currentHighlighted) {
      const containers = this.getLabelContainersFromMermaidID(this.currentHighlighted);
      containers.forEach(container => {
        container.style.fill = ''; // Reset to default
      });
      this.currentHighlighted = null;
    }
  },

  highlightNode(nodeId) {
    // Clear previous highlight
    this.clearHighlight();
    
    // Highlight new node
    const containers = this.getLabelContainersFromMermaidID(nodeId);
    if (containers.length > 0) {
      containers.forEach(container => {
        container.style.fill = this.highlightColor;
      });
      this.currentHighlighted = nodeId;
      console.log(`Highlighted node: ${nodeId}`);
    } else {
      console.warn(`Could not find container for node: ${nodeId}`);
    }
  }
};