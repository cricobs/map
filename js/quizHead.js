/** Add World Map Data Points */

function Permute() {
}

Permute.permutation = function (iputs, start, oputs) {
    if (start >= iputs.length) {
        var arr = iputs.slice(0); //clone the array
        oputs.push(arr);

    } else {
        var i;
        for (i = start; i < iputs.length; ++i) {
            Permute.swap(iputs, start, i);
            Permute.permutation(iputs, start + 1, oputs);
            Permute.swap(iputs, start, i);
        }
    }
};

Permute.permutations = function (iputs) {
    var oputs = [];
    Permute.permutation(iputs, 0, oputs);

    return oputs;
};

Permute.swap = function (array, from, to) {
    var tmp = array[from];
    array[from] = array[to];
    array[to] = tmp;
};


function QuizHead(paths, names) {
    this.paths = paths;
    this.names = names;
    this.characters = [];
    this.map_paths = {};
    this.heads = {};
    this.width = 950;
    this.height = 620;
    this.name = 'world-000';
    this.map = null;

    this.load();
}

QuizHead.prototype.load = function () {
    this.loadPaths();
    jQuery.fn.vectorMap('addMap', this.name, {
        "width": this.width,
        "height": this.height,
        "paths": this.map_paths
    });
};

QuizHead.prototype.loadPaths = function () {
    var code;
    for (code in this.paths) {
        if (this.paths.hasOwnProperty(code)) {
            this.loadPath(code.toLowerCase());
        }
    }

    if (Object.keys(this.names).length !== 0) {
        console.info(["unassigned names", this.names]);
        // throw new Error("unassigned names")
    }
};

QuizHead.prototype.loadPath = function (code) {
    var name = this.names.hasOwnProperty(code) ? this.names[code].toLowerCase() : code;
    this.map_paths[code] = {
        "path": this.paths[code],
        "name": name
    };

    var i, permutations = Permute.permutations(this.parseName(name));
    for (i = 0; i < permutations.length; i++) {
        this.heads[permutations[i].join(",")] = code;
    }

    delete this.names[code];
};

QuizHead.prototype.parseName = function (name) {
    var i, j, parts = [], sections = name.split("|");
    for (i = 0; i < sections.length; i++) {
        var s_parts = sections[i].split(",");
        var s_names = [];
        for (j = 0; j < s_parts.length; j++) {
            var s_name = s_parts[j];
            s_name = s_name
                .substring(s_name.lastIndexOf(":") + 1)
                .replace(/\s+/gm, ' ')
                .replace(/\([^)]+\)/gm, '')
                .trim();

            if (s_names.indexOf(s_name) == -1) {
                s_names.push(s_name);
                this.addCharacters(s_name)
            }
        }
        parts.push.apply(parts, s_names);
    }

    return parts;
};

QuizHead.prototype.addCharacterOptions = function (select) {
    this.characters.sort();

    var i, character;
    for (i = 0; i < this.characters.length; i++) {
        character = this.characters[i];
        select.append($("<option></option>")
            .attr("value", character)
            .text(character));
    }
};

QuizHead.prototype.addCharacters = function (text) {
    var characters = text.match(/(?![àèìòùáéíóúýäëïöüÿçñć])[^\x00-\x7F]/gi);
    if (characters === null) {
        return
    }

    characters = characters
        .filter(function (item, index, iput) {
            return index == iput.indexOf(item);
        });

    var k, character;
    for (k = 0; k < characters.length; k++) {
        character = characters[k];
        if (this.characters.indexOf(character) === -1) {
            this.characters.push(character)
        }
    }
};

QuizHead.prototype.selectFormInput = function (form) {
    var input = $(form).find("input");
    var head = input
        .val()
        .toLowerCase()
        .split(",")
        .map(function (s) {
            return s.replace(/\s+/gm, ' ').trim()
        })
        .join(",");

    if (this.heads.hasOwnProperty(head)) {
        this.map.vectorMap('select', this.heads[head]);
        input.val("");
    }

    return false
};

QuizHead.prototype.addSelectCharacter = function (select) {
    select.change(function () {
        var option = select
            .find("option:selected")
            .prop("selected", false);

        var input = $("input");
        var position = input[0].selectionStart;
        var value = input.val();
        input
            .focus()
            .val(value.substring(0, position) + option.text() + value.substring(position));

        select
            .find(".default")
            .prop("selected", true);
    });

    this.addCharacterOptions(select);
};

QuizHead.prototype.addElements = function (map, input, select_character) {
    this.map = map;

    input.keydown(function (e) {
        var keyCode = e.keyCode || e.which;

        switch (keyCode) {
            case 40:
                select_character.focus();
                break;
        }
    });

    this.addSelectCharacter(select_character)
};

var quiz_head = new QuizHead(paths, names);