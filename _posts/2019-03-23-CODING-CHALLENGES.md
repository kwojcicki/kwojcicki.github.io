---
layout: post
title: "Signaling Intent"
subtitle: "How signaling intent can make you a better programmer"
date: 2022-03-23 15:18:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Programming]
---

# How to use coding challenge websites to grow as a programmer

Coding challenge websites such as HackerRank, Project Euler, TopCoder etc have an interesting dichotomy.

For those of you unfamilar with what a coding challenge website is, then essentially what it provides is a bank of questions and an upload functionality such that you can upload your code which will be run against testcases to "prove" its correctness or not.

On one hand for many entering the industry these websites are a great resource to practice for interviews.
However these questions are often a poor reflection of what software engineers do on a daily basis, I can't remember the last time I needed to find 3 numbers from an array that added up to some sum or find the longest substring without repeating characters.

I personally enjoy doing coding questions and while I am skeptical of their usage I do believe there is value in these coding challenges.

**1. Language learning**

Doing these coding challenges will not teach you to be a good coder, in fact you will likely learn many anti-patterns.
It would be difficult without doing some [fizz buzz enterprise type solution](https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition) to properly learn object oriented programming when doing these questions.

However there are parts of these challenges that can help you learn some aspects of a language. For me I found applying Java's streams/map/reduce/filter was a
great way for me to become more familiar with those concepts and what they can accomplish.

These challenges are also a great way to learn about your languages types. Be it the bounds of an integer, float etc or how to handle overflow. Could teach you about slightly
more exotic types such as Java's [BigInteger](https://docs.oracle.com/javase/7/docs/api/java/math/BigInteger.html) or [BitSet](https://docs.oracle.com/javase/7/docs/api/java/util/BitSet.html)

cool syntax

```
for(int i = 0; i < 1_001_000; i++) {
	System.out.println(i);
}
```

There also a great way of learning a languages basic data structures, many problems will involve/trivialized by using Lists, Sets, Maps, Trees, Queues etc.

**2. Logical Reasoning**

**3. Debugging**

This one is fairly obvious, especially as you attempt harder questions the likely hood that you get them right on your first try is pretty low.
Now depending on the site it will either tell you the test case that was incorrect or it will simply notify you that your answer was incorrect.
As one can imagine having the incorrect testcase given to them simplifies the debugging process greatly. So at the beginning I would recommend
using the information provided to you about the incorrect testcase but to truely get better as a coder just getting a blanket correct/incorrect will be much better.
It will force you to analyze possible edge cases and in general think about all the different cases that could be given to you: empty string, null string, an incredibly long string, a string
which includes none alphanumeric characters, spaces etc.

**4. Social Aspect**

Maybe the crowd I hang out with is especially nerdy, but bringing up an interesting challenge from time to time is a great opportunity for bonding between colleagues or friends as well as a shared learning experience.
