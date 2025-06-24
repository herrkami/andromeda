// Main application logic
const AndromedaApp = {
  mdContents: {},
  currentNodeId: null,
  colorLabels: {},

  async init() {
    await FlowchartLoader.loadFlowchart();
    this.setupEventListeners();
    this.displayHelp();
  },

  setupEventListeners() {
    // Set up zoom after flowchart is loaded
    this.setupZoom();
  },

  setupZoom() {
    // Wait a bit for mermaid to finish rendering
    setTimeout(() => {
      const svgs = d3.selectAll(".mermaid svg");
      svgs.each(function() {
        const svg = d3.select(this);
        const inner = svg.select("g");
        const zoom = d3.zoom().on("zoom", function(event) {
          inner.attr("transform", event.transform);
        });
        svg.call(zoom);
      });
    }, 100);
  },

  displayHelp() {
    document.getElementById('node-description').innerHTML = marked.parse(
      "# EDA knowledge database \nThis web tool is a growing knowledge base for EDA workflows and tools. \n\n## Flowchart\nThe flowchart on the left illustrates common work flows and dependencies in EDA and chip design. \n**Use the mouse wheel to zoom in and out and click and drag to pan.** \nEach node within the chart is clickable. Clicking a node will display the description of that node in the right panel. \n## Motivation and responsibility\nEDA consists of countless interdependent tools, library components, and workflows. \nOne way to illustrate the complex connections among all those entities is as a flowchart. \n\nThe project is currently still in stealth mode and glued together by [herrkami](https://github.com/herrkami). Core components are [mermaid](https://mermaid-js.github.io/mermaid/), [marked](https://marked.js.org/), [11ty](https://www.11ty.dev/), and [pages-cms](https://pagescms.org)."
    );
  },

  displayNodeDescription(id) {
    const ref = `md/nodes/${id.toLowerCase()}.md`;
    fetch(ref)
      .then(response => response.text())
      .then(md => {
        console.log(md);
        document.getElementById('node-description').innerHTML = marked.parse(md);
      })
      .catch(error => {
        console.error('Failed to fetch page: ', error);
      });
  },

  handleNodeClick(id) {
    console.log("Clicked node id:", id);
    this.currentNodeId = id;
    this.displayNodeDescription(id);
  }
};

// Global callback function for mermaid clicks
function callback(id) {
  AndromedaApp.handleNodeClick(id);
}

// Initialize app when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  AndromedaApp.init();
});