---
layout: post
title: "PMF and CDF Calculator"
subtitle: "Probability Mass Function (PMF) and Cumulative Distribution Function (CDF) Graphing Calculator"
date: 2020-10-30 13:44:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Calculator]
---

<script type="text/javascript" async src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML'></script>
<script type="text/javascript" charset="UTF-8"
 src="//cdnjs.cloudflare.com/ajax/libs/jsxgraph/1.1.0/jsxgraphcore.js"></script>
<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/jsxgraph/1.1.0/jsxgraph.css" />

# Calculator

## Probability Mass Function (PMF)

<table>
<tr id="xs">
<td> $$ x $$ </td>
<td> <input type="number" min="0" id="x_1" value="1" onkeyup="myFunction(1)" /> </td>
<td> <input type="number" min="0" id="x_2" value="2" onkeyup="myFunction(2)" /> </td>
<td> <input type="number" min="0" id="x_3" value="4" onkeyup="myFunction(3)" /> </td>
<td> <input type="number" min="0" id="x_4" value="0" onkeyup="myFunction(4)" /> </td>
</tr>
<tr id="pxs">
<td> $$ p(x) $$ </td>
<td> <input type="number" min="0" id="px_1" value="0.5" onkeyup="myFunction(1)" /> </td>
<td> <input type="number" min="0" id="px_2" value="0.25" onkeyup="myFunction(2)" /> </td>
<td> <input type="number" min="0" id="px_3" value="0.25" onkeyup="myFunction(3)" /> </td>
<td> <input type="number" min="0" id="px_4" value="0" onkeyup="myFunction(4)"  /> </td>
</tr>
</table>

<p></p>

<div> <div id="ex" style="display: inline;" > </div>
</div>

## Cumulative Distribution Function (CDF)

<button onclick="get_cdf()"> Calculate CDF </button>

<div id="cdf_function" style="text-align: center;"></div>

<div id="box" style="width: 500px; height: 500px;"></div>

# PMF and CDF Explanations

## PMF

The [PMF](https://en.wikipedia.org/wiki/Probability_mass_function) of a random variable $$ X $$ is a function associating the possible values of $$ X $$ and their associated probabilities; for example $$ p_{X}(x_i) = P(X = x_i) $$. A PMF can be created by filling in a table, one row representing all possible values, while the other row represents the associated probabilities. One has to ensure that $$ \sum_{x_i \in X} p_X(x_i) = 1 $$ and that $$ p_X(x_i) \geq 0 $$.

## CDF

The [CDF](https://en.wikipedia.org/wiki/Cumulative_distribution_function) of a random variable $$ X $$ is a function that represents the probability that $$ X $$ will be less than or equal to $$ x $$. The function is defined as $$ F_X(x) = P(X \leq x) $$. Using the table generated while creating the PMF one can calculate the value of $$ F_X(x) $$ by summing all associated probabilities for possible values $$ \leq x $$.

<script>
var columns = 4;
function myFunction(id){
  
  if(id == columns){
    columns += 1;
    const xs = document.getElementById("xs");
    const pxs = document.getElementById("pxs");

    const new_column = document.createElement("td");
    new_column.innerHTML = '<input type="number" min="0" id="x_'  + columns + '" value="0" onchange="myFunction(' + columns + ')" onkeyup="myFunction(' + columns + ')" />'
    xs.appendChild(new_column)

    const new_column_pxs = document.createElement("td");
    new_column_pxs.innerHTML = '<input type="number" min="0" id="px_' + columns + '" value="0" onchange="myFunction(' + columns + ')" onkeyup="myFunction(' + columns + ')" />'
    pxs.appendChild(new_column_pxs)
  }

  get_ex();
  // get_cdf();
}

function get_ex(){
  console.log("Getting EX");
  var total = 0;
  for(var i = 1; i <= columns; i++){
      const x = document.getElementById("x_" + i);
      const px = document.getElementById("px_" + i);
      console.log(x.value + " " + px.value);
      total += x.value * px.value;
  }

  document.getElementById("ex").innerHTML = "\\( E(x) = " + total + " \\)";

  MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById("ex")]);
}

