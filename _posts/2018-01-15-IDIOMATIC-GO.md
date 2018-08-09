---
layout:     post
title:      "Idiomatic Go"
subtitle:   "Opinionated Idiomatic Go style guide"
date:       2018-05-21 17:00:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [ Go ]
---

### WIP this is a living document and you can expect frequent changes to it.

Personally I really enjoy coding in Go, its concise but still gives you enough tools to get the job done. Whats also interesting about the language is Google enforces their style upon you. These styles are not very demanding but simple rules for how if/else statements should look, not having unused variables and other small details. As a team grows and codestyles become more diverse having a base style enforced is great when it comes to code quality. Of course sometimes its annoying that I can't test a new function I made because a variable is unused...

While the built in style is a great start there are some places where it can be improved upon, this page will take a look at my opinionated styleguide for Go.