---
layout:     post
title:      "How to fix your CRA not showing in Google"
subtitle:   "Allowing Google to render and index your create-react-app"
date:       2019-02-18 15:57:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [ Tutorial ]
---

# Intro

Ever since the dawn of browsers its been a battle between communities implementing and adding new features/standards 
and search engines attempting to correctly index the entire web.

Luckily Google has been helpful with the indexing process and provides a [Fetch as Google](https://support.google.com/webmasters/answer/6066468?hl=en) tool. 
What this tool does is, in real time visits your page and displays what the Google Crawl bot would see.

Many Reactjs users when they begin to use fetch as Google run into Googlebot showing nothing like the following:
![Empty fetch as google render](/img/posts/emptyfar.png)

You might wonder why is this happening??? Unfortunately Google's crawl bot uses Chrome v41
![Google wrs using v41](/img/posts/wrs.png)

This means many features that are within your code/the libraries you use are not supported by v41. For example ```let``` is not supported.

# Babel-polyfill

The quick fix is to use [babel-polyfill](https://www.npmjs.com/package/@babel/polyfill). A polyfill is code that implements a feature on web browsers that do not support the feature. 
In other words it modifies your code to the specification of a certain browser.  

Using your favorite package manager simply do ```npm install --save babel-polyfill```. Then you ***must*** add ```import "babel-polyfill";``` to one of your react components.

This will ensure that whenever Googlebot attempts to render your page babel will pollyfill your code to use features that Chrome v41 can understand.


# Debugging Remotely

If fetch as Google is still returning an empty screen some debugging may be needed. Potentially your React is throwing an error.
To figure this out add the following to a .js file in your /public folder.

```
window.onerror = function (message, url, lineNo, colNo, error) {

   console.log(arguments);

   let container = document.createElement('div');

   container.style.color = 'red';
   container.style.position = 'fixed';
   container.style.background = '#eee';
   container.style.padding = '2em';
   container.style.top = '1em';
   container.style.left = '1em';

   let msg = document.createElement('pre');
   msg.innerText = [
      'Message: ' + message,
      'URL: ' + url,
      'Line: ' + lineNo,
      'Column: ' + colNo,
      'Stack: ' + (error && error.stack)
   ].join('\n');

   container.appendChild(msg);

   document.body.appendChild(container);
};
```

Then in your ```index.html``` add the following within your head (change the name according to what you called the file).

```
<script src="./error.js"></script>
```

This simply renders a stacktrace on a page if an error occurs such as the following:
![FAR stacktrace](/img/posts/errorfar.png)

This stacktrace will help you understand whats preventing Googlebot from rendering and properly indexing your page.

# Debugging Locally

Alternatively instead of relying on Google to display the stacktrace you can visit your website in the environment Googlebot uses.

As mentioned before Googlebot uses Chrome v41.

One can download a Chromium browser (Yes Chrome and Chromium have different names but from a rendering perspective they will be the [same](https://www.techjunkie.com/chromium-vs-chrome/) )
with version 41 from this [link](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Win/310958/). 
Simply download the mini_installer.exe on that page and start it up and use the Chrome devtools to figure out whats preventing the page from rendering.
  