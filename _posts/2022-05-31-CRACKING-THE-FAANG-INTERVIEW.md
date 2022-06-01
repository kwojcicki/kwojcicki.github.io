---
layout:     post
title:      "Cracking the FAANG interview"
subtitle:   "Learn how to preapre for your next FAANG interview!"
date:       2022-05-31 22:09:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"	
comments: true
tags: [ Programming ]
---

* Placeholder for Table of Content (Must not be removed)
{:toc}

# Introduction

Recently, a few friends and I were preparing for interviews (specifically FAANG interviews) <sup id="a1">[1](#f1)</sup>. In a [past post](./2019-10-30-CRACKING-THE-FAANG-INTERNSHIP.md) I provided a brief overview on how you can succeed at a FAANG intern interview. While that post covers how to execute the coding segment of an interview, it didn’t cover other potential segments of an interview. In this post I will go over how I prepared (and how I recommend others to prepare) for a general FAANG SWE interview. 

> Disclaimer: This post is purely anecdotal, based on the experiences my friends and I have had. Please don't mistake this for any sort of official statement by or about Amazon, Microsoft, Google or any other person or organization.

# Technical

## Data structures and algorithms (DSA)

If you are familiar with FAANG you might already know how to study for the DSA portion of the interview; [Leetcode](https://leetcode.com/)!

Depending on your timeline until your interview date there are several options on how to best utilize Leetcode.

### Short timeline (1-2 weeks)

With such a short time horizon you should focus your precious time on bolstering your knowledge on company specific questions. For other types of questions, you will need to rely heavily on your past studying efforts. Leetcode can aggregate questions based on which companies tend to ask them. While this is a premium feature, the returns you will gain when you land yourself a new job will be more than enough to cover that $35 you spent for the membership. These aggregations are available on the [Leetcode explore page](https://leetcode.com/explore/interview/).

Also, check out [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) which is a curated list of 75 questions that are often asked during FAANG interviews. These questions will introduce you to a wide array of problem-solving techniques that are applicable to all sorts of questions. The author of Blind 75 has also released [Grind 75](https://www.techinterviewhandbook.org/grind75), I haven’t had the opportunity to use this one yet, but my friends say its great.

Finally, Googling for past interview questions is also a great way to discover the types of questions asked during interviews. For example, for my prep I frequently Googled "Amazon SDE 2 questions" and tried to solve the questions people have had in the past. Leetcode also has a [discussion page](https://leetcode.com/discuss/interview-question?currentPage=1&orderBy=hot&query=) which you can use to filter questions from your specific company.

### Medium timeline (Several weeks)

With several weeks, you will have the time to do the above mentioned Leetcode questions and freshen up/reinforce key concepts you find challenging. For example, if you know you struggle with graph or dynamic programming questions, then in addition to doing the company specific + [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) questions you can do some of the more frequently asked dynamic programming questions. If you purchase Leetcode premium you can sort questions by their frequency and use that as your own customized list of practice questions. For those without Leetcode premium, rely on Google to find which Leetcode questions are most popular per topic.

### Long timeline (Several months+)

You would likely have this time horizon if you're just gearing up to apply for a new job. With such a long timeline you have a great opportunity to really improve your logical thinking and programming skills. Utilize all the time that was given to you! I don't mean studying for 8 hours a day for several months or boot camping for a month, instead you should actively study 20-30 minutes every day all the way up to your interview. There is plenty of literature and research that shows short intense bursts will outperform occasional long stretches of studying. Doing 30 minutes of Leetcode a day is more effective than once a week grinding out 8 hours of Leetcode.

My preferred routine is to do 1-2 questions a day, typically the daily question on Leetcode and then a question that has a high ask frequency. You can mix in questions specific to your company/[Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) as your interview date approaches.

## How to get the most out of a Leetcode question

Depending on your timeline how you approach being stuck on a Leetcode question will differ. With short/medium timelines you don't have the luxury to spend 3 days on a single question. My advice is to take a hint after 15 minutes of being stuck. I recommend taking hints in the following order:

- Look at related questions to see if you can apply the same technique from those questions to the question you’re stuck on (if you haven't completed those questions try doing those after to reinforce the concepts you just learned)
- Look at related topics
- Look at the titles of some of the discussion posts about the question
- Look at one of the top-rated discussion posts, but try to minimize how much code you look at, instead look at their English/visual descriptions and code it out yourself

With this approach you should constantly be pushing yourself to the correct answer, but like in an interview, have a buddy who can help you out a little bit.

If your time horizon is relatively long, then it's perfectly okay for you to get stuck on a question and put it aside letting your subconscious brain take a crack at it. I would still recommend being stuck for 15-30 minutes before moving onto another question or using the same hint taking technique as mentioned above.

Regardless of your timeline, after completing a question (with the best time and space efficiencies you can muster) you will want to look at a couple of discussion posts and compare solutions. Check to see if you missed a better technique or a cleaner solution. 

## System Design

[System-design-primer](https://github.com/donnemartin/system-design-primer) is a fantastic resource that introduces the various terms and techniques used for system design. While this is not an all-encompassing or in-depth source of knowledge, it will suffice for interviews. 

As well, [Exponent](https://www.youtube.com/c/ExponentTV/videos?view=0&sort=p&flow=grid) is a great source of example mock system design interviews. 

I've been very fortunate to learn about system design through my work experiences and personal research before preparing for system design interview questions. My suggestion for those less experienced with system design is to watch 1-2 Exponent videos and then use the [System-design-primer](https://github.com/donnemartin/system-design-primer) to understand some of the concepts you may be unfamiliar with. Afterwards, find an Exponent system design video that interests you and pause it after the opening statement, write down what questions you would ask, as well as what your final assumptions and design would be. Then play the video and compare what the interviewee created compared to what you did. In many cases the final design can look quite different (that’s not necessarily a bad thing), compare the pros and cons of each solution and try to understand why theirs may or may not be preferred. System design is highly subjective and experience with one technology may lead individuals to always reach for that technology as a golden hammer regardless of the situation. 

For those with a long time horizon, the best approach for learning system design is becoming an active participant in your current workplace discussions and learning why/how different systems are used. If that is unavailable to you then taking an introductory course about AWS/GCP or Azure would be great. Alternatively, I've found talks such as the ones found [here](https://www.youtube.com/nctv/videos?view=0&sort=p&flow=grid) are helpful in learning about Service Oriented Architecture (which is the most relevant architecture for system design questions asked in FAANG interviews).  

## Object Oriented Design

Depending on your position and level you may or may not be asked to code a question where the objective is not to minimize space or time complexity, but rather to demonstrate your ability to write clean and readable code. This is a difficult task to learn over multiple years of coding, let alone several weeks or days. I've found the following to be the best sources for learning:

- Look at open source/closed source projects (for example your works codebase) and study the coding techniques used by the more senior and experienced members of your team. Keep in mind some of their patterns may actually be anti-patterns engrained from their past. Compare patterns across several sources to see if it’s a true idiomatic pattern. 
- There are also plenty of coding books related to this topic [Pragmatic Coder](https://www.goodreads.com/book/show/4099.The_Pragmatic_Programmer) and [Clean Code](https://www.goodreads.com/book/show/3735293-clean-code) are two such examples. There exist many reputable language specific books such as [Effective Java](https://www.goodreads.com/book/show/34927404-effective-java) for Java enthusiasts.
- Conferences cover writing clean code as well, for example [Devoxx](https://www.youtube.com/c/Devoxx2015/videos) has great talks about Java and [CppCon](https://www.youtube.com/user/CppCon), as the name suggests, revolves around C++. 

# Behavioral 

Contrary to your gut instincts, the behavioral portion is almost as important as the technical segment of an interview (some say 51-49, with the technical portion slightly edging out the behavior section, but the gap is probably larger, perhaps 60-40). It is critical to prepare for this segment as well, even if it may seem redundant because your code speaks for itself.

Most of the behavioral questions you'll receive during an interview will focus on how or what you did in a specific scenario: how did you manage a conflict with your team/manager, name a time when you went above and beyond, how have you made your workspace more inclusive etc.

Every company will ask slightly different questions (and potentially expect slightly different answers), but they will all center around a small subset of principles. The [Amazon Leadership Principles](https://www.amazon.jobs/en/principles) are a great baseline to use. Various principles may/may not apply to your given position. As an entry level software engineer you likely won't have to answer questions about hiring, but questions regarding conflict resolution will be common.

My advice would be to come up with 1-2 examples for each leadership principle, bonus points if the example covers more than one leadership principle.

If you are applying for an entry level position, you might wonder how you can come up with scenarios to these principles if you don't have any prior work experience? In those cases, you can use your school projects or hobby projects. If you really really can't think of a situation for a principle, then go out and create those situations! Don't instigate fights with coworkers/friends but push yourself on challenging and interesting problems to create the necessary environments for differentiation and disagreements. 

# Final thoughts

You can interview with a company 100 times and receive 50 offer letters and another 50 rejection emails. This is partially due to how imprecise the interview process is, but also due to the high variability of an interview. The outcome of an interview can vary greatly depending on the mood of your interviewer, the questions you received, the time of day and even how well you slept the night before. 

It's important to be process based not outcome based when evaluating how you performed during an interview. For example, if you believe you failed an interview due to the technical portion, analyze why the technical portion didn't go as well as it could have. Perhaps you suffered from performance anxiety, in which case familiarizing yourself with an interview setting, through mock interviews, might be your next step. Or, you were not used to coding without your IDE, in which case doing more Leetcode questions without an IDE would be your next step. Potentially you just didn't do enough Leetcode practice. 

Deliberate practice paired with a strong self-assessment routine is the ultimate process for improving, regardless of the discipline. Self-analysis is especially key when there is minimal feedback (as is often the case in interviews where the interviewee receives a simple yes/no decision)

In this post I've provided guidelines on how to prepare for technical and behavioral aspects of interviews, which if followed (after identifying your weaknesses) will help you succeed in any FAANG interview. 

# Notes

<b id="f1">[1]</b> Not to say that there is anything special or better about FAANG interviews vs interviews for a non FAANG company, but I think we can all agree that FAANG interviews tend to be more streamlined, especially for lower level positions.