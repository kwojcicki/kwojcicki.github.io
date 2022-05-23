---
layout:     post
title:      "Cracking the FAANG internship"
subtitle:   "Comprehensive guide for getting you your next FAANG internship"
date:       2022-05-17 22:09:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"	
comments: true
tags: [ Programming ]
---

* Placeholder for Table of Content (Must not be removed)
{:toc}

# Introduction

Recently a few friends and I were preparing for interviews (specifically FAANG interviews)<sup id="a1">[1](#f1)</sup>. In a [past post](./2019-10-30-CRACKING-THE-FAANG-INTERNSHIP.md) I provided a brief overview of how one can succeed at a FAANG intern interview. While that post covers how to execute the coding segment of an interview I didn't particularly cover how to prepare for an interview. In this post I will go over how I prepared (and how I recommend others prepare) for general FAANG SWE interview. 

> Disclaimer: This is purely anecdotal, based on experiences my friends and I have had. Please don't mistake this for any sort of official statement by or about Amazon, Microsoft, Google or any other person or organization.

# Technical

## Data structures and algorithms (DSA)

Most individual's accustomed with FAANG are familiar with how to study for the DSA portion of the interview; [Leetcode](https://leetcode.com/)!

Depending on your timeline for the interview you have several options on how to best utilize Leetcode.

### Short timeline (1-2 weeks)

With such a short time horizon you need to heavily rely on your past studying efforts and bolster your knowledge for questions specific to that company. Leetcode aggregates questions based on what companies tend to ask them, while this is a premium feature, that 35$ you spend on a membership will be more than paid back if you were to land yourself a new job. These aggregations are available on the [Leetcode explore page](https://leetcode.com/explore/interview/).

In addition I would suggest [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) which is a curated list of 75 questions that are often asked in FAANG interviews. These questions are also great for covering a wide array of problem solving techniques that will be applicable to all sorts of questions. The author of Blind 75 has also released [Grid 75](https://www.techinterviewhandbook.org/grind75), I've personally not had to opportunity to use this yet.

Googling for past interview questions is also amazing for exposing yourself to the types of questions you may get asked during your interview. For example during my prep I commonly googled "amazon SDE 2 questions" and tried to solve any questions people had in the past. Leetcode also has a [discussion page](https://leetcode.com/discuss/interview-question?currentPage=1&orderBy=hot&query=) which you can use to filter to your specific company.

### Medium timeline (Several weeks)

Given several weeks you have the opportunity to do the above mentioned Leetcode questions, but also to freshen up/reinforce key concepts you may be struggling in. For example if you know you aren't good at graph or dynamic programming questions, then in addition to doing the company specific + [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) questions you can add some of the more frequently asked dynamic programming questions. If you purchase Leetcode premium you can sort questions by their frequency and use that as your own customized list of questions you should solve. For those without Leetcode premium rely on Google to show you what the more popular Leetcode questions are for a specific topic.

### Long timeline (Several months+)

You likely have this time horizon if you're just gearing up to apply for a new job. With such a long time horizon you have a great opportunity to really improve your logical thinking and programming skills. One key factor is to utilize all the time that was given to you; I don't mean studying for 8 hours a day for several months or bootcamping for a month. Instead you should actively study 20/30 minutes everyday all the way up to your interview. There is plenty of literature and research that shows short intense bursts will outperform occasional long stretches of studying. Doing 30 minutes of Leetcode a day is much better than once a week grinding out 8 hours of Leetcode.

My preferred routine is to do 1/2 questions a day, typically the daily question on Leetcode and then a question that has a high frequency for being asked. You can mix in questions specific to your company/[Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) as your interview date approaches.

## How to get the most out of a Leetcode question

Depending on your timeline how you approach being stuck on a Leetcode will differ. With short/medium timelines you don't have the luxury to spend 3 days on a single question, my advice would be after 15 minutes of being stuck to take a hint. I take hints in the following order:

- Look at related questions, to see if I can apply the same technique from that question in the one I'm stuck on (if you haven't completed those questions try doing those after to reinforce the concepts you just learned)
- Look at related topics
- Look at the titles of some of the discussion posts about the question
- Look at one of the top rated discussion posts but try to minimize how much code you look at, instead look at their English/visual descriptions and code it out yourself

With this approach you should constantly be pushing yourself to the correct answer, but like in an interview, have a buddy who can help you out a little bit.

If instead your horizon is relatively long, then it's perfectly okay for you to get stuck on a question and put it aside, letting your subconscious brain take a crack at it. I would still recommend being stuck for 15-30 minutes before moving onto another question or using the same hint taking technique as mentioned above.

Regardless of your timeline, after completing a question (with the best time and space efficiencies you can muster) you want to look at a couple of discussion posts and compare solutions. Check to see if you missed a better technique or a cleaner way of coding things. 

## System Design

[System-design-primer](https://github.com/donnemartin/system-design-primer) is a fantastic resource for introducing you to the various terms and techniques used for system design. While this is not an all encompassing or super deep source of knowledge, it will suffice for interviews. 

As well [Exponent](https://www.youtube.com/c/ExponentTV/videos?view=0&sort=p&flow=grid) is a great source of example mock system design interviews. 

I've been very fortunate where I've learned a ton related to system design through my work experience and personal research. My suggestion for those less experienced with system design would be to watch 1/2 Exponent videos, and then use the [System-design-primer](https://github.com/donnemartin/system-design-primer) to understand some of the concepts you may be unfamiliar with. Afterwards find an Exponent system design that interests you and pause it after the opening statement, write done what questions you would ask, as well as what your final assumptions and design would be. Then play the video and compare what the interviewee created compared to what you did. In many causes the final design can look quite different (thats not necessarily a bad thing), compare the pros and cons of each solution and try to understand why their's may or may not be preferred. System design is highly subjective, experience with one technology may lead individuals to always reach for that technology as a golden hammer regardless of the situation. 

For the long term, the best approach for learning system design is becoming an active participant in your current workplaces discussions and learning why/how different systems are used. If that is unavailable to you then taking an introductory course about AWS/GCP or Azure would be great. Alternatively I've found talks such as the ones found [here](https://www.youtube.com/nctv/videos?view=0&sort=p&flow=grid) are helpful in learning about Service Oriented Architecture (which is the most relevant architecture for system design questions asked in FAANG interviews).  

## Object Oriented Design

Depending on your position and level you may or may not be asked to code a question where the objective is not to minimize space or time complexity, but rather to demonstrate your ability to write clean and readable code. This is a difficult task to learn over multiple years of coding, let alone several weeks or days. I've found the following to be the best sources for learning:

- Take a look at open source/closed source projects (for example your works codebase) and study the techniques of the more senior and experienced members of your team code. Keep in mind some of their patterns may actually be anti-patterns engrained from their past, compare patterns across several sources to see if its a true idiomatic pattern. 
- There are also plenty of coding books related to this topic [Pragmatic Coder](https://www.goodreads.com/book/show/4099.The_Pragmatic_Programmer) and [Clean Code](https://www.goodreads.com/book/show/3735293-clean-code) are two such examples. There exist many reputable language specific books such as [Effective Java](https://www.goodreads.com/book/show/34927404-effective-java) for Java enthusiasts.
- Conferences cover writing clean code as well, for example [Devoxx](https://www.youtube.com/c/Devoxx2015/videos) has great talks about Java and [CppCon](https://www.youtube.com/user/CppCon), as the name suggests, revolves around C++. 

# Behavioral 

Contrary to your gut instincts, the behavioral portion is almost as important as the technical segment of an interview (some say 51-49 but the gap is probably slightly larger, perhaps 60-40). It is critical to prepare for this segment as well, even if it may seem redundant because your code speaks for itself.

Most of the behavioral questions you'll receive during an interview will focus on how or what you did in a specific scenario: how did you manage a conflict with your team/manager, name a time when you went above and beyond, how have you made your workspace more inclusive.

Every company will ask slightly different questions (and potentially expect slightly different answers), but they will all center around a small subset of principles. The [Amazon Leadership Principles](https://www.amazon.jobs/en/principles) are a great baseline to use. Various principles may/may not apply to your given position. As an entry level software engineer you likely won't have to answer questions about hiring, but questions regarding conflict resolution will be common.

My advice would be try to come up with 1/2 examples for each leadership principle, bonus points if the example covers more than one leadership principle.

As an individual applying for an entry level position you might wonder how can you come up with scenarios to these principles if you don't have any prior work experience? In those cases you can use your school projects or hobby projects. If you really really can't think of an situation for a principle then go out and create those situations! Don't go instigating fights with coworkers/friends but push yourself on challenging and interesting problems to create the necessary environments for differentiation and disagreements. 

# Final thoughts

You can interview with a company 100 times and receive 50 offer letters and another 50 rejection emails. This is partially due to how imprecise our interview process is, but also due to the high variability of an interview. The outcome of an interview can vary greatly depending on the mood of your interviewer, the questions you received, the time of day and even how well you slept the night before. 

It's important to be process based not outcome based when evaluating how you performed during an interview. For example if you believe you failed an interview due to the technical portion, analyze why the technical portion didn't go as well as it could have. Perhaps you suffered from performance anxiety, in which case familiarizing yourself with an interview setting, through mock interviews, might be your next step. Or you were not used to coding without your IDE, in which case doing more Leetcode questions without an IDE would be your next step. Potentially you just didn't do enough Leetcode practice. 

Deliberate practice paired with a strong self analysis routine is the ultimate process for improving, regardless of the discipline. Self analysis is especially key when there is minimal feedback (as is often the case in interviews where the interviewee receives a simple yes/no decision)

In this post I've provided guidelines on practicing technical/behavioral aspects of interviews, which if followed (after identifying that is your weakness) will help you succeed in any FAANG interview. 

# Notes

<b id="f1">[1]</b> Not to say that there is anything special or better about FAANG interviews vs interviews for a non FAANG company, but I think we can all agree that FAANG interviews tend to be more streamlined, especially for lower level positions.