---
layout:     post
title:      "Starving yourself to riches"
subtitle:   "The easiest way to become the next self made millionaire"
date:       2019-05-14 15:18:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"	
comments: true
tags: [ Money ]
---

***Disclaimer: This is a parody of [https://www.cnbc.com/2019/03/28/suze-orman-spending-money-on-coffee-is-like-throwing-1-million-down-the-drain.html](https://www.cnbc.com/2019/03/28/suze-orman-spending-money-on-coffee-is-like-throwing-1-million-down-the-drain.html).***


***Take anything I say in this article with a grain of salt, and the numbers are sometimes rounded sometimes not depending on my mood when I was calculating :).***


***All these prices/nutrition facts will be based on the [independent city market website](https://www.independentcitymarket.ca)***

As I am slightly larger than average, 6 feet ~200 pounds, I tend to eat more than people around me. This got me thinking, maybe if I just starve myself I could lose weight and make a few million dollars! 

According to this [calorie calculator](https://www.calculator.net/calorie-calculator.html) and myfitnesspal I need to eat around 2300 calories to maintain my weight with little to no exercise. With light exercise 1-3 times a week this gets bumped up to 2700 calories a day. Considering that I have been at my current weight for a while I likely am eating close to 2700 calories a day. 

A [survey](https://bmcpublichealth.biomedcentral.com/articles/10.1186/1471-2458-12-439) done in 2012 suggested that the average North American weights 178 pounds (I believe this stat is across both sexes). Using the same calculator + activity level the average North American eats about 2500 calories a day. So typically I eat 200 calories a day more than the average North American.

This begs the question what's the typical dollar value of a calorie?

If I just guzzle canola oil, I will need to eat/drink an extra ~25ml of oil.

![Canola oil nutrition](/img/posts/oil.PNG)

Which at my local supermarket will cost me a whole 0.05825$ extra a day. Given I am approaching 22 years and assuming I keep up this consumption to my late 70s. I would spend an extra (0.05825$ * 365 * (70 - 22)) = 1020.54$. 

As one could expect a pure canola oil diet isn't likely to keep me alive for a long time... So lets take a look at prices for some premade meals.

I have seen some good looking [ham/cheese baguettes](https://www.independentcitymarket.ca/Food/Deli-%26-Ready-Meals/Ready-Meals-%26-Sides/Sandwiches-%26-Lunch-Kits/Ham-and-Compt%C3%A9-Cheese-Baguette/p/20786966_EA).

![Baguette](/img/posts/sandwich.PNG)
![Baguette nutrition](/img/posts/sandwichnutrition.PNG)

To round off the meal we can add a nice [garden salad](https://www.independentcitymarket.ca/Food/Meal-Kits-%26-Deli/Ready-Meals-%26-Sides/Salads/Garden-Salad-with-Cheese%2C-Small/p/20099003_KG).

![Garden salad nutrition](/img/posts/gardensalad.PNG)
![Garden salad](/img/posts/gardensaladnutrition.PNG)

If I add an extra 100 calories from the sandwich and the salad I would be spending an extra 4$  a day (1.25$ a day from the sandwich and 2.82$ from the salad). Which would be (4$ * 365 * (70 - 22)) = 71264$ by the time I am 70 or 1484$ a year. 

Now this is not a million dollars but lets see what happens when we invest those savings with a return of 10% and let the magic compounding go to work.

Given that we have an income of 1484$/year and an annual return of 10% we get a simple recursive equation. 

f(0) = 0, f(1) = 1484
f(x) = f(x - 1) * 1.1 + 1484 

![Return on investment](/img/posts/graph.PNG)

And BOOM! over 1 million dollars in 48 years if I just start eating less now. 

But why should I stop at eating 2500 calories a day. If dropping 200 calories got me a million dollars why don't I drop 1000 calories and really start raking in the cash. Or I can just stop eating at all, just have vitamin gummy bears and water. Next self made billionaire here I come!

Heres a small little calculator that will show you how much money you can save by starving yourself!

<script>
function myFunction() {
  var diff = document.getElementById("current").value - document.getElementById("desired").value;
  var year = diff * document.getElementById("dperg").value * 365;
  var saved = 0;
  for(var i = 0; i < document.getElementById("years").value; i++){
  	saved *= (1 + document.getElementById("interest").value/100)
    saved += year;
  }
  document.getElementById("moneyresult").innerHTML  = "Money saved: " + saved;
}
</script>

 <label for="current">Current daily calorie intact</label>
<input id='current' type="number" onkeyup="myFunction()" placeholder="current daily calorie intact">
<br>

 <label for="desired">Reduced daily calorie intact</label>
<input id='desired' type="number" onkeyup="myFunction()" placeholder="reduced daily calorie intact">
<br>

 <label for="dperg">$/calorie</label>
<input id='dperg' type="number" onkeyup="myFunction()" placeholder="$/calorie">
<br>

 <label for="years">Years</label>
<input id='years' type="number" onkeyup="myFunction()" placeholder="years">
<br>

 <label for="interest">Yearly interest rate ie 10</label>
<input id='interest' type="number" onkeyup="myFunction()" placeholder="yearly interest rate ie 10">
<br>

<p id='moneyresult'></p>




