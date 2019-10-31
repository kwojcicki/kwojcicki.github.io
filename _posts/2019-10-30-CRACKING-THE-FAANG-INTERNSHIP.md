---
layout:     post
title:      "Cracking the FAANG internship"
subtitle:   "Comprehensive guide for getting you your next FAANG internship"
date:       2019-10-30 22:09:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"	
comments: true
tags: [ Programming ]
---

# Cracking the FAANG internship.

> Disclaimer: This is purely anecdotal, based on experiences my friends and I have had. Please don't mistake this for any sort of official statement by or about Amazon, Microsoft, Google or any other person or organization.
>
> In addition this will be a guide for obtaining an internship the "hard way", as in with no references/networking.

## Getting noticed (Resume and application) 

Likely the most important thing when applying for FAANG positions is how early you apply. Typically these companies do rolling interviews and once all spots are up you are screwed. If you plan on applying for an internship, research past years to see when positions open and apply immediately. 

To apply you need a resume, there unfortunately is no full proof method for creating the best resume. All recruiters will have a slightly different opinion on what a bad vs good vs great resume is. With that being said here are some tips that most recruiters will appreciate.

* Short resume, 1 page is preferred. If senior programmers can put it in one page so can you. This will also enforce a high quality of content in your resume, which is super important. Recruiter's rarely read the entire resume, various studies have given different results varying between [6 seconds to 2 minutes](https://medium.com/@jantegze/how-long-do-recruiters-look-at-a-resume-a5b1d6001f3b). To be safe keep it short and ensure every sentence is impressive. Personally I recommend only including education + awards, work experience and interesting projects you've worked on. Check out my resume [here](https://kwojcicki.github.io/resume/ResumeKrystianWojcicki.pdf) which got me interviews + internships at FAANG companies.
* Big readable font. No one wants to see a 1 page document filled with size 7 font text. 
* Tailor your resume to the position. If your applying to a primarily backend position talk about the Go based microservices you worked on rather than some selenium tests you wrote. Having a [Brag Document](https://jvns.ca/blog/brag-documents/) can help you remember what you worked on in the past.
* Include the tech you utilized at past positions. This allows recruiters to easily see what tech you have used in the past and how it relates to the job posting
* Don't just state what you did, state why it was needed and how helpful it was: ie my internal tool increased coworkers productivity by 50%, decreased database usage by 50%.
* Recruiters aren't experts in your field, try to keep it an ELI5 (explain like I am five) level.
* Contribute to some open source. There are tons of great repos on Github listing beginner friendly repos. [Heres](https://github.com/MunGell/awesome-for-beginners) one, just click a language you are familiar with and start tackling a few issues. Even doing a small README/doc change counts as contributing and may lead you down a noble path of contributing to OSS.

## Online coding challenge

Most companies will start the interview process with an online coding challenge. Typically they consist of a few questions that are time boxed to 90 minutes. Often there will be sample testcases given to you. Sometimes there are hidden testcases and it never hurts to test your code with your own input.

In terms of the types of questions [leetcode](https://leetcode.com/), [hackerrank](https://www.hackerrank.com/), [kattis](https://www.kattis.com/) are great resources for finding questions, people often comment about their experience with various FAANG companies. Cracking the Coding Interview (CTCI) and Elements of Programming Interviews (EPI) will be of great assistance here as well. Keep calm and remember you can still proceed to the next stage with partially incorrect testcases. It seems that code correctness is the only determining factor here, but don't stop yourself from following good coding principles. 

## Behavioral interview.

Depending on the firm the behavioral interview may be held in conjunction with the later coding interviews or on there own. Some companies don't even have any. 

In terms of prep the main thing that can be done here is preparing answers to basic questions. Such as whats your greatness weakness, what are your strengths, explain a time you had a conflict with a colleague, when have you had a problem motivating yourself, what are your passions in coding, tell me about yourself (just walk through your resume), what is your dream project to work on. As long as one is honest and self critical its pretty tough to go wrong here. One note is try to answer these questions with a good twist. I have problems with x,y,z but I have been doing a,b,c with great success so far.

If asked what your greatest weakness is, don't reply my productivity (unless you have a great answer as to how that is a weakness other then I finish my work too fast). An answer I personally have given in the past, that was well received, was my lack of ability to properly switch contexts when talking with fellow colleagues. Why is this a problem? Well this could result in me using too technical terms when speaking with a very confused manager. I have been improving on this by talking a second to properly switch contexts when talking, as well as starting this blog which has taught me how to communicate tough technical ideas to a wide range of people.

A general phone interview tip, for behavioral or coding, is to smile. It will change the tone of your voice and make you seem more likeable. Don't start laughing maniacally however.

In general this section shouldnt make or break you as long as you are a reasonably human being.

## Coding interview

This may be in person or over the phone. Typically you will have a few sessions of around 45 minutes to meet the interviewer, progress as far as you can in their coding questions and the last 5 or so minutes reserved for you to ask them questions. I use the phrasing progress rather then finish as typically questions will have additional parts to keep you busy way past 45 minutes. Sometimes this may include more requirements/edge cases, improved performance for memory or efficiency. 

When reading or hearing your coding problem the first thing you need to do is ask questions. For example if you are tasked with sorting numbers knowing the range of the numbers is critical, are they floats or integers etc. This will help redefine the challenge into a more concert problem that you can go about solving. 

To solve these problems brute force should be your go to answer. Its much better to have a working brute force algorithm and discuss how an optimized algorithm could work than having no brute force algorithm and a nonfunctioning optimized solution. I find it best to go in basic stages:
1. Ask questions to get a true understanding of the question
2. Code a basic brute force algorithm showing it works and understanding its complexity and any cases for which it may not work 
3. Discuss a more sophisticated solution
4. (Optional) Code a more sophisticated solution
5. (Optional) repeat steps 3-4 as needed

Typically step 3 is done in conjunction with stating your brute force algorithms complexity. Establishing a good gut feeling for optimal complexity is very helpful in establishing how much improvements/what improvements you need to make to your brute force algorithm. For example if given an array/linkedlist its unlikely you can do much better than O(n).

Every interviewee will have a different solution to the same problem. This means the interviewer will pick a problem with a small concise solution. If your solution is over 30-50 lines, you likely are using the wrong data structures. Having a good working knowledge of available data structures is key.

Lets go through a few case studies ourselves.

### Example coding question #1

> Problem statement: Given an array of numbers `(int[] numbers)` find a pair which has a sum equal to k `(int k)`.

Following the outlined steps above.

1. Question | Answer
    --- | ---
    What type of numbers can the array store | Integers
    What range can the integers have | All will be above 0
    Do we know a limit on the largest sum possible possible | The largest sum will never exceed a signed integer
    Will there always be a pair | Yes
    Is there anything special about the array, perhapses is it sorted | Yes the array is sorted and there are no duplicates
2. Reading the problem statement we should already have a decent idea of a simple brute force algorithm that should work. Loop over all pairs `(i, j)` where `i != j` and find the first pair where `numbers[i] + numbers[j] == k`. Heres some sample code in java
```java
Pair findPairGivingSum(int[] numbers, int k){
    for(int i = 0; i < numbers.length; i++){
        for(int j = i + 1; j < numbers.length; j++){
            if(numbers[i] + numbers[j] == k){
                return new Pair(numbers[i], numbers[j]);
            }
        }
    }
    return null;
}
``` 
Once written you can analyze the complexity. Given we loop over all pairs, which there are `O(n^2)` of, and for each pair perform `O(1)` work the total time complexity is `O(n^2)`. No extra space is utilized so the space complexity is `O(1)`.

3. This solution should feel very inefficient. One way we could speed it up, at the cost of using more space, is storing values we have already seen in a HashSet. Then for each index we can lookup if the complement to the pair exists, otherwise add the current number to the set.
4.  Heres a code version of the previously discussed solution
```java
Pair findPairGivingSumUsingMap(int[] numbers, int k){
    Set<Integer> seen = new HashSet<Integer>();
    for(int i = 0; i < numbers.length; i++){
        if(seen.contains(k - numbers[i])){
            return new Pair(numbers[i], k - numbers[i]);
        }
        seen.add(numbers[i]);
    }

    return null;
}
```
Adding and looking up elements in a HashSet is `O(1)` and since we potentially loop over `n-1` elements the time complexity is `O(n)`. But space wise we are much worse than the previous solution at `O(n)`. Now you could discuss the trade offs between the two and when you could use either solution.

5. Can we do even better? If you were paying attention to part 1, you may have noticed the array is **sorted**. How can we use that to our advantage? Well lets imagine we sum the first `x` and last element `y` in our array. Suppose that sum is less than k, `x + y < k`. Meaning we need to increase our sum. We can't possibly increase `y` as its the final element in our array. But instead of using the first element in the array we can utilize the second element in the array. Similar logic can be applied if `x + y > k`. We can keep moving in the left or right side of our pair until `x + y == k`. All thanks the fact that our array is sorted.
```java
Pair findPairUsingSorted(int[] numbers, int k){
    int first = 0;
    int last = numbers.length - 1;
    while(true){
        if(numbers[first] + numbers[last] < k){
            first++;
        } else if(numbers[first] + numbers[last] > k){
            last--;
        } else {
            return new Pair(numbers[first], numbers[last]);
        }
    }
}
```
Here the time complexity is `O(n)` and no extra space is utilized, meaning `O(1)`.

Hopefully as you learned its super important to ask questions at the beginning to really develop an understanding of the problem. Don't be afraid to keep asking questions as you move through the problem.

### Example coding question #2

> Problem statement: Given an array of numbers `(int[] numbers)` where every number appears exactly twice expect one, find the number which appears once. ie `int[] numbers = { 1, 2, 3, 4, 5, 1, 2, 3, 5 }` return `4`.

I will be more brief in this case study. But you should be able to do this one on your own.

1. Question | Answer
    --- | ---
    What type of numbers can the array store | Integers
    What range can the integers have | All will be above 0
    Is there an order to the array | No order
2. The brute force should be relatively obvious, loop over all numbers checking to see if a duplicate exists elsewhere
```java
int findUnique(int[] numbers){
    for(int i = 0; i < numbers.length; i++){
        boolean found = false;
        for(int j = 0; j < numbers.length; j++){
            if(j != i && numbers[i] == numbers[j]){
                found = true;
                break;
            }
        }

        if(!found){
            return numbers[i];
        }
    }
}
```
3. A slightly more time efficient (but sacrificing space) solution is to store seen elements in a HashSet. Adding the element if its not currently in the Set, removing otherwise. By the end only 1 element should be left over which is the unique element. But there is an even better method utilizing [XOR](https://en.wikipedia.org/wiki/XOR_gate). 
4. XOR is commutative and `A XOR A == 0`. This means that `A XOR B XOR C XOR A XOR B == C`. Using these facts we can come up with a cute solution.
```java
int findUniqueXOR(int[] numbers){
    int result = 0;
    for(int i: numbers){
        result ^= i;
    }
    return result;
}
```

You will notice its often a trend that sacrificing space complexity will result in better time complexity. This trade off will be problem specific but important to go over with your interviewer. Also as seen with the XOR solution, many of these problems have quirky solutions that become much easier to identify after many many practice problems.

## Coding question prep

These coding problems will often be done in something similar to google doc or a white board. Pseudocode is typically allowed but try and stick to a known programming language as much as possible. Unlike in the online portion, code quality is also critical

The best method of practicing for this is identical to practicing for the online portion. Take special notice of algorithms space and time complexity, as this is a critical part of your evaluation. 

In addition one can google "geekforgeeks [company name] interview questions" for FAANG companies this will spew out tons of results. 

One thing to keep in mind while practicing is to do deliberate practice. When you read a problem don't just immediately read the solution and try to memorize it. Instead give yourself 15 or 20 minutes to think of the best solution you can, then code it, check if works for basic test cases and analyze its space/time complexity. Only then compare your answer to the posted answer understanding the benefits/cons of the posted solution and how it works. If you are stumped and can't think of anything move on to another question. Let your subconscious mind try to solve it for a day or two. If after that you still cannot think of any good solution take a look at the answer. Following this approach will ensure your actually learning and not just reading solutions.

## Final notes

Being interviewed is a skill, one needs to practice to improve. However there is **alot** of luck involved in getting a FAANG internship considering the thousands of applicants. Being self critical is key in understanding when you didn't get an offer due to a poor interview showing or simply because other great candidates had applied earlier and taken the positions. Its important to keep this process as fun and productive. Practicing with colleagues and friends is great and will help give insights on how they approach problems.

Good luck, and enjoy that FAANG internship.