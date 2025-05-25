// <script src="https://d3js.org/d3.v6.min.js"></script>
// <script type="text/javascript" src="https://unpkg.com/mermaid@latest/dist/mermaid.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

// const mermaid = await import("https://cdn.jsdelivr.net/npm/mermaid@11.6.0/+esm");
// const marked = await import("https://cdn.jsdelivr.net/npm/marked@15.0.12/+esm");
// const d3 = await import("https://cdn.jsdelivr.net/npm/d3@6.0.0/+esm");
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.6.0/+esm";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.12/+esm";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@6.0.0/+esm";


window.onload = function () {
    displayQuickStart();
};

window.addEventListener('load', function () {
    var svgs = d3.selectAll(".mermaid svg");
    svgs.each(function () {
        var svg = d3.select(this);
        var inner = d3.select("g");
        var zoom = d3.zoom().on("zoom", function (event) {
            inner.attr("transform", event.transform);
        });
        svg.call(zoom);
    });
}
);


mermaid.initialize({
    startOnLoad: true,
    securityLevel: 'loose',
    theme: 'neutral',
    // themeVariables: {
    //   fontSize: '80px',
    // },
    flowchart: {
        // useMaxWidth: true, 
        htmlLabels: true,
    },
});

// mermaid.initialize({ startOnLoad: false });
// await mermaid.run({
//   querySelector: '.andromeda_chart',
// });

var md_contents = {};
var current_node_id = {};

function readMultipleFiles(files) {
    let promises = [];
    for (file of files) {
        let filePromise = new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.fileName = file.name;
            reader.onload = (event) => {
                // Convert file name to a key that matches the mermaid id (pdk.md => PDK)
                const fname = event.target.fileName;
                const extension = fname.split(".")[1].toLowerCase();
                const key = fname.split(".")[0].toUpperCase();
                if (extension != "md") {
                    var warning = fname + " will be skipped because it does not have an .md-file extension.";
                    console.warn(arguments.callee.name, warning);
                    alert(warning);
                } else {
                    const content = event.currentTarget.result;
                    if (key in valid_nodes) {
                        md_contents[key] = content;
                        console.log(arguments.callee.name, "Adding markdown content for key", key);
                    } else {
                        var warning = key + " does not correspond to a node in the flow chart. File " + reader.fileName + " will not be included.";
                        console.warn(arguments.callee.name, warning);
                        alert(warning);
                    }
                }

                resolve(true);
            };
            // reader.onloadend = () => {
            //   console.log(arguments.callee.name, "key:", event.target.fileName.split(".")[0].toUpperCase());
            // };
        });
        promises.push(filePromise);
    }
    console.log(arguments.callee.name, "promises:", promises);
    return promises;
}

function getNodeElementsFromMermaidID(id) {
    return document.querySelectorAll('g[id*=-' + id + '-]');
}

function getLabelContainersFromMermaidID(id) {
    var elem = getNodeElementsFromMermaidID(id);
    var containers = [];
    elem.forEach((e) => {
        containers.push(
            e.getElementsByClassName("basic label-container")[0]
        );
    });
    return containers;
}

function highlightNodesWithDescriptions() {
    Object.entries(md_contents).forEach(([key, value]) => {
        console.log(arguments.callee.name, "key:", key);
        var containers = getLabelContainersFromMermaidID(key);
        containers[0].style.fill = '#d1f0d6';
    });
}


var color_labels = {};
function addColorLabelToNode(node_key, color) {
    if (color_labels[node_key] == undefined) {
        color_labels[node_key] = [];
    }

    if (!color_labels[node_key].includes(color)) {
        let container = getLabelContainersFromMermaidID(node_key)[0];

        let x = Number(container.attributes.x.value);
        let y = Number(container.attributes.y.value);
        const h = Number(container.attributes.height.value);
        const w = Number(container.attributes.width.value);
        const r = 10;

        x = x + container.parentElement.transform.baseVal[0].matrix.e;
        x = x + r;
        x = x + 2 * r * color_labels[node_key].length;

        y = y + container.parentElement.transform.baseVal[0].matrix.f;
        y = y + h + r;

        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', r);
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('fill', color);

        const svg = container.ownerSVGElement.querySelector('g').querySelector('g');
        svg.appendChild(circle);
        color_labels[node_key].push(color);
        // container.appendChild(circle);
    } else {
        console.log('Color label ' + color + ' already attached to node ' + node_key + '.');
    }
}

