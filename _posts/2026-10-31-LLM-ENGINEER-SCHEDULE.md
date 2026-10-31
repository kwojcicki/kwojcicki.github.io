---
layout: post
title: "LLM Engineer's Schedule"
subtitle: "How the Maker's schedule has changed"
date: 2026-10-31  09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

The [Maker's and Manager's Schedule](https://www.paulgraham.com/makersschedule.html) are famous idiom's for how individual contributors and managers contribute successfully to a business. The former needs long uninterrupted timeblocks, to focus on an individual task. Whereas the later, managers, can quickly hop from task to task (meeting to meeting). 

These two schedules heavily conflicted with each other. Interrupting a maker in the middle of their timeblock costs more than just that interruption, it also costs the time to ramp down and ramp back up, a singular meeting [within a focus time block could easily nullify its effectiveness](https://imgur.com/A40L7v2). Not allowing Manager's to schedule meetings inhibits them from doing their job.

![The LLM Engineer's Schedule](/img/posts/makers_vs_managers.png)

LLM's have put a twist into this equation. Makers now have tireless, perpetually working machines. Giving makers constant uninterrupted background timeblocks with the ability to engage in meetings.

![The LLM Engineer's Schedule](/img/posts/llm_engineers_schedule.png)

### 9-5 is no longer the expectation

Each company has it's own cultures and expectations of how long an engineer would work but there was an inevitability that developers would eventually sleep and productivity would halt. 

Agents however do not stop, they can work autonomously for [hours on end](https://openai.com/index/navier-stokes-solution/#citation-bottom-1:~:text=Nearly%20100%20agents%20worked%20together%20for%20approximately%2050%20hours%20to%20produce%20our%20Euler%20regularity%20disproof1).

The LLM engineer themselves will not always be working, but those that do not have agents running 24/7 will be left behind. Engineers will need to build the skills, processes and orchestration that enables them to kick off an agent and let it run autonomously for 12+ hours and come back to meaningful results the next day.

Working on the right thing is certainly more important than [working on the wrong thing](https://x.com/b0rk/status/1367172498954059791), but so is doing that faster and [iterating quickly to figure out what the right thing is](https://danluu.com/productivity-velocity/#:~:text=A%20specific%20example%20of,problem%20is%20worth%20solving.). Both of these are facilitated by properly allocating your time.

### Morning

The morning, similar to the past, is reserved for deep work. Kicking off new strands of work and iterating on past agent runs.

New agent runs will require building context (for the engineer and the agent), understanding the problem space, available solutions, [trade-offs](https://kwojcicki.github.io/blog/TRADE-OFFS), testing, deploying and monitoring strategies. Once those have been established a well defined prompt, with clear outcomes and next steps, can be crafted and sent off on its way.

It's imperative that the agent has a success criteria to iterate on themselves and for this to serve as your basis for judging its work later. The agent will inevitably make some mistake, small ones can be absorbed or ignored, catastrophic mistakes that invalidate the agents work waste your time. These catastrophic mistakes occur for a variety of reasons: a lack of context, too much context, a hallucination, an incorrect instruction given in the prompt. Regardless the reason, the desire is to minimize catastrophic mistakes by thinking about potential pitfalls the agent may run into and proactively guarding against them. LLM's don't remove the thinking, they remove the rote implementation and place a larger emphasis on thinking.

A key note is that you need to focus this time on whats important to the business. As human's it is difficult for us to context switch and immediately go deep into that topic, while it's tempting to spin up 100 agents to refactor everything, fix those old bugs, add new features you're better off shipping an important project than losing focus on a shiny new thing. 

### Early afternoon

You've made progress on your highest priority projects and it's time to fulfill your meeting duties: sprint planning, retrospective, stand-ups, project planning, design reviews, etc.

Between meetings minor iteration can be accomplished but this work will largely stem around low effort feature work that requires no deep work.

But fear not your your agents continue marching towards your goals.

The last part of your early afternoon, while you still have the energy and mental capacity, is to kick off the next round of high value agent runs. This may be the next step in project work, hypothesis testing or research for tomorrow's runs. This is so that your night isn't "wasted".

### Late afternoon

By this point in the day individuals will not be in the best position to make decisions, this is a good time for low cognitive load tasks: jira cleanup, email cleanup, scheduling, validating small tweaks have been successful or kicking off more minor tweaks.

### Retrospectives

Using [AI is a skill](https://www.seangoedecke.com/getting-good-at-ai-takes-time-and-practice/) that we are all learning, new models and new techniques come out monthly. Improving your processes and personal tooling is imperative. Look at the last week and identify what went well and what didn't.

Why did one agent flounder aimlessly for 12 hours and produce nothing, but a rerun with a minor prompt tweak resulted in excellent results.

How could you have gained more confidence that code agents produced was correct.

### Long running tasks and Weekends

Weekends are an opportunity for you to give agent 48-72 hours of time and try something out. Place your [moonshot bets](https://danluu.com/ambitious/) and see if anything salvageable comes out of it. 

Treat these as learning experiences as well. Try out various strategies and techniques and see what happens. Try recreating a feature you made that week using a different model, a different prompt or a different set of MCP/tool access.

### Budget

This post has assumed you have infinite capital and ability to kick off agents that cost thousands of dollars. As AI companies IPO and are no longer sustained through VCs there will be increased prices and then scrutiny on AI spending. The budget friendly version of this is running open weight models locally on your work machine, this puts more emphasis on engineers to make the right bets on what the AI can accomplish unguided vs where more guidance (therefore more prework and AI skill) will be needed.
