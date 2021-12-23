---
layout: post
title: "Death Rolling"
subtitle: "Analyzing World of Warcraft players funnest past time."
date: 2021-12-14 15:18:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Programming]
---

<script type="text/javascript" async src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML'></script>
<style>
  img {
    display: block;
    margin: auto;
  }

figcaption {
    text-align: center;
}

details {border: 1px solid #E1E1E1; border-radius: 5px; box-shadow: 0 1px 4px rgba(0, 0, 0, .4); color: #363636; margin: 0 0 .4em; padding: 1%;}

details[open] {background: #E1E1E1;}

summary {background: -webkit-linear-gradient(top, #FAFAFA 50%, #E1E1E1 50%); border-radius: 5px; cursor: pointer; font-size: .8em; font-weight: bold; margin: -1%; padding: 8px 0; position: relative; width: 102%;}

summary:hover, details[open] summary {background: #E1E1E1;}

summary::-webkit-details-marker {display: none}

summary:before{border-radius: 5px; content: "+"; color: #363636; display: block; float: left; font-size: 1.5em; font-weight: bold; margin: -2px 10px 0 10px; padding: 0; text-align: center; width: 20px;}

details[open] summary:before {content: "-"; margin-top: -4px;}

</style>

# Intro

Death rolling is a player made mini-game within World of Warcraft where two players alternate rolling a die between $$ [1-\text{previous players roll}] $$ (the bounds are inclusive) until one player rolls a $$ 1 $$. The following is an example of a game:

Bob and Alice agree to death roll for 100 gold <br/>
Bob agrees to go first <br/>
Bob rolls 42 [1-100]<br/>
Alice rolls 12 [1-42]<br/>
Bob rolls 3 [1-12]<br/>
Alice rolls 1 [1-3]<br/>
Alice transfers 100 gold to Bob.<br/>

Now as a player trying to maximize their returns should you go first or second? Bet large or small? Naturally I wanted to find out.

# Game

<script>
var state = 0;
var autoRoll = false;
var money = 10000;
var personStarting = -1;

function getRandom(max) {
  return Math.floor(Math.random() * max) + 1;
}

function printMessage(message, important){
    var log = document.createElement("p");
    if(important){
      log.innerHTML = "<b>" + message + "</b>";
    } else {
      log.innerHTML = message;
    }
    log.setAttribute("style", "margin: 1px 0px;");
    document.getElementById("log").append(log);
}

function game(startingRoll){
  var turn = personStarting;
  personStarting = -personStarting;
  var roll = startingRoll;

  while(true){
    const oldCap = roll;
    roll = getRandom(roll);

    printMessage((turn == -1 ? "You" : "The computer") + " rolled " + roll + " [1-" + oldCap + "]")

    if(roll == 1){
      printMessage((turn == -1 ? "You lost" : "You won") + " " + startingRoll + "$", true);
      return turn;
    }
    turn = - turn;
  }

}

function playGame(){
  document.getElementById("log").innerHTML = '';
  document.getElementById('log').scrollTop = 0;

  const wager = parseInt(document.getElementById("wager").value);

  if(isNaN(wager)){
    return;
  }

  console.log("Starting game: " + wager);
  printMessage("Starting game with a wager of " + wager);
  money += game(wager) == -1 ? - wager : wager;
  document.getElementById("money").innerText = "Your cash: " + money + "$";
}
</script>

<style>
/* content box */
#tool_tip{
position: relative;
/* font-size: 18px; - use only if required
/* line-height: 28px; - use only if required */
}

/* Tooltip */
.help-tip{
position: absolute;
/* top: 18px; */
right: 18px;
text-align: center;
background-color: #4F798E;
border-radius: 50%;
width: 24px;
height: 24px;
line-height: 26px;
cursor: default;
}

.help-tip:before{
content:'?';
font-weight: bold;
color:#fff;
}

.help-tip:hover p{
display:block;
transform-origin: 100% 0%;
-webkit-animation: fadeIn 0.3s ease-in-out;
animation: fadeIn 0.3s ease-in-out;
}

.help-tip p{
display: none;
text-align: left;
background-color: #1E2021;
padding: 20px;
width: 300px;
position: absolute;
border-radius: 3px;
box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
right: -4px;
color: #FFF;
font-size: 13px; /* Change the font size inside tooltip */
line-height: 1.4;
}

.help-tip p:before{
position: absolute;
content: '';
width:0;
height: 0;
border:6px solid transparent;
border-bottom-color:#1E2021;
right:10px;
top:-12px;
}

.help-tip p:after{
width:100%;
height:40px;
content:'';
position: absolute;
top:-40px;
left:0;
}

@-webkit-keyframes fadeIn {
0% { 
opacity:0; 
transform: scale(0.6);
}

100% {
opacity:100%;
transform: scale(1);
}
}

@keyframes fadeIn {
0% { opacity:0; }
100% { opacity:100%; }
}

/* Adjust tooltip size on mobile devices */
@media screen and (max-width: 480px) {
.help-tip p{
width: 200px;
}
}
</style>

<div style="display: flex; align-items: stretch; justify-content: space-between;">
  <button  id="start" onclick="playGame()"> Start Game </button>
  <div id="money">Your cash: 10000$</div>
  <div id="tool_tip">
    <div class="help-tip">
    <p>Death roll against a computer, alternating who goes first. Skip ahead to find out how to size your wagers. Keep in mind you can only wager whole integer amounts.</p>
    </div>
  </div>

</div>

<label for="wager">Desired Wager</label>
<input id='wager' type="number" step="1" placeholder="10"/>

<div id="log" style="overflow-y: scroll; height:400px;"></div>

<br>

<script>
const node = document.getElementById("wager");
node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        playGame();
    }
});
document.getElementById('wager').value = 1000;
</script>

# Simulation

My initial assumption was for very small bets the second roller would have a large advantage and the first roller would have a minimal $$ 1/2\% $$ advantage for larger rolls. The intuition behind that is small rolls, for example starting at $$ 2 $$, there is a large probability that the initial roll will be a $$ 1 $$ resulting in an instantaneous victory for the 2nd player. While for larger rolls there is a very small chance you roll a $$ 1 $$, but you are almost guaranteed the 2nd player will have to roll between 1 and a smaller number, giving them a larger chance of rolling a $$ 1 $$.

With a bit of [code](https://colab.research.google.com/drive/1v1zcegJFMhxCg7KoFOlXWLKd7g8oNpRh#scrollTo=bdLKX82Yutjp) we can simulate thousands of death rolls and see our winrate.

<figure class="image">
  <img src="/img/posts/wr-vs-wager.PNG" alt="Wager vs win rate for death rolling">
  <figcaption><b>Fig 1</b>:Depicting our winrate, with us rolling first, across a variety of starting rolls.</figcaption>
</figure>

We can also simulate the winrate of our opponent

![Wager vs win rate for death rolling](/img/posts/wr-vs-wager-2.PNG)

Our winrate for very small wagers $$ (2,3,4,5) $$ is quite low, but very quickly approaches a near $$ 50\% $$ winrate.

If we perform $$ 10,000,000 $$ simulations with a starting roll of $$ 10,000 $$ the winrate is essentially $$ 50\% $$.

![Wager vs win rate for death rolling](/img/posts/large_sample_50.PNG)

It seems for small rolls my initial assumption was correct,however, for larger initial rolls neither side has an advantage.

# Analysis

Now we'll try and be more exact about our chances of winning.

Let

$$ g(n) = \text{expected chance of winning over losing}, -1 <= g(n) <= 1 $$.

So if $$ g(n) = 1 $$ we would expect to always win, while $$ g(n) = -1 $$ would mean we always lose and $$ g(n) = 0 $$ means we lose as often as we win.

Next we'll draw a probability tree for a game with a starting roll of $$ 3 $$.

![probability tree for death rolling starting at 3](/img/posts/starting_at_3.PNG)

On the first roll we instantly lose $$ \frac{1}{3}rd $$ of the time, roll $$ 2 $$ a $$ \frac{1}{3}rd $$ of the time and roll $$ 3 $$ a $$ \frac{1}{3}rd $$ of the time. In the cases we roll a $$ 2 $$ or $$ 3 $$ we can draw out what the opponents probability's are.

![probability tree for death rolling starting at 3](/img/posts/starting_at_3_recursive.PNG)

Quite quickly we see the recursive nature of this game.

Expected value is typically calculated as

$$ \text{EV} = \sum{(P(X_i) \times X_i)} $$

Where $$ P(X_i) $$ is the probability that outcome $$ X_i $$ occurs. In our case we have 3 outcomes, either we roll a $$ \{1,2,3\} $$, each having an equal probability $$ P(1) = P(2) = P(3) = \frac{1}{3} $$.

Therefore<sup id="a1">[1](#f1)</sup>

$$
\begin{align}
g(3) &= \frac{1}{3} \times (-1) - \frac{1}{3} \times g(2) - \frac{1}{3} \times g(3) \\
& = - \frac{1}{3} - \frac{1}{3}g(2) - \frac{1}{3}g(3)
\end{align}
$$

Now we need to figure out what $$ g(2) $$ is equal to.

We'll start off again by drawing its probability tree

![probability tree for death rolling starting at 2](/img/posts/starting_at_2.PNG)

$$ g(2) = -\frac{1}{2} - \frac{1}{2}g(2) $$

We'll expand that several times and see if we can see any pattern.

![probability tree for death rolling starting at 2](/img/posts/starting_at_2_recursive.PNG)

$$
\begin{align}
g(2) &= -\frac{1}{2} - \frac{1}{2} g(2) \\
&= - \frac{1}{2} - \frac{1}{2} ( -\frac{1}{2} - \frac{1}{2} g(2) ) \\
&= - \frac{1}{2} + \frac{1}{4} + \frac{1}{4} g(2) \\
&= - \frac{1}{2} + \frac{1}{4} + \frac{1}{4} ( -\frac{1}{2} - \frac{1}{2} g(2) ) \\
&= - \frac{1}{2} + \frac{1}{4} - \frac{1}{8} - \frac{1}{8} g(2) \\
&= - \frac{1}{2} + \frac{1}{4} - \frac{1}{8} - \frac{1}{8} ( -\frac{1}{2} - \frac{1}{2} g(2) ) \\
&= - \frac{1}{2} + \frac{1}{4} - \frac{1}{8} +\frac{1}{16} + \frac{1}{16} g(2) \\
&\cdots \\
&= \sum_{n=1}^{\infty}\left(\frac{-1}{2}\right)^{n} \\
\end{align}
$$

We can apply the following identity to our above summation:
$$\sum_{n=1}^{\infty}(ar^k) = \frac{ar}{1-r}, \text{iff } \vert r \vert < 1$$.

$$g(2) = \frac{1 \times \frac{-1}{2}}{1 - \frac{-1}{2}} = -\frac{1}{3}$$

Therefore we can expect to lose $$ 33.\bar{3}\% $$ more games than we win. Another way to write the equation is $$ g(n) = \text{win %} - \text{lose %} $$. Additionally we know $$ \text{win %} + \text{lose %} = 1 $$. We can express our winrate directly.

$$
\begin{align}
g(n) &= W(n) - L(n) \tag{1} \\
1 &= W(n) + L(n) \tag{2} \\
&\text{Add (1) to (2)} \\
g(n) + 1 &= 2W(n) \\
\frac{g(n) + 1}{2} &= W(n) \\
\end{align}
$$

Using our previously calculated results

$$ g(2) = - \frac{1}{3} \longrightarrow W = \frac{g(2) + 1}{2} = \frac{ -\frac{1}{3} + 1}{2} = \frac{1}{3}, L = \frac{2}{3} $$

Hence, we can expect to win once every $$ 3 $$ wagers assuming we roll first and begin the rolls at $$ 2 $$.

Now that we've calculated $$ g(2) $$ let's go back to $$ g(3) $$. From above we have

$$
\begin{align}
g(3) &= -\frac{1}{3} - \frac{1}{3}g(2) - \frac{1}{3}g(3) \tag{1} \\
g(2) &= -\frac{1}{3} \tag{2} \\
&\text{Substitute (2) into (1)} \\
g(3) &= -\frac{1}{3} - \frac{1}{3}(- \frac{1}{3}) - \frac{1}{3}g(3) \\
&= -\frac{1}{3} + \frac{1}{9} - \frac{1}{3}g(3) \\
&= -\frac{2}{9} - \frac{1}{3}g(3) \\
&= -\frac{2}{9} - \frac{1}{3}(-\frac{2}{9} - \frac{1}{3}g(3)) \\
&= -\frac{2}{9} +\frac{2}{27} + \frac{1}{9}g(3) \\
&= -\frac{2}{9} +\frac{2}{27} + \frac{1}{9}(-\frac{2}{9} - \frac{1}{3}g(3)) \\
&= -\frac{2}{9} +\frac{2}{27} -\frac{2}{81} - \frac{1}{27}g(3) \\
&\cdots \\
&=\sum_{n=0}^{\infty}-2\left(\frac{-1}{3}\right)^{\left(n+2\right)} \\
&=-\frac{1}{6}
\end{align}
$$

If we continue this process we'll see that

$$
\begin{align}
g(4) &= -\frac{1}{10} \\
g(5) &= -\frac{2}{30} \\
g(6) &= -\frac{1}{21} \\
\end{align}
$$

While these equations are helpful there doesn't seem to be any obvious pattern that we could exploit, so instead we'll obtain a explicit formula for $$ g(n) $$ through solving its recurrence equation.

# Explicit Formula

First will define $$ g(n) $$ recursively as

![probability tree for death rolling starting at n](/img/posts/starting_at_n.PNG)

$$
\begin{align}
g(n) &= - \frac{1}{n} - \sum_{i = 2}^{n}(\frac{1}{n}g(i)) \\
&= -\frac{1}{n}(1 + \sum_{i = 2}^{n}{g(i)})
\end{align}
$$

Next we'll define $$s(n) = \sum_{i=2}^{n}{g(i)}$$ then we have that $$ g(n) = - \frac{1}{n}(1 + s(n)) $$. We can also see that $$ g(n) = s(n) - s(n - 1) $$ <sup id="a2"><a href="#f2">[2]</a></sup>. Therefore we can plug that into the above recursive formula we have for $$ g(n) $$.

$$
\begin{align}
s(n) - s(n-1) &= -\frac{1}{n}(1 + \sum_{i=2}^{n}{g(i)}) \\
s(n) - s(n-1) &= -\frac{1}{n}(1 + s(n)) \\
(n)s(n) - (n)s(n-1) &= -1 - s(n) \\
(n+1)s(n) - (n)s(n-1) &= -1 \\
\end{align}
$$

Let's guess that $$ s(n) = -\frac{n-1}{n+1} $$ solves the above equation as well as satisfying $$ s(2) = g(2) = -\frac{1}{3} $$<sup id="a3"><a href="#f3">[3]</a></sup>. Thus

$$
\begin{align}
g(n) &= s(n) - s(n - 1) \\
&= -\frac{n-1}{n+1} + \frac{n-2}{n} \\
&= \frac{-n^2+n+(n+1)(n-2)}{(n+1)n} \\
&= \frac{-n^2+n+n^2-2n+n-2}{(n+1)n} \\
&=-\frac{2}{(n+1)n}
\end{align}
$$

Plugging that into our $$ W(n) $$ formula from above we get

$$
\begin{align}
W(n) &= \frac{g(n) + 1}{2} \\
&= \frac{-\frac{2}{(n+1)n} + 1}{2} \\
&= \frac{1}{2} - \frac{1}{(n+1)n} \\
\end{align}
$$

$$\lim_{n\to\infty} W(n) = \frac{1}{2} - \frac{1}{\infty} = \frac{1}{2}$$

Which if we graph out looks very similar to our simulation results

<figure class="image">
  <img src="/img/posts/final_wr.PNG" alt="Simulated results vs expected results for death rolling">
  <figcaption><b>Fig 2</b>:Depicting the simulated and expected winrates, one can very faintly see a small discrepancy around wagers of 60. Overall, however, the expected and simulated results match up very well.</figcaption>
</figure>

In the end we see that regardless of the starting wager size the second player always has some advantage, which for sufficiently large wagers has negligible impact.

Death rolling, while funner than flipping a coin essentially can be simplified to exactly that, a $$ 50/50 $$ chance of winning or losing.

# Notes

Lots of the equations/math was verified using [this Desmos calculator](https://www.desmos.com/calculator/nctehklw29).

<b id="f1">[1]</b> In the case of rolling a $$ 1 $$ we instantly lose so we assign that a $$ -1 $$ value, and we minus the recursive cases since its returning the probability the opponent wins when starting to roll from $$ 2,3 $$. [↩](#a1)

<b id="f2">[2]</b>

$$s(n) - s(n-1) = \sum_{i=2}^{n}{g(i)} - \sum_{i=2}^{n-1}{g(i)} = g(n)$$.

[↩](#a2)

<b id="f3">[3]</b>

Let's show that $$ (n+1)s(n) - (n)s(n-1) = -1 $$ is solved by $$ s(n) = -\frac{n-1}{n+1} $$

$$
\begin{align}
(n+1)s(n) - (n)s(n-1) &= -1 \\
-\frac{(n+1)(n-1)}{n+1} + \frac{n(n-2)}{n} &= -1 \\
-n+1+n-2 &= -1 \\
-1 &= -1 \\
\end{align}
$$

Big thanks to briemann from Stackexchange, he wrote most of the proof for [solving the recurrence equation](https://math.stackexchange.com/questions/4320826/finding-a-closed-form-formula-to-a-recurrence-with-summation-of-past-terms) [↩](#a3)