function readFilesAndHighlightNodes(files) {
    var promises = readMultipleFiles(files);
    Promise.all(promises)
        .catch(function (err) {
            // the error;
            console.log(arguments.callee.name, 'A promise failed to resolve', err);
        })
        .then(() =>
            highlightNodesWithDescriptions()
        )
}

function openNodeDescriptionInEditor() {
    if (current_node_id in md_contents) {
        localStorage.setItem("md_content", md_contents[current_node_id]);
        localStorage.setItem("md_fname", current_node_id.toLowerCase() + '.md');
        window.open("markdown-editor.html?loadFromLocalStorage=true", '_blank').focus();
    } else {
        alert("")
    }
}

function displayHelp() {
    document.getElementById("button-edit").disabled = true;
    document.getElementById('node-description').innerHTML = marked.parse(
        "# EDA knowledge database \nThis web tool is a growing knowledge base for EDA workflows and tools. \n## Initialization (important!)\n**To initialize this knowledge base, you need to click `Choose Files` below and select all files within the `md`-folder (`N:\\PT-BMBF_5,6\\PT_ElaF\\04_Strategie\\19_Designinitiative%20Mikroelektronik\\EDA_Flowchart\\eda_flows\\md\\`).** \nThe `md`-folder is in the same directory that contains this html file. \nJust navigate into it, select all, and press enter. \nOnce loaded, the nodes in the [flowchart](#Flowchart) will turn green and you'll be able to click on them to obtain more information. \n\n*Why do we have to do this?*\n> This website is just a static bunch of `html` and `css`-files and not (yet) hosted by a web server. \n> As most browsers do not allow web applications to automatically access local files, we require human assistance. \n> Thus, as long as this page is not hosted on a server, we have to live with this inconvenience, unfortunately. \n\n## Flowchart\nThe flowchart on the left illustrates common work flows and dependencies in EDA and chip design. \n**Use the mouse wheel to zoom in and out and click and drag to pan.** \nEach node within the chart is clickable. \nAfter loading the markdown files, clicking reveals more details in this window. \n\n## Edit and contribute\n### Markdown \nThe descriptions of the EDA entities on the left are all written in [Markdown](https://en.wikipedia.org/wiki/Markdown) and stored in separate files in the local `md` directory. \nThe file names are derived from the internal node IDs, which are displayed when you hover over the nodes. \nFeel free to correct/extend/update the descriptions. \n[Markdown syntax](https://www.markdownguide.org/cheat-sheet/) is very straight-forward and extremely easy to learn. \nNo nerd skills are required.\n\nYou can edit the markdown files directly through the browser by clicking on the `Edit`-button below. \nWhen you do so, a markdown editor will open the current description. \nIt autosaves every ten seconds, such that your changes shouldn't be lost, even if you refresh the editor tab. \nOnce you're done, you can click the download button in the editor window and safe the file. \nThe correct file name will automatically be suggested for you. \nTo apply your changes to this knowledge base, move the file into the `md`-directory and overwrite the existing version. \nIf you feel nervous about that, backup the previous version by copying it into the `bak`-folder. \n\nHave fun and contact KoS if you have any questions or problems. \n### Mermaid\nThe flowchart is specified in [Mermaid](https://mermaid.live/). \n### Data safety\nDo not worry about data safety. \nAlthough we need to load some javascript libraries from the world wide web, no data leaves our internal network. The markdown editor runs in your browser. \n## Motivation and responsibility\nEDA consists of countless interdependent tools, IPs, and workflows. \nOne way to illustrate the complex connections of all those entities is to include them into a flowchart. \n\nKoS is responsible for keeping this up-to-date but the entire ElaF-Team is cordially invited to contribute. \n\nWhile the project might first appear quite unconventional and a bit techy, it is actually very simply structured and easy to understand. \nSince data and algorithms are strickly separated, it should be pretty hard to mess things up."
    );
}