function get_cdf(){
  console.log("Getting CDF");
  JXG.JSXGraph.freeBoard(board);
  board = JXG.JSXGraph.initBoard('box', {axis:true,
    showNavigation:false, showCopyright:true, pan: {
                  enabled: true,
                  needShift: false
              },
            zoom: {
              factorX: 1.25,
              factorY: 1.25,
              wheel: true,
              needshift: false,
              eps: 0.1
          }

  });

  var pairs = [];
  for(var i = 1; i <= columns; i++){
      const x = document.getElementById("x_" + i);
      const px = document.getElementById("px_" + i);
      pairs.push([parseFloat(x.value), parseFloat(px.value)])
  }

  pairs.sort(sortFunction);
  pairs.splice(0, 1);

  function sortFunction(a, b) {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] < b[0]) ? -1 : 1;
      }
  }

  var cdf_function = "\\( f(x) = \\begin{cases} ";
  
  // n/2,  & \text{if $n$ is even} \\ 3n+1, & \text{if $n$ is odd}"

  cdf_function += " 0, & \\text{if x < " + pairs[0][0] + " } \\\\ ";

  board.create('functiongraph',[function(x){ return 0;},-Infinity,pairs[0][0]]);
  p = board.create('point',[pairs[0][0], 0],{color:'black',name:'',size:3, fillcolor: 'white'});
  p.setAttribute({fixed:true});
  p.setAttribute({fillColor: 'white'})

  var total = 0
  for(var i = 0; i < pairs.length - 1; i++){

    if(pairs[i][0] != pairs[i + 1][0]){
      total += pairs[i][1]
      const tempTotal = total;
      cdf_function += " " + total + ", & \\text{if }" + pairs[i][0] + " \\le x \\text{ < " + pairs[i + 1][0] + " } \\\\ "; 
      board.create('functiongraph',[function(x){ return tempTotal;},pairs[i][0],pairs[i + 1][0]]);

      var p = board.create('point',[pairs[i][0], total],{color:'black',name:'',size:3, fillColor: 'red', strokeColor:'black' });
      p.setAttribute({fixed:true});

      p = board.create('point',[pairs[i + 1][0], total],{color:'black',name:'',size:3, fillcolor: 'white'});
      p.setAttribute({fixed:true});
      p.setAttribute({fillColor: 'white'})
    }
  }

  cdf_function += " 1, & \\text{if } x \\geq " + pairs[columns - 2][0] + " \\\\ ";
  board.create('functiongraph',[function(x){ return 1;},pairs[columns - 2][0],Infinity]);
  p = board.create('point',[pairs[columns - 2][0], 1],{color:'black',name:'',size:3, fillcolor: 'white'});
  p.setAttribute({fixed:true});

  cdf_function += "\\end{cases} \\)";

  const el = document.getElementById("cdf_function");
  el.innerHTML = cdf_function;

  MathJax.Hub.Queue(['Typeset', MathJax.Hub, el]);

  // board.create('point',[0,1],{color:'black',name:'',size:3});
  // board.create('point',[2,1],
  //   {color:'black',name:'',size:3,fillColor:'white'});
    
  // board.create('point',[5,3],{color:'black',name:'',size:3});
  // board.create('functiongraph',
  //   [function(x){ return (-2/9)*(x-5)*(x-5)+3;},2,5]);

  board.update();
}

function defer(method) {
    console.log("deferring");
    if (window.MathJax) {
        method();
    } else {
        setTimeout(function() { defer(method) }, 50);
    }
}

var board = null;
defer(function (){
  board = JXG.JSXGraph.initBoard('box', {axis:true,
    showNavigation:false, showCopyright:true, pan: {
                  enabled: true,
                  needShift: false
              },
            zoom: {
              factorX: 1.25,
              factorY: 1.25,
              wheel: true,
              needshift: false,
              eps: 0.1
          }

  });

  get_ex();
  get_cdf();
})

</script>
