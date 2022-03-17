---
layout: post
title: "Minimizing an entire website"
subtitle: "Combining a fully fledged website into one single HTML file."
date: 2022-03-16 19:22:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

# Introduction

As part of a project I'm building, I needed to convert a regular website (with CSS, JavaScript, images, fonts, etc.) to a single HTML file. Initially I wasn’t even sure if this was possible, where would I store the images or the fonts? This process turned out to be less complicated than I originally expected.

# Starting point

The website I needed to convert had a very traditional setup, as you can see from the file structure.

![Lego blocks](/img/posts/starting_folder.PNG)

There was a single `.html` file and a bunch of JavaScript, CSS and Image files pulled-in to create the following website

![Lego blocks](/img/posts/starting_website.PNG)

Using Chrome's nifty network search filter you can see that there were a lot of calls to local files.

![Lego blocks](/img/posts/starting_local_requests.PNG)

To create my starting point, I needed to break all the local file URLs. This way I could be sure I wasn’t accidentally pulling in any local files.I achieved this by moving the `index.html` file out of the initial file structure. 
![Lego blocks](/img/posts/broken_website.PNG)

# CSS

I started off by fixing the CSS files. I used publicly hosted versions of popular 3rd party libraries including bootstrap, fontawesome and aos. As a result, the following


```html
<!-- Bootstrap , fonts & icons  -->
<link rel="stylesheet" href="./css/bootstrap.css" />
<link rel="stylesheet" href="./fonts/icon-font/css/style.css" />
<link rel="stylesheet" href="./fonts/typography-font/typo.css" />
<link rel="stylesheet" href="./fonts/fontawesome-5/css/all.css" />
<!-- Plugin'stylesheets  -->
<link rel="stylesheet" href="./plugins/aos/aos.min.css" />
```

turned into 

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.9.0/css/all.css"/>
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
```

This gave the website some form and some of the icons started working.

![Lego blocks](/img/posts/3rdparty_css.PNG)

Next, the custom styles had to be embedded into the file. First, I minified the CSS using the following website [https://www.toptal.com/developers/cssminifier/](https://www.toptal.com/developers/cssminifier/) and then inserted a `<style>` tag with the minified CSS into the `<head>` block.

This resulted in minimal visible changes.

![Lego blocks](/img/posts/local_css.PNG)

# Javascript

With the CSS migration complete, it was time to fix the JavaScript.

Same as with the CSS, CDN hosts were found for the popular 3rd party libraries.

```html
<!-- Vendor Scripts -->
<script src="js/bootstrap.min.js"></script>
<!-- Plugin's Scripts -->
<script src="./plugins/fancybox/jquery.fancybox.min.js"></script>
<script src="./plugins/aos/aos.min.js"></script>
```

turned into

```html
<!-- Vendor Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<!-- Plugin's Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js"></script>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
```

The custom JavaScript was embedded in a `<script>` tag at the bottom of the page.

![Lego blocks](/img/posts/all_js.PNG)

Most of the text is now visible!

# Images

For Image fixes I had several options: scour the web for images that I could use in place of my local ones, host my local images on some online platform, or encode the images and directly embed them into the page. I chose the final option as it seemed most aligned with what I was trying to accomplish.

`<img>` tags within HTML pages allow you to specify a `src`. Typically, this `src` is a URL from which the image is fetched. However, you can also transform your image into a base64 string and embed it into the [src attribute](https://www.w3docs.com/snippets/html/how-to-display-base64-images-in-html.html). The same can be done for a CSS background using the `url` property. 

[https://www.base64-image.de/](https://www.base64-image.de/) is a handy tool for doing exactly this; you can upload an image and it will give you the necessary code to do the embedding. 

![Lego blocks](/img/posts/base64_image.PNG)

All my Images were encoded into base64 strings and then directly embedded into the page, even the favicon!

![Lego blocks](/img/posts/images_embeded.PNG)

Voilà! It looks almost identical to the original version of the website. For those of you with a keener eye, you may notice that the remaining difference between the original and current version of the site are the fonts!

# Fonts

Fonts are essentially a bunch of photos of the characters in our alphabet. Which, as you may have already guessed, we can encode into a base64 string and directly embed into our page.

[https://hellogreg.github.io/woff2base/](https://hellogreg.github.io/woff2base/) converts fonts to base64. I used this tool when I was unable to find a hosted version of the font.

![Lego blocks](/img/posts/final_embed.PNG)

This converted website looks identical to its original version, except all the CSS, Javascript, Images and Fonts are embedded locally into the HTML file.

# Escaping

Lastly, I needed to have this HTML page returned by a JavaScript function. To accomplish this, the only additional fix I needed to make was escape all the `\` characters to be `\\`. 

# Final Product

As you can tell from the following two images, the starting and ending product are identical (besides the network calls).

![Lego blocks](/img/posts/starting_with_network.PNG)
![Lego blocks](/img/posts/final_embed.PNG)

# Performance

For a little fun I decided to compare the performance of the two pages. 

The following JS snippet

```javascript
window.performance.timing.domComplete - window.performance.timing.requestStart
```

uses the [`window.performance.timing`](https://stackoverflow.com/questions/16808486/explanation-of-window-performance-javascript) object to measure the time between the page request start event to the page loaded event (including all fonts, styles, etc). On my machine, the non-embedded version tended to be quicker by about 10-30ms which is hardly noticeable to the end user.

Overall, embedding all your assets into one page is not very practical, but it is feasible and has minimal impact on the end user (at least for such a minimal site like this). 

I had to go through this process to deploy my website onto a FaaS platform, the following Chrome extension I recently discovered, called SingleFile, posted on [Hacker News](https://news.ycombinator.com/item?id=30527999) which allows others to perform this embedding process automatically!