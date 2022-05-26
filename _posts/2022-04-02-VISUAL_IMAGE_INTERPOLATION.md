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


<script src=
"https://cdnjs.cloudflare.com/ajax/libs/fabric.js/500/fabric.min.js">
</script>
<script src="../js/image_interpolation.js"></script>