function setUpCanvas() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');
    ctx.translate(0.5, 0.5);

    // Set display size (vw/vh).
    var sizeWidth = 90 * window.innerWidth / 100,
        sizeHeight = 70 * window.innerHeight / 100 || 766;

    //Setting the canvas site and width to be responsive 
    canvas.width = sizeWidth;
    canvas.height = sizeHeight;
    canvas.style.width = sizeWidth;
    canvas.style.height = sizeHeight;
}

window.onresize = setUpCanvas();
window.onload = setUpCanvas();

var canvas = new fabric.Canvas("myCanvas");
var ctx = canvas.getContext('2d');
var font = '14px sans-serif';

const rectWidth = 150;
const rectHeight = 150;

var rhsColumns = 4;
var rhsRows = 4;
const rhsLeftOffset = 900;
const rhsTopOffset = 200;
const rhsPad = 0;

var lhsColumns = 2;
var lhsRows = 2;
const lhsLeftOffset = 200;
const lhsTopOffset = (rectHeight * rhsRows - rectHeight * lhsRows) / 2 + rhsTopOffset;
const lhsWidth = lhsColumns * rectWidth;
const lhsHeight = lhsRows * rectHeight;
var lhsPad = 0;

var sx = lhsRows / rhsRows;
var sy = lhsColumns / rhsColumns;

var lastCircle = null;

var customProperties = {
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingFlip: true,
    lockScalingX: true,
    lockScalingY: true,
    lockSkewingX: true,
    lockSkewingY: true,
    lockUniScaling: true,
    hoverCursor: "text"
};

// 0 == nearest
// 1 == linear interpolation
var interMethod = 1;
var lhsMatrix;
var rhsMatrix;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function fillMatrix(m, cols, rows, org) {
    var colPad = (m[0].length - cols) / 2;
    var rowPad = (m.length - rows) / 2;
    for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[i].length; j++) {
            m[i][j] = org[clamp(i - rowPad, 0, org.length - 1)][clamp(j - colPad, 0, org[0].length - 1)];
        }
    }
}

function calculateMatrix(lhs, rhs, inter) {
    if (inter == 0) {
        for (var i = 0; i < rhs.length; i++) {
            for (var j = 0; j < rhs[i].length; j++) {
                rhs[i][j] = lhs[Math.floor(i * sx)][Math.floor(j * sy)];
            }
        }
    } else if (inter == 1) {
        for (var x = 0; x < rhs.length; x++) {
            for (var y = 0; y < rhs[x].length; y++) {
                x_pos = (x + 0.5) * sx + 0.5
                y_pos = (y + 0.5) * sy + 0.5

                x_1 = Math.floor(x_pos)
                y_1 = Math.floor(y_pos)

                fx = ((x + 0.5) * sx - 0.5) - Math.floor(((x + 0.5) * sx - 0.5));

                fy = ((y + 0.5) * sy - 0.5) - Math.floor(((y + 0.5) * sy - 0.5));

                value = (
                    lhs[x_1][y_1] * (1 - fx) * (1 - fy) +
                    lhs[x_1][y_1 + 1] * fy * (1 - fx) +
                    lhs[x_1 + 1][y_1] * (1 - fy) * fx +
                    lhs[x_1 + 1][y_1 + 1] * fx * fy
                )

                rhs[x][y] = value
            }
        }
    }
}

function regenerate() {
    sx = lhsRows / rhsRows;
    sy = lhsColumns / rhsColumns;
    rhsMatrix = Array.from(Array(rhsRows), () => new Array(rhsColumns));

    if (interMethod == 0) {
        lhsMatrix = Array.from(Array(lhsRows), () => new Array(lhsColumns));
        lhsPad = 0;
    } else if (interMethod == 1) {
        lhsMatrix = Array.from(Array(lhsRows + 2), () => new Array(lhsColumns + 2));
        lhsPad = 1;
    }
    lhsOrg = Array.from(Array(lhsRows), () => Array.from(Array(lhsColumns).keys()));
}

function redraw() {
    canvas.clear();
    fillMatrix(lhsMatrix, lhsColumns, lhsRows, lhsOrg);
    calculateMatrix(lhsMatrix, rhsMatrix, interMethod);

    drawGrid(rhsColumns, rhsRows, rhsLeftOffset, rhsTopOffset, 1, true, rhsPad, rhsMatrix);
    drawGrid(lhsColumns, lhsRows, lhsLeftOffset, lhsTopOffset, lhsRows * lhsColumns + 1, false, lhsPad, lhsMatrix);
}

