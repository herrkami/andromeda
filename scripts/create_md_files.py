import os
import logging
import json
import wikipedia

logger = logging.getLogger(__name__)
FORMAT = "[%(filename)s:%(lineno)s: %(funcName)s()] %(message)s"
logging.basicConfig(format=FORMAT, level=logging.DEBUG)

def nodekey_to_filename(key, directory='../src/md/nodes/'):
    return(f'{directory}{key.lower()}.md')

def create_files(directory, nodes, dry=False):

    files = {}
    for key in nodes.keys():

        # Create markdown file if it does not exist yet
        fname = nodekey_to_filename(key, directory)
        if not os.path.exists(fname):
            if not dry:
                os.mknod(fname)
            files[key] = fname
            if dry:
                logging.debug('Dry run. Would have created {} for {}'.format(fname, key))
            else:
                logging.debug('Created {} for {}'.format(fname, key))
        else:
            logging.debug('Did not create {} as it already exists'.format(fname))
    
    return files

def get_file_list(directory, nodes):

    files = {}
    for key in nodes.keys():

        # Create markdown file if it does not exist yet
        fname = nodekey_to_filename(key, directory)
        files[key] = fname
    return files

# Markdown structure:
#
#     # Node title
#
#     Short description
#
#     ## Links
#     - [Google](https://google.de)
#
#     ## Tools
#
#     ### Proprietary
#
#     - example tool 1
#     - example tool 2
#
#     ### Open Source
#
#     - example tool 1
#     - example tool 2
#
#     ## Foerderprojekte
#
#     - HyperBla

def generate_markdown_content(node):
    title = node["title"]
    subtitle = node["subtitle"]
    wiki_link = node["wiki_link"]
    description = node["description"]

    content = ""

    # Title and subtitle
    content += "# {}".format(title)
    if subtitle != "":
        content += " - {}".format(subtitle)
    content += "\n"

    # Description
    if description != "":
        content += description
        content += "\n\n"

    # Wiki link description
    if wiki_link != "":
        content += "**Summary from Wikipedia**: \n"
        content += wikipedia.summary(wiki_link.split('/')[-1], auto_suggest=False)
        content += "\n"
    content += "\n"
    
    # Links
    content += "## Links\n"
    if wiki_link != "":
        content += "- Wikipedia: {}\n".format(wiki_link)
    else:
        content += "- Example link: https://en.wikipedia.org/wiki/Main_Page"
        content += "\n"
        content += "- Alternative format: [example link](https://en.wikipedia.org/wiki/Main_Page)"
        content += "\n"
    content += "\n"

    # Tools
    content += "## Tools\n"
    content += "\n"
    
    content += "### Proprietary\n"
    content += "- List of proprietary tools"
    content += "\n"
    content += "\n"
    
    content += "### Open Source\n"
    content += "- List of open source tools"
    content += "\n"
    content += "\n"
    
    content += "## Research projects\n"
    content += "- List of research projects"
    content += "\n"

    return content


if __name__ == '__main__':
    dry = False
    overwrite = True

    dir_md = '../md/'

    with open('./nodes.json', 'r') as f:
        # "nodes" -- "<key>" -- "title"
        #                    |- "subtitle"
        #                    |- "wiki_link"
        nodes = json.load(f)["nodes"]
    
    new_files = create_files(dir_md, nodes, dry=dry)
    
    # DEBUG!
    # file_list = new_files
    # file_list['IDEA'] = '../md/idea.md'
    # file_list['PDK'] = '../md/pdk.md'

    file_list = get_file_list(dir_md, nodes)
    
    for key in file_list.keys():
        fname = file_list[key]
        if os.path.exists(fname):
            print(key, fname)
            with open(fname, 'r+') as f:
                content = f.read()
                # logging.debug("Found content <{}> in file {}".format(content, fname))
                if overwrite:
                    logging.debug("Overwriting content of file {}".format(fname))
                    content = ""

                if len(content) == 0:
                    logging.debug("Writing file {}".format(fname))
                    
                    # Go to first character
                    f.seek(0)
                    # Generate and write content to file
                    content = generate_markdown_content(nodes[key])
                    f.write(content)
                    
                    logging.debug("Wrote content to empty file {}:".format(fname, content))
                    # Delete everything afterwards
                    f.truncate()