function displayQuickStart() {
    document.getElementById("button-edit").disabled = true;
    document.getElementById('node-description').innerHTML = marked.parse(
        "# Quickstart \n1. Click `Choose Files`, select **<u>all</u>** files in `N:\\PT-BMBF_5,6\\PT_ElaF\\04_Strategie\\19_Designinitiative%20Mikroelektronik\\EDA_Flowchart\\eda_flows\\md\\`, and press enter. \n2. All clickable *nodes* in the flowchart should now be green. Click one! \n3. Explore the flowchart by moving (click and drag) and zooming (mouse wheel) through it. "
    );
}

function displayNodeDescription(id) {
    if ((id in md_contents)) {
        document.getElementById('node-description').innerHTML = marked.parse(md_contents[id]);
        document.getElementById("button-edit").disabled = false;
    } else {
        document.getElementById('node-description').innerHTML = "<b>Could not find the description of this node.</b><br>Please load the markdown file <i>" + id.toLowerCase() + ".md</i>";
        document.getElementById("button-edit").disabled = true;
    }
}

var callback = function (id) {
    // document.getElementByClass('node-description').innerHTML = marked.parse(valid_nodes[id]);
    console.log(arguments.callee.name, "clicked node id:", id);
    current_node_id = id;
    // var elem = getNodeElementsFromMermaidID(id);
    // console.log("Callback matching elements: ", elem);
    // var conts = getLabelContainersFromMermaidID(id);
    // console.log("Callback first container item: ", conts[0]);
    // conts[0].style.fill = '#ffff00';
    displayNodeDescription(id);
};


var valid_nodes = {
    "IDEA": "Idea",
    "PDK": "PDK (Process Development Kit)",
    "ARCH": "Architecture and specification",
    "SCH": "Schematic",
    "NET_SCH": "Netlist",
    "SIM_ANA_SCH": "Schematic simulation",
    "LAY": "Layout",
    "DRC": "DRC (Design Rule Check)",
    "LVS": "LVS (Layout vs. Schematic)",
    "PEX": "PEX (Parasitic Extraction)",
    "NET_PAR": "Parasitic netlist (layout)",
    "SIM_ANA_PEX": "Post layout simulation",
    "GEO": "Chip geometry",
    "IO": "I/O specification",
    "TIMING_CNSTR": "Timing constraints (clock speed, latency, etc.)",
    "SDL": "System description",
    "HDL": "HDL (Hardware description languages)",
    "VIS": "Visual description (schematics)",
    "HDL_COMP": "Compiler/transpiler",
    "RTL": "RTL (Register Transfer Level <br>or gate level description)",
    "SYNTH": "Synthesis",
    "NET_DIG": "Logic netlist",
    "VERIFICATION_FORMAL": "Formal verification",
    "VERIFICATION_FUNCTIONAL": "Functional verification",
    "UNIT_TESTS": "Unit test",
    "SYSTEM_TESTS": "System test",
    "TIMING_LOGIC": "Timing simulation and analysis",
    "CTS": "CTS (Clock tree synthesis)",
    "ROUTE": "Routing",
    "FLR_PLANNING": "Floor planning",
    "PWR_PLANNING": "Power planning",
    "LAY_DIG": "Layout",
    "DRC_DIG": "DRC (Design Rule Check)",
    "LVS_DIG": "LVS (Layout vs. Schematic)",
    "RCX": "RCX (Resistance/Capacitance Extraction)",
    "STA": "STA (Static Timing Analysis)",
    "PEX_DIG": "PEX (Parasitic extraction)",
    "LITHO": "Litho hotspot analysis",
    "CMP": "CMP (Chemical-mechanical polishing)",
    "CCA": "CCA (Critical area analysis)",
    "VIA": "Via enhancement",
    "CFA": "CFA (Critical feature analysis)",
    "PATMATCH": "Pattern matching",
    "GDS": "GDS (Graphic Data Stream)",
    "MPW": "MPW (Multi-project wafer)",
    "WAFER": "Wafer",
    "FOUNDRY": "Foundry"
}