regenerate();
redraw();

function drawGrid(cols, rows, leftOffset, topOffset, startingZ, onClick, padding, values) {
    for (var i = - padding; i < cols + padding; i++) {
        for (var j = - padding; j < rows + padding; j++) {

            var padSquare = (i < 0 || i >= cols || j < 0 || j >= rows);
            var rect = new fabric.Rect({
                left: leftOffset + i * rectWidth,
                top: topOffset + j * rectHeight,
                originX: 'left',
                originY: 'top',
                width: rectWidth,
                height: rectHeight,
                angle: 0,
                fill: padSquare ? 'rgba(10, 10, 10, 0.5)' : 'rgba(255,0,0,0.5)',
                stroke: 'rgba(0,0,255,0.5)',
                strokeWidth: 1,
                transparentCorners: false,
                selectable: false,
                hoverCursor: "point"
            });

            var textEditable = new fabric.IText(
                parseFloat(values[j + padding][i + padding].toFixed(4)) + "", {
                left: leftOffset + i * rectWidth,
                top: topOffset + j * rectHeight,
                originX: 'left',
                originY: 'top',
                editable: true,
                ...customProperties,
                appProperties: {
                    i: i,
                    j: j
                }
            });

            var circle = new fabric.Circle({
                radius: 10,
                fill: 'blue',
                stroke: 'blue',
                strokeWidth: 3,
                left: textEditable.left + textEditable.width / 2,
                top: textEditable.top + textEditable.height,
                originX: 'left',
                originY: 'top',
                editable: true,
                ...customProperties,
                appProperties: {
                    i: i,
                    j: j
                }
            });

            // Double-click event handler
            var fabricDblClick = function (obj, obj1, handler) {
                return function () {
                    if (obj.clicked) handler(obj, obj1);
                    else {
                        obj.clicked = true;
                        setTimeout(function () {
                            obj.clicked = false;
                        }, 500);
                    }
                };
            };

            // ungroup objects in group
            var items;
            var ungroup = function (group) {
                items = group._objects;
                group._restoreObjectsState();
                canvas.remove(group);
                canvas.renderAll();
                for (var i = 0; i < items.length; i++) {
                    canvas.add(items[i]);
                }
            };

            circle.left = rect.left + (rect.width - circle.width) / 2;
            circle.top = rect.top + (rect.height - circle.height) / 2;

            textEditable.left = rect.left + (rect.width - textEditable.width) / 2;
            textEditable.top = rect.top + ((rect.height - circle.height) / 2 - textEditable.height) / 2;

            var group = new fabric.Group([textEditable, circle], {
                ...customProperties,
                appProperties: {
                    i: i,
                    j: j
                }
            });

            textEditable.on('editing:exited', function () {
                for (var i = 0; i < items.length; i++) {
                    canvas.remove(items[i]);
                }
                var grp = new fabric.Group(items, {
                    ...customProperties,
                });
                canvas.add(grp);
                lhsOrg[items[0].appProperties.j][items[0].appProperties.i] = parseInt(items[0].text);

                redraw();

                grp.on('mousedown', fabricDblClick(grp, items[0], function (obj, obj1) {
                    ungroup(obj);
                    canvas.setActiveObject(obj1);
                    obj1.enterEditing();
                    obj1.selectAll();
                }));
            });

            if (onClick) {
                group.on('mousedown', function (e) {
                    if (lastCircle != null) {
                        lastCircle.set({ fill: 'blue', stroke: 'blue' });
                    }
                    lastCircle = e.target.item(1);
                    e.target.item(1).set({ fill: 'purple', stroke: 'purple' });

                    drawInterpolationLines(
                        e.target.appProperties.i,
                        e.target.appProperties.j,
                        e.target);
                });
            } else if (!padSquare) {
                group.on('mousedown', fabricDblClick(group, textEditable, function (obj, obj1) {
                    ungroup(obj);
                    canvas.setActiveObject(obj1);
                    obj1.enterEditing();
                    obj1.selectAll();
                    canvas.renderAll();
                }));
            }

            canvas.add(rect);
            rect.moveTo(startingZ + i * rows + j);
            canvas.add(group);
            group.moveTo(startingZ + 1000 + i * rows + j);
        }
    }
}

