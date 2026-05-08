---
layout: post
title: "Coding is not solved"
subtitle: "Why LLMs allow software engineers to flourish"
date: 2026-05-07 09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

> "coding is a solved problem"

For some LLMs are being viewed as a higher abstraction level, above code, the same way compilers allowed us to move away from Assembly, Java allowed us to move away from manual memory management and Javascript let us move away from types.<sup id="a1">[1](#f1)</sup>

However that is far from reality.

LLMs consistently produce errors at several levels: technical, architectural and product:

LLMs have numerous bugs in their code. I had an LLM create an AWS SDK JS v3 caching middleware and it predictably [forgot to deduplicate in-progress requests](https://github.com/kwojcicki/aws-sdk-js-cache/commit/589d754d546a66b54338847358a60a620100c99e) until explicitly prompted. While it excels at Leetcode styled coding, without explicit steering it consistently fails to produce effective functioning code, [especially if it cannot access the internet](https://arxiv.org/html/2605.03546v1).

LLMs love to add new rather then extend old code. This leads to your project exploding in size and [Gary Tan level of LoC's](https://x.com/garrytan/status/2038555792052506941) committed each day. This brings along the whack-a-mole of problems where you fix one bug and 10 others appear. I have yet to see a successful, larger piece of software heavily written by LLMs. <sup id="a2">[2](#f2)</sup>

LLMs are trained on every product under the sun, unfortunately, both as users of the products and as software engineers, most products suck. Besides numerous bugs, they are simply not a joy to use. I open up Sharepoint immediately question my decisions to write a document, I open Chrome and my computer crawls to a stop or I share my screen on Zoom and am bombarded with popups. Every LLM app looks and feels the same, apps that are introducing [LLMs have deteriorated significantly](https://wwj.dev/posts/i-am-worried-about-bun/).

Great abstractions do not allow errors at a technical or architectural level and can heavily limit the poor product level choices you make. Abstractions can have bugs, but the bugs existence is deterministic (the bug itself may not be).

S3 is a great abstraction. When I call S3::GetObjectCommand, I get the object every time. S3 doesn't support append, while feasible it breaks their underlying design tenets and would provide a subpar user experience.<sup id="a3">[3](#f3)</sup>

LLMs don't provide such an abstraction. It's a slot machine, sometimes the code provided will be correct and sometimes it won't. LLMs won't question your decisions, "you're right that's an absolutely great idea!" no it's not. LLMs, unless explicitly prompted not to, actively lead you towards what you desire but not in the right way (see the reward hacking section of the [Mythos System Card](https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf)). Eventually you're left with a big ball of mud that is impenetrable by anyone.

LLMs are not an abstraction, they are a tool at generating more code. In order to use a tool you need to be fluent in its environment, AWS is a great tool if you know how to build cloud platforms it's pretty useless otherwise, but as individuals continuously utilize LLMs their [skills atrophy](https://larsfaye.com/articles/agentic-coding-is-a-trap). The short term LLM bugs can be squashed relatively quickly, the negative long term impact may take months or years to show, and once it shows will anyone working on that team remember what good code is. Why does the login popup take 2 seconds to show up? Why does the app keep rerendering? Why does a file save only work half the time?

Coding is a skill that needs to honed and practiced every day. Like any skill it takes repeated, spaced out exposure to gain expertise in. LLMs are equivalent to a deload for weightlifters, you can relax for some time focus on other pressing matters and return energized and stronger. When abused your skills deteriorate and you need to rebuild your progress from the beginning.

Utilizing LLMs inherently requires a good prompt, which inturn requires a [good coder](https://arxiv.org/abs/2410.19792). Coding is still an intractable problem with huge opportunity to distinguish yourself with merit.<sup id="a4">[4](#f4)</sup>

# Notes

<b id="f1">[1]</b>This blog is agnostic to your thoughts on memory management and type safety [↩](#a1)

<b id="f2">[2]</b> I would love counter examples [↩](#a2)

<b id="f3">[3]</b> It does for very specific use cases https://aws.amazon.com/about-aws/whats-new/2024/11/amazon-s3-express-one-zone-append-data-object/ [↩](#a3)

<b id="f4">[4]</b>I am very much pro LLM/coding agents. I've gotten huge benefits out of them for designing and prototyping applications but I consistently see them breaking when not babied into the proper direction. [↩](#a4)
