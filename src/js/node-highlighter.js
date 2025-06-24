// Node highlighting and visual enhancement utilities
const NodeHighlighter = {
  getNodeElementsFromMermaidID(id) {
    return document.querySelectorAll(`g[id*=-${id}-]`);
  },

  getLabelContainersFromMermaidID(id) {
    const elem = this.getNodeElementsFromMermaidID(id);
    const containers = [];
    elem.forEach((e) => {
      containers.push(
        e.getElementsByClassName("basic label-container")[0]
      );
    });
    return containers;
  },

  highlightNodesWithDescriptions() {
    Object.entries(AndromedaApp.mdContents).forEach(([key, value]) => {
      console.log('highlightNodesWithDescriptions', "key:", key);
      const containers = this.getLabelContainersFromMermaidID(key);
      if (containers[0]) {
        containers[0].style.fill = '#d1f0d6';
      }
    });
  },

  addColorLabelToNode(nodeKey, color) {
    if (AndromedaApp.colorLabels[nodeKey] === undefined) {
      AndromedaApp.colorLabels[nodeKey] = [];
    }
    
    if (!AndromedaApp.colorLabels[nodeKey].includes(color)) {
      const container = this.getLabelContainersFromMermaidID(nodeKey)[0];
      
      if (!container) {
        console.error(`Container not found for node ${nodeKey}`);
        return;
      }

      let x = Number(container.attributes.x.value);
      let y = Number(container.attributes.y.value);
      const h = Number(container.attributes.height.value);
      const r = 10;
      
      x = x + container.parentElement.transform.baseVal[0].matrix.e;
      x = x + r;
      x = x + 2 * r * AndromedaApp.colorLabels[nodeKey].length;

      y = y + container.parentElement.transform.baseVal[0].matrix.f;
      y = y + h + r;
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', r);
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('fill', color);
      
      const svg = container.ownerSVGElement.querySelector('g').querySelector('g');
      svg.appendChild(circle);
      AndromedaApp.colorLabels[nodeKey].push(color);
    } else {
      console.log(`Color label ${color} already attached to node ${nodeKey}.`);
    }
  }
};