var pline = null;
var gcircle = null;
var extraLines = [];
function drawInterpolationLines(i, j, org) {

    if (pline != null) {
        canvas.remove(pline);
    }

    if (gcircle != null) {
        canvas.remove(gcircle);
    }

    for (var extraLine in extraLines) {
        canvas.remove(extraLines[extraLine]);
    }

    var toX = rectWidth * ((i + 0.5) * sy) + lhsLeftOffset;
    var toY = rectHeight * ((j + 0.5) * sx) + lhsTopOffset;
    pline = drawArrow(org.left, org.top + org.height - 10,
        toX, toY, 100);

    if (interMethod == 0) {
        drawNearest(i, j, toX, toY);
    } else if (interMethod == 1) {
        drawLinear(i, j, toX, toY);
    }

    gcircle = new fabric.Circle({
        radius: 10,
        fill: 'green',
        stroke: 'green',
        strokeWidth: 3,
        left: toX,
        top: toY,
        originX: 'left',
        originY: 'top',
        editable: true,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingFlip: true,
        lockScalingX: true,
        lockScalingY: true,
        lockSkewingX: true,
        lockSkewingY: true,
        lockUniScaling: true,
        hoverCursor: "text",
        appProperties: {
            i: i,
            j: j
        }
    });

    gcircle.left -= gcircle.width / 2;
    gcircle.top -= gcircle.height / 2;
    canvas.add(gcircle);
}

function drawLinear(i, j, startingX, startingY) {

    i = (i + 0.5) * sy;
    j = (j + 0.5) * sx;

    i1 = Math.round(i) - 1;
    j1 = Math.round(j) - 1;
    i = Math.round(i);
    j = Math.round(j);

    drawToIJ(i, j, startingX, startingY);
    drawToIJ(i, j1, startingX, startingY);
    drawToIJ(i1, j, startingX, startingY);
    drawToIJ(i1, j1, startingX, startingY);
}

function drawToIJ(i, j, startingX, startingY) {
    var toX = rectWidth * (i + 0.5) + lhsLeftOffset;
    var toY = rectHeight * (j + 0.5) + lhsTopOffset;
    extraLines.push(drawArrow(startingX, startingY, toX, toY, 100 + extraLines.length))
}

function drawNearest(i, j, startingX, startingY) {
    var toX = rectWidth * (Math.floor((i + 0.5) * sx) + 0.5) + lhsLeftOffset;
    var toY = rectHeight * (Math.floor((j + 0.5) * sy) + 0.5) + lhsTopOffset;
    extraLines.push(drawArrow(startingX, startingY, toX, toY, 100))
}

function drawArrow(fromx, fromy, tox, toy, zIndex) {

    var angle = Math.atan2(toy - fromy, tox - fromx);

    var headlen = 15;  // arrow head size

    // bring the line end back some to account for arrow head.
    tox = tox - (headlen * 2) * Math.cos(angle);
    toy = toy - (headlen * 2) * Math.sin(angle);

    // calculate the points.
    var points = [
        {
            x: fromx,  // start point
            y: fromy
        }, {
            x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
            y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
        }, {
            x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
            y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
        }, {
            x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
            y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
        }, {
            x: tox + (headlen) * Math.cos(angle),  // tip
            y: toy + (headlen) * Math.sin(angle)
        }, {
            x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
            y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
        }, {
            x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
            y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
        }, {
            x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
            y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
        }, {
            x: fromx,
            y: fromy
        }
    ];

    var line = new fabric.Polyline(points, {
        fill: 'white',
        stroke: 'black',
        opacity: 1,
        strokeWidth: 2,
        originX: 'left',
        originY: 'top',
        selectable: false,
        hoverCursor: "point"
    });

    canvas.add(line);
    line.moveTo(zIndex);
    return line;
}

var mapping = {
    lhsRows: "lhsRows",
    lhsCols: "lhsColumns",
    imageInter: "interMethod",
    rhsRows: "rhsRows",
    rhsCols: "rhsColumns",
}

function updateData(m) {
    return () => {
        window[mapping[m]] = parseInt(document.getElementById(m).value);
        regenerate();
        redraw();
    };
}

for (var m in mapping) {
    document.getElementById(m).onchange = updateData(m);
}
