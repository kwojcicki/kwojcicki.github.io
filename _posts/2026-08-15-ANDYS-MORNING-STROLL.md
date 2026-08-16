---
layout: post
title: "Jane Street Puzzle: Andy's Morning Stroll"
subtitle: "Presenting my solution to the Andy's Morning Stroll"
date: 2026-08-15 09:36:00
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

In Jane Street's [Andy's Morning Stroll puzzle](https://www.janestreet.com/puzzles/andys-morning-stroll-index/) we're given the following prompt 

> Andy the ant has spent most of his days living on a strange land consisting of white hexagons that are surrounded by alternating black pentagons and white hexagons (three of each), and black pentagons surrounded by five white hexagons. To us this land is familiar as the classic soccer ball we see above on the left. Due to Andy’s tiny size and terrible eyesight, he doesn’t notice the curvature of the land and avoids the black pentagons because he suspects they may be bottomless pits. <br> <br> Every morning he wakes up on a white hexagon, leaves some pheromones to mark it as his special home space, and starts his random morning stroll. Every step on this stroll takes him to one of the three neighboring white hexagons with equal probability. He ends his stroll as soon as he first returns to his home space. As an example, on exactly 1/3 of mornings Andy’s stroll is 2 steps long, as he randomly visits one of the three neighbors, and then has a 1/3 probability of returning immediately to the home hexagon. <br><br> This morning, his soccer ball bounced through a kitchen with an infinite (at least practically speaking…) regular hexagonal floor tiling consisting of black and white hexagons, a small part of which is shown above on the right. In this tiling every white hexagon is surrounded by alternating black and white hexagons, and black hexagons are surrounded by six white hexagons. Andy fell off the ball and woke up on a white hexagon. He didn’t notice any change in his surroundings, and goes about his normal morning routine. <br><br> Let p be the probability that his morning stroll on this new land is strictly more steps than the expected number of steps his strolls on the soccer ball took. Find p, rounded to seven significant digits.

As well as a visual depiction

<img src="https://www.janestreet.com/puzzles/andys-morning-stroll.png" />

# Solution

We can decompose this into two subproblem's:

1. The expected number of steps Andy will take on his home land, $$ X $$
2. The probability that Andy takes at-most $$ X $$ steps on the kitchen floor.

Solving subproblem number one is quite simple. Running a simple simulation yields that each of Andy's morning strolls take approximately 20 steps<sup id="a1">[1](#f1)</sup>, which follows the logic of looking at an infinite random stroll Andy may take, each of the twenty white hexagons will be equally distributed across this stroll and on average he will return to his home square one in every twenty steps.

Now to calculate how often Andy takes a stroll of atleast 21 steps we can calculate the probability of his stroll taking 20 steps in the kitchen and then taking the complement.

To calculate this we can create a $$ 41 \times 41 $$ width and height transition matrix and at each iteration subtract and accumulate the population at the designated home square.

To illustrate this point imagine numbering 16 tiles as shown below

![Labelling the kitchen floor tiles for andys morning stroll](/img/posts/andys_morning_stroll_numbers.png)

We can then construct a transition matrix where the numbers on the left hand side show the "from" state and the upper numbers show the "to" state. The probability of going from tile 1 to tile 1 is $$ 0% $$, whereas going from tile 1 to tile 2 is $$ \frac{1}{3} $$. 

You can see a partially completed transition matrix below:

![Transition matrix for andys morning stroll](/img/posts/andys_morning_stroll_transformation_matrix.png)

In general 


$$
f(x, y) = \begin{cases}
  \frac{1}{3} & \text{if } \lvert x - y \rvert = 1 \\
  \frac{1}{3} & \text{if } x - \text{length} = y \text{ and x's row} \% 2 = 1 \\
  \frac{1}{3} & \text{if } y - \text{length} = x \text{ and x's row} \% 2 = 1 \\
  0 & \text{else }
\end{cases}

$$

Which we can use to express the final answer<sup id="a2">[2](#f2)</sup>

$$
\begin{aligned}
n &= 41 \times 41 \\
\text{transition matrix} & = \bigl[f(i,j)\bigr]_{i=1,\ldots,n;\,j=1,\ldots,n} \\
\text{state} &=
\begin{bmatrix}
0 & \cdots & 0 & 1 & 0 & \cdots & 0
\end{bmatrix}
\in \mathbb{R}^{1\times n} \\

\text{residual} &=
\begin{bmatrix}
1 & \cdots & 1 & 0 & 1 & \cdots & 1
\end{bmatrix}
\in \mathbb{R}^{1\times n} \\

\text{answer} &= \text{state} \times (\text{transition matrix} \times \text{residual})^{20}

\end{aligned}
$$

Which comes out to $$ 0.4480326 $$<sup id="a3">[3](#f3)</sup>

# Notes


<b id="f1">[1]</b> To simulate the length of Andy's path we can look at a deconstruction of the telstar ball to turn this into a graph traversal [↩](#a1)

![Telstar ball decomposition](/img/posts/telstar-ball.png)

```java
private static Map<Integer, List<Integer>> map = new HashMap<>();

public static void main(String[] args){
    map.put(1, List.of(2, 3, 4));
    map.put(2, List.of(1, 5, 6));
    map.put(3, List.of(1, 7, 9));
    map.put(4, List.of(1, 8, 10));
    map.put(5, List.of(2, 7, 11));
    map.put(6, List.of(2, 8, 12));
    map.put(7, List.of(3, 5, 13));
    map.put(8, List.of(4, 6, 14));
    map.put(9, List.of(3, 10, 15));
    map.put(10, List.of(4, 9, 16));
    map.put(11, List.of(5, 12, 17));
    map.put(12, List.of(6, 11, 18));
    map.put(13, List.of(7, 15, 17));
    map.put(14, List.of(8, 16, 18));
    map.put(15, List.of(9, 13, 19));
    map.put(16, List.of(10, 14, 19));
    map.put(17, List.of(11, 13, 20));
    map.put(18, List.of(12, 14, 20));
    map.put(19, List.of(15, 16, 20));
    map.put(20, List.of(17, 18, 19));

    long trials = 100_000_00;
    long sum = 0;

    for(int i = 0; i < trials; i++){
        sum += sample((int)(trials % 3) + 2) + 1;
    }

    // ~20
    System.out.println("Trials: " + trials + " sum: " + sum + " avg: " + ((double) sum / trials));
}

public static long sample(int i){
    if(i == 1) return 0;

    int randomNumber = (int) (Math.random() * 3);
    return 1 + sample(map.get(i).get(randomNumber));
}
```

<b id="f2">[2]</b> To simulate the length of Andy's path in the kitchen we can reuse the logic behind the transition matrix [↩](#a2)

```java
public static void main(String[] args){
    long trials = 100_000_00;
    long sum = 0;
    long over = 0;
    for(int i = 0; i < trials; i++){
        if(i % 3 == 0 && infinite(1, 0, 1)){
            over++;
        } else if (i % 3 == 1 && infinite(0, -1, 1)){
            over++;
        } else if (i % 3 == 2 && infinite(-1, 0,1)){
            over++;
        }
    }
    // ~0.4480326
    System.out.println("Trials: " + trials + " over: " + over + " avg: " + ((double) over / trials));
}

public static boolean infinite(int x, int y, int moves){
    if(moves > 20) return true;
    if(x == 0 && y == 0) return false;

    int randomNumber = (int) (Math.random() * 3);
    if(Math.abs(y) % 2 == 0){
        if(Math.abs(x) % 2 == 0){
            
            if(randomNumber == 0){
                return infinite(x + 1, y, moves + 1);
            } else if(randomNumber == 1){
                return infinite(x - 1, y, moves + 1);
            } else {
                return infinite(x, y - 1, moves + 1);
            }

        } else {
            
            if(randomNumber == 0){
                return infinite(x + 1, y, moves + 1);
            } else if(randomNumber == 1){
                return infinite(x - 1, y, moves + 1);
            } else {
                return infinite(x, y + 1, moves + 1);
            }

        }
    } else {

        if(Math.abs(x) % 2 == 1){
            
            if(randomNumber == 0){
                return infinite(x + 1, y, moves + 1);
            } else if(randomNumber == 1){
                return infinite(x - 1, y, moves + 1);
            } else {
                return infinite(x, y - 1, moves + 1);
            }

        } else {
            
            if(randomNumber == 0){
                return infinite(x + 1, y, moves + 1);
            } else if(randomNumber == 1){
                return infinite(x - 1, y, moves + 1);
            } else {
                return infinite(x, y + 1, moves + 1);
            }

        }

    }
}
```
<b id="f3">[1]</b> The final answer requires a lot of number crunching which can be simplified with the following code [↩](#a3)

```java
public static void main(String[] args){
  int pad = 20;
  int length = (pad + pad + 1);
  double[][] transitionMatrix = new double[length * length][length * length];

  boolean faceDown = false;
  double oneThird = 1.0/3.0;
  for(int i = 1; i < length * length; i++){
      transitionMatrix[i][i - 1] = oneThird;
      transitionMatrix[i - 1][i] = oneThird;

      if(i - length >= 0 && !faceDown){
          transitionMatrix[i][i - length] = oneThird;
          transitionMatrix[i - length][i] = oneThird;
      }
      faceDown = !faceDown;
      if((i + 1) % length == 0 && length % 2 == 0) faceDown = !faceDown;
  }

  for(double[] i: transitionMatrix){
      System.out.println(Arrays.toString(i));
  }

  double[] start = new double[transitionMatrix.length];
  int center = transitionMatrix.length / 2;
  start[center] = 1.0;
  double precise = 0;

  start = matrixMultiple(start, transitionMatrix);

  for(int step = 0; step < 20; step++){
      precise += start[center];
      start[center] = 0;
      start = matrixMultiple(start, transitionMatrix);
      System.out.println("step: " + step + ", % returned: " + precise);
  }

  System.out.println("Percentage > 20 steps: " + (1.0 - precise));
}

public static double[] matrixMultiple(double[] start, double[][] transitionMatrix){
    double[] ret = new double[start.length];

    for(int i = 0; i < start.length; i++){
        double newValue = 0;
        for(int row = 0; row < transitionMatrix.length; row++){
            newValue += transitionMatrix[row][i] * start[row];
        }
        ret[i] = newValue;
    }

    return ret;
}
```
