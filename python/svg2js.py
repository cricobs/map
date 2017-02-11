#!/usr/bin/python

import argparse
import json
import os
from BeautifulSoup import BeautifulSoup


def js_from_svgs(svgs):
    map(js_from_svg, svgs)


def js_from_svg(svg):
    with open("/home/lap-hep-deb-use/WebstormProjects/map/python/code.json", "r") as iput:
        codes = json.load(iput)

    def code_name(name):
        return codes.get(name, name)

    with open(os.path.splitext(svg.name)[0] + '.js', 'w') as oput:
        soup = BeautifulSoup(svg.read(), selfClosingTags=['defs', 'sodipodi:namedview'])
        paths = {
            code_name(path["id"].replace("_", " ")): path["d"]
            for path in soup.findAll('path')
            }

        oput.write("var paths = " + json.dumps(paths, indent=4) + ";")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Convert SVG files to JS.')
    parser.add_argument('svgs', metavar='S', type=file, nargs='+', help='input SVG files')
    args = parser.parse_args()
    js_from_svgs(args.svgs)