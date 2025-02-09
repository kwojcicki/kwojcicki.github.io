---
layout: post
title: "Interactive image interpolation simulator"
subtitle: "Learn how images are resized!"
date: 2022-05-28 04:00:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

<style>
img {
  margin: auto
}

figcaption {
    text-align: center;
}

details {border: 1px solid #E1E1E1; border-radius: 5px; box-shadow: 0 1px 4px rgba(0, 0, 0, .4); color: #363636; margin: 0 0 .4em; padding: 1%;}

details[open] {background: #E1E1E1;}

summary {background: -webkit-linear-gradient(top, #FAFAFA 50%, #E1E1E1 50%); border-radius: 5px; cursor: pointer; font-size: .8em; font-weight: bold; margin: -1%; padding: 8px 0; position: relative; width: 102%;}

summary:hover, details[open] summary {background: #E1E1E1;}

summary::-webkit-details-marker {display: none}

summary:before{border-radius: 5px; content: "+"; color: #363636; display: block; float: left; font-size: 1.5em; font-weight: bold; margin: -2px 10px 0 10px; padding: 0; text-align: center; width: 20px;}

details[open] summary:before {content: "-"; margin-top: -4px;}

</style>


<script type="text/javascript" async src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML'></script>

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({ TeX: { extensions: ["color.js"] }});
</script>

# Introduction

Have you ever wondered how an image can have its size doubled yet keep its original image quality? This is thanks to a technique called [image interpolation](https://en.wikipedia.org/wiki/Image_scaling) which has been developed by mathematicians and researchers over hundreds of years. Some of the more intricate image interpolation formulas include: Lanczos resampling and bicubic interpolation.

![Image scaling example](/img/posts/image_scaling.PNG)

Before understanding how image interpolation works, we need to better understand what an image is actually composed of. We can imagine an image as 1 or more 2d matrices where each matrix represents a channel; the most common channels are Red, Green, Blue and Alpha (commonly abbreviated to rgba). A pixel at position $$ (i, j) $$ is represented by a tuple created by concatenating the values from each channel at $$ (i, j) $$. For example, a pixel in a rgba image could be generally represented as $$ P_{i,j} = ( R_{i,j}, G_{i,j}, B_{i,j}, A_{i,j} ) $$ where $$ R, G, B, A $$ are all matrices. 

![RGB channel separated image](https://upload.wikimedia.org/wikipedia/commons/5/56/RGB_channels_separation.png?20110219015028)

When we are resizing an image, we recreate all the channel matrices except with a different number of rows and/or columns. But what values do we put inside these new matrices? The exact process depends on the image interpolation algorithm you choose; in general, there are 2 steps which are repeated for every element in every channel. First, each element is projected onto the old matrix then using the elements surrounding the projected position we can interpolate the new elements value. 

Using the graphical tool below you can dive deeper into the various interpolation techniques and learn exactly how they operate. Alternatively, visit the blog posts linked below for a deeper dive into each interpolation technique. 

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

<div style="display: flex;">
  <div style="padding-right: 20px">
    <label for="lhsRows">Input image rows</label>
    <select name="lhsRows" id="lhsRows">
      <option value="1">1</option>
      <option value="2" selected>2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
    </select>
  </div>
  <div style="padding-right: 20px">
    <label for="lhsCols">Input image columns</label>
    <select name="lhsCols" id="lhsCols">
      <option value="1">1</option>
      <option value="2" selected>2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
    </select>
  </div>
  <div style="padding-right: 20px">
    <label for="imageInter">Image interpolation technique</label>
    <select name="imageInter" id="imageInter">
      <option value="0" selected>Nearest neighbor</option>
      <option value="1">Bilinear interpolation</option>
      <option value="2">Bicubic interpolation</option>
    </select>
  </div>
</div>

<div style="display: flex; padding-top: 40px; padding-bottom: 20px;">
  <div style="padding-right: 20px">
    <label for="rhsRows">Output image rows</label><br/>
    <select name="rhsRows" id="rhsRows">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4" selected>4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
    </select>
  </div>
  <div style="padding-right: 20px">
    <label for="rhsCols">Output image columns</label><br/>
    <select name="rhsCols" id="rhsCols">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4" selected>4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
    </select>
  </div>
</div>

<details><summary>Simulator explanation</summary>

<div markdown="1">

The simulator below is a fully interactive image interpolator. You can zoom in/out (by scrolling the mouse wheel), pan around, and edit the input image values (this can by done by double clicking the text fields on the input image).  

Click on the pixels on the right-hand side to see exactly how their values were calculated.

You may notice grey squares on the input image side; these are artificially added to the image to support your chosen interpolation algorithm. These additional elements are created by copying the border elements of the input image, thus they themselves cannot be directly changed (but if the border elements are changed then the artificially added elements will update accordingly).

The pixels have unit width and length, and their position is described by the center of the pixel. For example, the top left pixel is at $$ (0.5, 0.5) $$. This isn't too critical to understand until you take a deeper look into the implementation of these interpolation algorithms.
</div>
</details>

<canvas id="myCanvas" width="600vw" height="500"></canvas>

<script src=
"https://cdnjs.cloudflare.com/ajax/libs/fabric.js/500/fabric.min.js">
</script>

<div id="calculation" style="text-align: center; padding-top: 20px"></div>

To learn more about the actual math and implementation of these various interpolation methods see the blog posts below:
- [Nearest neighbor](./NEAREST-NEIGHBOUR)
- [Bilinear interpolation](./BILINEAR-IMAGE-INTERPOLATION)
  
<script src="../js/image_interpolation.js"></script>
