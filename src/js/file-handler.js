// File handling utilities (legacy functionality - mostly unused now)
const FileHandler = {
  openNodeDescriptionInEditor() {
    // Open the markdown editor for the current node
    if (AndromedaApp.currentNodeId) {
      const fileName = AndromedaApp.currentNodeId.toLowerCase() + '.md';
      localStorage.setItem("md_fname", fileName);
      window.open("html/markdown-editor.html", '_blank').focus();
    } else {
      alert("No node selected for editing");
    }
  }
};