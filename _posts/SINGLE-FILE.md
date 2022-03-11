---
layout: post
title: "Just give me a bill"
subtitle: "My struggles in proving my current address information"
date: 2020-10-30 13:44:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Relocation]
---

# Introduction

As part of a project I'm building I needed to convert a regular website (with CSS, Javascript, images, fonts, etc) to a single HTML file. This process turned out to be less complicated than I originally expected.

# Starting point

The website initially was setup very traditionally as you can see from the file structure.

![Lego blocks](/img/posts/starting_folder.PNG)

There was a single `.html` file and a bunch of Javascript, CSS and image files pulled in to create the following website

![Lego blocks](/img/posts/starting_website.PNG)

Using Chrome's nifty network search filter, you can see that there were a lot of calls to local files.

![Lego blocks](/img/posts/starting_local_requests.PNG)

To crete my starting point I moved the `index.html` file out of that file structure to break all the local file urls. 


![Lego blocks](/img/posts/broken_website.PNG)

# CSS

I started off fixing the CSS files. For the 3rd party libraries such as bootstrap, fontawesome and aos, I was able to use publicly hosted versions of the libraries.


```html
<!-- Bootstrap , fonts & icons  -->
<link rel="stylesheet" href="./css/bootstrap.css" />
<link rel="stylesheet" href="./fonts/icon-font/css/style.css" />
<link rel="stylesheet" href="./fonts/typography-font/typo.css" />
<link rel="stylesheet" href="./fonts/fontawesome-5/css/all.css" />
<!-- Plugin'stylesheets  -->
<link rel="stylesheet" href="./plugins/aos/aos.min.css" />
```

Turned into 

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.9.0/css/all.css"/>
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
```

This gave the website some form and some of the icons started working.

![Lego blocks](/img/posts/3rdparty_css.PNG)

Next the custom styles had to be embedded into the file, I first minified the CSS using the following website [https://www.toptal.com/developers/cssminifier/](https://www.toptal.com/developers/cssminifier/) and then inserted a `<style>` tag with the minified CSS into the `<head>` block.

That resulted in minimal visible changes.

![Lego blocks](/img/posts/local_css.PNG)

# Javascript

With all the CSS migrated over it was Javascript's turn.

Same as with the CSS, CDN hosts were found for the popular 3rd party libraries.

```html
<!-- Vendor Scripts -->
<script src="js/bootstrap.min.js"></script>
<!-- Plugin's Scripts -->
<script src="./plugins/fancybox/jquery.fancybox.min.js"></script>
<script src="./plugins/aos/aos.min.js"></script>
```

Turned into

```html
<!-- Vendor Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<!-- Plugin's Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js"></script>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
```

The custom Javascript was embedded in a `<script>` tag at the bottom of the page.

![Lego blocks](/img/posts/all_js.PNG)

Most of the text is now visible!

# Images

For images I had several options: scour the web for images that I could use in place of my local ones, host my local images on some online platform, or encode the images and directly embed them into the page. I choose the final option as it seemed most inspirit of what I was attempting to accomplish.

`<img<` tags within HTML pages allow you to specify a `src`. Typically this `src` is a url from which the image is fetched from. However, you can also transform your image into a base64 string and embed into the [src attribute](https://www.w3docs.com/snippets/html/how-to-display-base64-images-in-html.html). The same can be done for a CSS background using the `url` property. 

[https://www.base64-image.de/](https://www.base64-image.de/) is a handy tool for doing exactly this, you can upload an image and it will give you the necessary code. 

![Lego blocks](/img/posts/base64_image.PNG)

All my images were encoded into base64 strings and then directly embedded into the page, even the favicon!

![Lego blocks](/img/posts/images_embeded.PNG)

Voila! It looks almost identical to the original version of the website. For those of you with a keener eye, you may notice the only remaining difference between the original and current version of the site are the fonts!

# Fonts

Fonts are essentially a bunch of photos of the various characters in our alphabet. Which as you may have already guessed, we can encode into a base64 string and directly embed into our page.

[https://hellogreg.github.io/woff2base/](https://hellogreg.github.io/woff2base/) converts fonts to base64. I used this tool for the few fonts for which I could not find a hosted version of.

![Lego blocks](/img/posts/final_embed.PNG)

This is identical to the original version, except all the CSS, Javascript, Images and Fonts are embedded locally into the HTML file.

# Escaping

In the end I actually needed to have this HTML page returned by a Javascript function, the only additional fix I had to do to allow this was to escape all the `\` characters to be `\\`. 

# Final Product

As you can tell from the following two images the starting and ending product are identical (besides the network calls).

![Lego blocks](/img/posts/starting_with_network.PNG)
![Lego blocks](/img/posts/final_embed.PNG)

# Performance

For a little fun I decided to compare the performance of the two pages. 

The following JS snippet

```javascript
window.performance.timing.domComplete - window.performance.timing.requestStart
```

uses the [`window.performance.timing`](https://stackoverflow.com/questions/16808486/explanation-of-window-performance-javascript) object to measure how long between the page request start event to the page loaded event (including all fonts, styles, etc). On my machine the non embedded version tended to be quicker by about 10-30ms which is hardly visible to the end user.

Overall embedding all your assets into one page is not very practical, but, it is feasible and has minimal impact on the end user (atleast for such a minimal site like this). I recently saw a chrome extension called SingleFile posted on [Hacker News](https://news.ycombinator.com/item?id=30527999), which allows others to perform this above mentioned process automatically! 