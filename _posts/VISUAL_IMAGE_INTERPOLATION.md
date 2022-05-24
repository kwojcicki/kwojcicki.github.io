---
layout: post
title: "Announcing EasyFaaS v0.1.0"
subtitle: ""
date: 2022-04-02 16:00:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---
<style>
    #myCanvas {
    background: lightgrey;
    width: 600vw;
}

.canvas-container {
    
  /* width: 90vw;*/
  position: relative;
  left: calc(-45vw + 50%);
}
</style>
<canvas id="myCanvas" width="600vw" height="500"></canvas>


<script src=
"https://cdnjs.cloudflare.com/ajax/libs/fabric.js/500/fabric.min.js">
</script>

<script>
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
var hasInput = false;

const rectWidth = 150;
const rectHeight = 150;

const rhsLeftOffset = 900;
const rhsTopOffset = 200;
const rhsColumns = 4;
const rhsRows = 4;

const lhsLeftOffset = 200;
const lhsTopOffset = 300;
const lhsColumns = 2;
const lhsRows = 2;
const lhsWidth = lhsColumns * rectWidth;
const lhsHeight = lhsRows * rectHeight;

var sx = lhsRows / rhsRows;
var sy = lhsColumns / rhsColumns;

// 0 == nearest
// 1 == linear interpolation
var interMethod = 0;

drawGrid(rhsColumns, rhsRows, rhsLeftOffset, rhsTopOffset, 1);
drawGrid(lhsColumns, lhsRows, lhsLeftOffset, lhsTopOffset, lhsRows * lhsColumns + 1);

function drawGrid(cols, rows, leftOffset, topOffset, startingZ){
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            var rect = new fabric.Rect({
                left: leftOffset + i * rectWidth,
                top: topOffset + j * rectHeight,
                originX: 'left',
                originY: 'top',
                width: rectWidth,
                height: rectHeight,
                angle: 0,
                fill: 'rgba(255,0,0,0.5)',
                stroke: 'rgba(0,0,255,0.5)',
                strokeWidth: 1,
                transparentCorners: false,
                selectable: false,
                hoverCursor: "point"
            });
            var textEditable = new fabric.IText(
                '30', {
                left: leftOffset + i * rectWidth,
                top: topOffset + j * rectHeight,
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
            textEditable.left = textEditable.left + ( rectWidth - textEditable.width) / 2 ;
            textEditable.top = textEditable.top + ( rectHeight - textEditable.height) / 2 ;
            textEditable.on('changed', function(e) {
                console.log('recalculate', e);
            });
            textEditable.on('mousedown', function(e) { 
                // e.target should be the circle
                console.log(e.target);
                console.log(e.target.appProperties.i + " " + e.target.appProperties.j);
                drawInterpolationLines(e.target.appProperties.i, e.target.appProperties.j, e.target);
            });
            canvas.add(rect);
            rect.moveTo(startingZ + i * rows + j);
            canvas.add(textEditable);
            textEditable.moveTo(startingZ + 1000 + i * rows + j);
        }
    }
}

var pline = null;
var extraLines = [];
function drawInterpolationLines(i, j, org){

    if(pline != null){
	    canvas.remove(pline);
    }

    for(var extraLine in extraLines){
        canvas.remove(extraLines[extraLine]);
    }
    
    var toX = lhsWidth * (sx / 2 + sx * i) * sx + lhsLeftOffset;
    var toY = lhsHeight * (sy / 2 + sy * j) * sy + lhsTopOffset;
    pline = drawArrow(org.left, org.top,
        toX, toY, 100);

    if(interMethod == 0){
        drawNearest(i, j, toX, toY);
    } else if(interMethod == 1){
        // TODO:
    }
}

function drawNearest(i, j, startingX, startingY){
    var toX = lhsWidth * (Math.floor(sx / 2 + sx * i) + 0.5) * sx + lhsLeftOffset;
    var toY = lhsHeight * (Math.floor(sy / 2 + sy * j) + 0.5) * sy + lhsTopOffset;
    extraLines.push(drawArrow(startingX, startingY, toX, toY, 10))
}

function drawArrow(fromx, fromy, tox, toy, zIndex) {

	var angle = Math.atan2(toy - fromy, tox - fromx);

	var headlen = 15;  // arrow head size

	// bring the line end back some to account for arrow head.
	tox = tox - (headlen) * Math.cos(angle);
	toy = toy - (headlen) * Math.sin(angle);

	// calculate the points.
	var points = [
		{
			x: fromx,  // start point
			y: fromy
		}, {
			x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
			y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
		},{
			x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
			y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
		}, {
			x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
			y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
		},{
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
		},{
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


canvas.onclick = function(e) {
    if (hasInput) return;
    // addInput(e.clientX, e.clientY);
}

//Function to dynamically add an input box: 
function addInput(x, y) {

        console.log("filling1");
    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4 - canvas.style.left) + 'px';
    input.style.top = (y - 4 - canvas.style.top) + 'px';
    input.data = {x, y};

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

//Key handler for input box:
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        console.log("filling2");
        drawText(this.value, this.data.x, this.data.y);
        document.body.removeChild(this);
        hasInput = false;
    }
}

//Draw the text onto canvas:
function drawText(txt, x, y) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = font;
    console.log("filling3: " + txt + " " + x + " " + y);
    ctx.fillStyle = "#FF0000";
    // ctx.fillRect(20, 20, 150, 100);
    ctx.fillText(txt, x - 4, y - 4);
}
</script>