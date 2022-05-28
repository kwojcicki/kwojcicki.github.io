---
layout: post
title: "Visual image interpolation"
subtitle: "Visually learn how images are resized!"
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
</style>

<script type="text/javascript" async src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML'></script>

# Introduction

Have you ever wondered how an image can have its size doubled yet keep its original image quality? This is thanks to a technique called [image interpolation](https://en.wikipedia.org/wiki/Image_scaling) which has been developed by mathematicians and researchers over hundreds of years. Some of the more intricate image interpolation formulas include: Lanczos resampling and bicubic interpolation.

![Image scaling example](/img/posts/image_scaling.PNG)

Before understanding how image interpolation works, we need to better understand what an image is actually composed of. We can imagine an image as 1 or more 2d matrices. Where each matrix represents a channel; the most common channels are Red, Green, Blue and Alpha (commonly abbreviated to rbga). A pixel at position $$ (i, j) $$ is represented by a tuple created by concatenating the values from each channel at $$ (i, j) $$. For example a pixel in an rgba image could be generally represented as $$ ( R_{i,j}, G_{i,j}, B_{i,j}, A_{i,j} ) $$ where $$ R, G, B, A $$ are all matrices. 

![RGB channel separated image](https://upload.wikimedia.org/wikipedia/commons/5/56/RGB_channels_separation.png?20110219015028)

When we are resizing an image we recreate all the channels except with a different number of rows and/or columns. But what values do we put inside these new matrices? The exact process depends on what type of image interpolation you are performing, in general there are 2 steps which are repeated for every element in every channel. Each element is projected onto the old matrix, then using the elements surrounding the projected position we can interpolate the new elements value. 

Using the below graphical tool you can dive deeper into the various interpolation techniques and learn exactly how they operate. Alternatively visit the blog posts linked below for a deeper dive into each interpolation technique.

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
    <label for="lhsRows">Original image rows</label>
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
    <label for="lhsCols">Original image columns</label>
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
      <option value="0">Nearest neighbor</option>
      <option value="1" selected>Bilinear interpolation</option>
    </select>
  </div>
</div>
<div style="display: flex; padding-top: 40px">
  <div style="padding-right: 20px">
    <label for="rhsRows">New image rows</label><br/>
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
    <label for="rhsCols">New image columns</label><br/>
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

<script src=
"https://cdnjs.cloudflare.com/ajax/libs/fabric.js/500/fabric.min.js">
</script>
<script src="../js/image_interpolation.js"></script>

To learn more about the actual math and implementation of these various interpolation methods see the below blog posts:
- [nearest neighbor](./NEAREST-NEIGHBOUR)
- Bilinear interpolation