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

In a [past post](./2019-10-30-CRACKING-THE-FAANG-INTERNSHIP.md) I gave a brief overview for doing well in an interview, specifically in the coding segment of the interview. Recently a few friends and I were preparing for interviews, while what I previousyl wrote covers how to execute during an interview I didn't particualy cover how to rpepare for an interview. In this post I will go over how I prepared (and how I recommend others prepare) for general FAANG Software Engineer positions. 

> Disclaimer: This is purely anecdotal, based on experiences my friends and I have had. Please don't mistake this for any sort of official statement by or about Amazon, Microsoft, Google or any other person or organization.

# Technical

## Data structures and algorithms (DSA)

Most individualls acustomed with FAANG companies are familiar with how to study for the DSA portion of the interview, [Leetcode](https://leetcode.com/)!

Depending on your timeline for the interview you have several options on how to best utilize leetcode.

search company past questions

### Short timeline (1-2 weeks)

With such a short time horizon you need to heavily rely on your past studying efforts and bolster your knowledge for questions specific to that company. Leetcode aggregates questions based on what companies tend to ask them, while this is a premium feature that 35$ you spend will be more than paid back if you were to land yourself a new job. 

In addition I would [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) which is a curated list of 75 questions that are often asked in FAANG interviews. This questions are also great for covering the basis of a ton of problem solving patterns that will be applicable to all sorts of questions. The author of Blind 75 has also released a [Grid 75](https://www.techinterviewhandbook.org/grind75), I've personally never used it but I've heard its a very useful list.

### Medium timeline (Several weeks)

Given a several weeks you have the opportunity to do the above mentioned Leetcode questions, but also to freshen up/reinfornce key concepts you may be struggling in. For example if you know you aren't good at graph or dynamic programming questions, then in addition to doing the company specific + blind 75 questions you can add some of the more asked dynamic programming questions. If you purchase Leetcode premium you can sort questions by their frequency and use that as your only customized list of questions you should solve. 

### Long timeline (Several months+)

You likely have this time horizon if you're just gearing up to apply for a new job. With such a long horizon you have a great opproruntity to really improve your logical thinking and programming skills. One key factor is to utilize all the time that was given to you; I don't mean studying for 8 hours a day for several months or bootcamping for a month. Instead you should actively study 20/30 minutes a day, everyday all the way up to your interview. There is plenty of literature and research that shows small bursts of intense study will out perform long stretches of studying. Doing 30 minutes of Leetcode a day is much better than once a week grinding out 8 hours of Leetcode.

What I tend to do is 1/2 questions a day, typically the daily question on Leetcode and then a question that has a high frequency for being asked. You can mix in questions specific to your company/Blind 75 as your interview date approaches.

## How to get the most out of a Leetcode question

Depending on your timeline how you approach being stuck on a Leetcode will differ. With short/medium timelines you don't have the luxury to spend 3 days on a single question, my advice would be after 15 minutes of being stuck to take a hint. I take hints in the following order:

- Look at related questions, to see if I can apply the same technique from that question in the one I'm stuck on
- Look at related topics
- Look at the titles of some of the discussion posts about the question
- Look at one of the top rated discussion posts but try to minimize how much code you look at, instead look at their English/visual descriptions and code it out yourself

With this approach you should constantly be forcing yourself to get the correct answer, but like in an interview, have a buddy who can help you out a little bit.

If instead your horizon is relatively long, then its perfectly okay for you to get stuck on a question and put it aside, letting your subconscious brain take a crack at it. I would still recommend being stuck for 15 minutes before moving onto another queston or using the same hint taking technique as mentioned above.

Regardless of your timeline, after completeling a question (with the best time and space efficinces you can muster) you want to look at couple of dicussion posts and see their solutions. Check to see if you missed a better technique or a cleaner way of coding things. 

## System Design

[System-design-primer](https://github.com/donnemartin/system-design-primer) is a fantastic resource for introducing you to the various terms and techniques used for System Design. While this is not an all encompassing or super deep source of knowledge, it will suffice for interviews. 

As well [Exponent](https://www.youtube.com/c/ExponentTV/videos?view=0&sort=p&flow=grid) is a great source of example mock system design interviews. 

I've been very foruntate where I've learned a ton related to system design through my work experiecne and personal reserach. My suggestion for those less experienced with System Design would be to watch 1/2 exponent videos, and then use the system-design-primer to understand some of the concepts you may be unfamiliar with. Afterwards find an Exponent system design that interests you and pause it after the opening statement, write done what questions you would ask as well as what your final desing would be. Then play the video and compare what the interviee did compared to what you did. In many causes the final design can look quite different (thats not necessarily a bad thing), compare the pros and cons of each solution and try to understand why their may or may not be preferred. System design is highly subjective, experience with one technology may lead users to beliving that technology is a golden hammer and utilizing it regardless of the situation. 

For the long term, the best approach for learning system design is taking an active stance in your current workplaces discussions and learning why certain systems are used. If thats is unaviable to you then taking an introductory course about AWS/GCP or Azure would be a great, alternatively I've found talks such as the ones found [here](https://www.youtube.com/nctv/videos?view=0&sort=p&flow=grid) to be great in learning about Service Oriented Architecture.  

## Object Oriented Design

Depending on your position and level you may or may not be asked to code a question where the objective is not to minimize space or time complexity, but rather to demonstrate your ability to write clean code. This is a dificult task to learn over multiple years of coding, let alone several weeks or days. Your best bet here would be to learn how to write idomatic code for your favorite language by looking at open source/closed source (for example your works codebase) and studying the techniques of how the more senior and experienced members of your team code. There are also plenty of coding books related to this topic [Pragmatic Coder](https://www.goodreads.com/book/show/4099.The_Pragmatic_Programmer) and [Clean Code](https://www.goodreads.com/book/show/3735293-clean-code) are two such examples. Many conferences cover writing clean code as well, for example [Devoxx](https://www.youtube.com/c/Devoxx2015/videos) has many great talks about Java and [CppCon](https://www.youtube.com/user/CppCon), as the name suggests, revolves around C++. 

# Behavioral 

Most of the behavioral questions you'll receive during an interview will focus on how or what you did in a specific scenario: how did you manage a conflict with your team/manager, name a time when you went above and beyond, how have you made your workspace more inclusive.

Every company will ask slightly different questions (and potentially expect slightly different answers), but they will all center around a small subset of principles. The [Amazon Leadership Principles](https://www.amazon.jobs/en/principles) are a great baseline to use. Various principles may/may not apply to your given position. As an entry level Software engineer you likely won't have to answer questions about hiring, but explaining how you worked through a tough situation with a coworker will be necessary.

My advice would be try to come up with 1/2 examples for each leadership principle, bonus points if the example covers more than one leadership principle.

As an individual applying for an entry level position you might wonder how can you come up with scenarios to these principles if I don't have any work experience? In that case you can use your school projects or hobby projects as examples. If you really really can't think of an situation for a principle then go out and creation those situations! Don't go instigating fights with coworkers/friends but push yourself on challenging and interesting problems to create the necessary environments for differentiation and disagreements. 

# Final thoughts