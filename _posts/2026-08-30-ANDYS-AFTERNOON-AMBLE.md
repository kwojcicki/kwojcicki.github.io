---
layout: post
title: "Jane Street Puzzle: Andy's Afternoon Amble"
subtitle: "Presenting my solution to the Andy's Afternoon Amble"
date: 2026-08-30 09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Tutorial]
---

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({ TeX: { extensions: ["color.js"] }});
</script>

<script type="text/javascript" async src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML'></script>

# Introduction

In Jane Street's [latest puzzle, Andy's Afternoon Amble](https://www.janestreet.com/puzzles/andys-afternoon-amble-index/) we're given the following prompt 

<img src="https://www.janestreet.com/puzzles/andys-afternoon-amble.gif" />

> Andy the ant has moved on from his classic ‘Telstar’ soccer ball homeland to live on a simpler spherical surface consisting of four white hexagons that are surrounded by alternating black triangles and white hexagons (three of each), and four black triangles surrounded by three white hexagons. To us this land is a truncated tetrahedron blown up into a sphere we see above on the left. Due to Andy’s tiny size and terrible eyesight, he doesn’t notice the curvature of the land and avoids the black triangles because he suspects they may be bottomless pits. <br> <br> Much like his morning routine, every afternoon he wakes up from his nap on a white hexagon, leaves some pheromones to mark it as his special home space, and starts his random amble. Every step on this walk takes him to one of the three neighboring white hexagons with equal probability. He ends his amble as soon as he first returns to his home space, which he recognizes but cannot distinguish the edges of (i.e. he doesn’t know if he returned across the same edge as he left). As an example, on exactly 1/3 of afternoons Andy’s amble is 2 steps long, as he randomly visits one of the three neighbors, and then has a 1/3 probability of returning immediately to the home hexagon. <br> <br> This afternoon his truncated tetrahedral homeland bounced through the very same kitchen with an infinite regular hexagonal floor tiling consisting of black and white hexagons, shown above on the right. In this tiling every white hexagon is surrounded by alternating black and white hexagons, and black hexagons are surrounded by six white hexagons. Andy fell off the ball and woke up on a white hexagon. He didn’t notice any change in his surroundings, and goes about his normal amble. <br> <br> Throughout his walk, Andy remembers the turns he’s taken. Let p be the probability that by the end of his afternoon amble on this new land he has discovered that he is no longer on the truncated tetrahedral sphere. Find p in exact terms.

# Solution

The first step is to create and label the deconstructed spherical surface that Andy the ant now lives on.

![Andys homeland spherical surface deconstructed](/img/posts/afternoon_amble_deconstructed_ball.png)

Once that's done we can superimpose the deconstructed surface anywhere onto the kitchen (highlighted in red) and continue superimposing the ball respecting the original traversals. 

![Andys homeland spherical surface superimposed onto the infinite kitchen](/img/posts/afternoon_amble_superimposed.png)

This creates a map of where Andy believes he is. Since Andy remembers the turns he takes, if he believes he should be at home (H) but doesn't sense his pheromones then he will know he is no longer on his truncated tetrahedral sphere.

If we look at his starting home square, regardless of which direction he ends up going he will end up in a 6 tile loop surrounded by home (H) tiles. Without loss of generality assume Andy's first move was to travel south. 

The probability he will discover he is no longer on his original hometown is the probability he exits the highlighted loop on any home (H) tile that is not the red one at the top.

![Andys homeland spherical surface super imposed onto the infinite kitchen and infinite loop highlighted](/img/posts/afternoon_amble_highlighted.png)

First express the probability $$ p(x) $$ as the probability Andy does discover he is no longer on his hometown, where $$ x $$ is the distance from the highlighted 3 tile.

$$
\begin{aligned}
p(0) &= \frac{1}{3} * 0 + \frac{2}{3} * p(1) \\
p(1) &= \frac{1}{3} * 1 + \frac{1}{3} * p(0) + \frac{1}{3} * p(2) \\
p(2) &= \frac{1}{3} * 1 + \frac{1}{3} * p(1) + \frac{1}{3} * p(3) \\
p(3) &= \frac{1}{3} * 1 + \frac{2}{3} * p(2)
\end{aligned}
$$

Since this system has 4 equations and 4 unknowns, plug this into any system of linear equations solver and you'll get that $$ p(0) = 0.55 $$ which is the correct and final answer.<sup id="a1">[1](#f1)</sup>


# Notes


<b id="f1">[1]</b> We can also simulate Andy traveling within the loop and find it returns an answer very close to 0.55 [↩](#a1)

```java
public static void main(String[] args){

    long trials = 100_000_00;
    long sum = 0;

    for(int i = 0; i < trials; i++){
        sum += sample(1);
    }

    System.out.println("Trials: " + trials + " sum: " + sum + " avg: " + ((double) sum / trials));
}

public static long sample(int pos){
    int randomNumber = (int) (Math.random() * 3);
    if(randomNumber == 0){
        return pos == 1 ? 0 : 1;
    } else if(randomNumber == 1){
        pos++;
        if(pos > 6) pos = 1;
        return sample(pos);
    } else {
        pos--;
        if(pos < 1) pos = 6;
        return sample(pos);
    }
}
```