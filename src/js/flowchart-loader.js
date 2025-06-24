// Flowchart loading utilities
const FlowchartLoader = {
  async loadFlowchart() {
    try {
      const response = await fetch('data/flowchart.mermaid');
      if (!response.ok) {
        throw new Error(`Failed to load flowchart: ${response.status}`);
      }
      const flowchartDefinition = await response.text();
      
      // await new Promise(resolve => setTimeout(resolve, 10000));

      const container = document.getElementById('flowchart-container');
      if (container) {
        // Set the content as text content so mermaid can process it
        container.innerHTML = flowchartDefinition;
        container.removeAttribute('data-processed');
        
        // Re-initialize mermaid to render the new content
        if (typeof mermaid !== 'undefined') {
          await mermaid.run({
            querySelector: '#flowchart-container'
          });
          
          // Hide loading animation with fade effect
          const loadingOverlay = document.getElementById('loading-overlay');
          if (loadingOverlay) {
            loadingOverlay.classList.add('fade-out');
            // Remove completely after transition
            setTimeout(() => {
              loadingOverlay.classList.add('hidden');
            }, 800);
          }
          
          // Re-setup zoom after mermaid renders
          if (typeof AndromedaApp !== 'undefined' && AndromedaApp.setupZoom) {
            AndromedaApp.setupZoom();
          }
        }
      }
    } catch (error) {
      console.error('Error loading flowchart:', error);
      
      // Fallback: show error message and hide loading
      const container = document.getElementById('flowchart-container');
      if (container) {
        container.innerHTML = '<p style="color: red; padding: 20px;">Error loading flowchart. Please check the console for details.</p>';
      }
      
      // Hide loading animation on error too
      const loadingOverlay = document.getElementById('loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
          loadingOverlay.classList.add('hidden');
        }, 800);
      }
    }
  }
};