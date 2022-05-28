---
layout: post
title: "Visual image interpolation example"
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


<div style="display: flex">
  <div style="padding-right: 20px">
<label for="lhsRows">Left hand side rows</label>

<select name="lhsRows" id="lhsRows">
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
</select>
  </div>
  <div style="padding-right: 20px">

<label for="lhsCols">Left hand side columns</label>

<select name="lhsCols" id="lhsCols">
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
</select>
  </div>
</div>

<script src=
"https://cdnjs.cloudflare.com/ajax/libs/fabric.js/500/fabric.min.js">
</script>
<script src="../js/image_interpolation.js"></script>