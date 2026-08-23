---
layout: post
title: "The new Age of Developer Experience Tools"
subtitle: "How LLMs will bring around the next revolution in DevEx"
date: 2026-08-22 09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

LLMs make producing code cheaper, but they do not make changing production systems cheaper. In order to keep production running a Developer Experience revolution will need to take place.

### The new Age of Developer Experience Tools

The sheer amount of code getting pushed into production has risen dramatically with the rise of LLMs, Github says commits have [doubled](https://tech.yahoo.com/computing/articles/github-says-commits-doubled-last-222602229.html), Honeycomb has [roughly doubled their PR rate](https://www.honeycomb.io/blog/30-70-prs-day-how-we-managed-not-wreck-systems) and Anthropic touts [67%](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic). As companies continue to adopt and encourage these technologies the rate will only increase.

Whats not stated in those articles (aside from the Honeycomb one) or any other AI propaganda, is that production incidents are on the rise too.

While the technical causes for incidents are different, they largely  stems from the ripple effects of using preexisting DevEx tools that are not cut out for this increased rate of production changes. 

Master branches are in a permanent red state with huge backlogs, figuring out where your code is deployed is a full day effort, automated pipelines take longer to run and provide less confidence, root causing and automatic mitigation is becoming infeasible, Git index sizes are exploding in size, LSPs/IDEs require special tooling to handle new huge codebases, PRs require constant rebasing due to merge conflicts.

Many of these were already issues before, [Uber was dealing with a red master issue back in 2019](https://blog.acolyer.org/2019/04/18/keeping-master-green-at-scale/), [Meta created Pyrefly to typecheck their giant Instagram monorepo back in 2024](https://github.com/facebook/pyrefly), [Blue Green deployments were a golden path for the past 15 years](https://martinfowler.com/bliki/BlueGreenDeployment.html).

These issues were isolated to large scale FAANG companies.

Now with LLMs these problems are creeping into the lives of more and more companies.

### Why more DevEx tooling

Whats good for humans is good for LLMs. 

- While an LLM can scrap data from 4 systems and write a Lean proof to pinpoint what exact git commit caused an outage. It would be much simpler (for the human to validate the result and for the AI to generate the result) if there was a deterministic tool to enhance your distributed trace with artifact metadata, covering the exact request context across libraries, downstream services and feature flags.
- As the number of Blue Green deployments scale, custom bespoke software is built to manage safe commit bisection. It would be much simpler if that just came out of the box for your language/deployment software.
- Improvements in one portion of the system lead to degradation in another part. It would be amazing to run experiments that could provide statistically sound evidence of improvement and acceptable downstream impact.

At the end of the day LLMs perform similar actions to humans, but much quicker, if we expect humans (empowered by agents) to keep up with the rate of change than we need to empower the tools at their disposal.

Otherwise we'll be in the same mess many large companies are in now. Reliability is slipping with no silverbullet in sight besides heavy bureaucratic  processes to slow developers down again.

### No premature optimization

What's important while we experiment is to not congregate on a golden path too early. Look at the evolution of LLM paradigms, first it was prompt engineering, then context engineering, then ralph loops and now its graph engineering (maybe by the time you're reading this it's something else).

We can imagine this similar to gradient descent. Improving the local maxima is beneficial but finding the next, lower local, maxima is even better. With how quickly LLM models are advancing we shouldn't ground ourselves with minor improvements.

This will result in duplicate work and wasted effort, but DevEx tools feel long tailed to me and long term impact of missing an innovation is costly. 

Even the suggestions above I don't think are pushing the envelope enough. I want my language's typesystem to let me explicitly encode any variant in the world, I want to be able to rewind/fast forward a production system while examining arbitrary parts of it, I want a better way to navigate my source code.

### When the music dies

LLMs have certainly fueled the hype for increased developer productivity, new budgets have materialized out of thin air and experimentation is being rewarded. The freedom for developers to experiment with improving their productivity is unparamount. 

A question remains of what will happen to these budgets and innovation efforts if the AI hype bubble bursts again. Similar to the dot com bust many DevEx startsup will fade away, those not just riding the hype wave will find their spot within the ecosystem ([Antithesis](https://antithesis.com/) comes to mind). 

### Conclusion

LLMs may have dubious positive customer impact, but they have undeniable downstream impact on our services, developers and infrastructure. While their is plenty of fear mongering over the safety of software development jobs, there is no doubt in my mind if LLMs continue to prosper the tooling available to developers will continue to get better and better.

For those interested in starting a business or a side hustle, and are enthusiastic about improving the lives of developers, now is the perfect time to get into a DevEx startup. Or if you aren't interested in that avenue just daydream about how you want your workflow to be better and see if your favorite coding agent can help make it a reality.
