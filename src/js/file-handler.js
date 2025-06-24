// File handling utilities (legacy functionality)
const FileHandler = {
  readMultipleFiles(files) {
    let promises = [];
    for (const file of files) {
      let filePromise = new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.fileName = file.name;
        reader.onload = (event) => {
          const fname = event.target.fileName;
          const extension = fname.split(".")[1].toLowerCase();
          const key = fname.split(".")[0].toUpperCase();
          
          if (extension !== "md") {
            const warning = `${fname} will be skipped because it does not have an .md-file extension.`;
            console.warn('readMultipleFiles', warning);
            alert(warning);
          } else {
            const content = event.currentTarget.result;
            if (key in NodeDefinitions.validNodes) {
              AndromedaApp.mdContents[key] = content;
              console.log('readMultipleFiles', "Adding markdown content for key", key);
            } else {
              const warning = `${key} does not correspond to a node in the flow chart. File ${reader.fileName} will not be included.`;
              console.warn('readMultipleFiles', warning);
              alert(warning);
            }
          }
          resolve(true);
        };
      });
      promises.push(filePromise);
    }
    console.log('readMultipleFiles', "promises:", promises);
    return promises;
  },

  readFilesAndHighlightNodes(files) {
    const promises = this.readMultipleFiles(files);
    Promise.all(promises)
      .catch(function(err) {
        console.log('readFilesAndHighlightNodes', 'A promise failed to resolve', err);
      })
      .then(() => {
        NodeHighlighter.highlightNodesWithDescriptions();
      });
  },

  openNodeDescriptionInEditor() {
    if (AndromedaApp.currentNodeId in AndromedaApp.mdContents) {
      localStorage.setItem("md_content", AndromedaApp.mdContents[AndromedaApp.currentNodeId]);
      localStorage.setItem("md_fname", AndromedaApp.currentNodeId.toLowerCase() + '.md');
      window.open("markdown-editor.html?loadFromLocalStorage=true", '_blank').focus();
    } else {
      alert("No content available for editing");
    }
  }
};