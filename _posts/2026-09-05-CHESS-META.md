---
layout: post
title: "Chess Meta"
subtitle: "Is there a Chess Meta? What is it?"
date: 2026-09-05  09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

<style>
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

.img-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>

Chess has not had any meaningful change to its ruleset (for the average player) over the past century. I wondered if that meant the meta had stagnated to a select few openings or if external factors can impact the meta as meaningfully as internal factors.

The meta ([metagame](https://en.wikipedia.org/wiki/Metagame#Competitive_gaming)) strategy is one that refers to the most popular and powerful strategy players are relying on for winning.

Typically this involves picking specific characters/skills/classes that are deemed to be overpowered at any given time by the playerbase.

The meta will fluctuate as the game developers update rulesets and players discover new strategies to shake the meta.

For example in League of Legends, Ezreal at some points was extremely popular and at other times was completely irrelevant.

  <img
    class="img-center"
    src="/img/posts/ezreal_meta.png"
    alt="Popularity of Ezreal over time"
  />

### Defining the Chess meta

In Chess I would consider the meta to be what initial few plies (a ply is an individual persons move) the players decide to play. 

Unfortunately there are millions upon millions of possibilities after the [first 6 plies](https://en.wikipedia.org/wiki/Shannon_number) . Thankfully many of these are never played or played so infrequently that we can exclude them.

The [Encyclopaedia of Chess Openings (ECO)](https://en.wikipedia.org/wiki/Encyclopaedia_of_Chess_Openings), attempts to categorize the main set of openings from these millions of possibilities.

However the ECO has issues as many openings overlap or are prefixes of one another.

For example [King's Pawn Game, "1. e4" (B00)](https://en.wikipedia.org/wiki/King's_Pawn_Game) 

![popularity of ezreal over time](/img/posts/kings_pawn.png)

is the prefix of many other openings such as the [Scandinavian Defence, "1.e4 d5" (B01)](https://en.wikipedia.org/wiki/Scandinavian_Defense), or [Sicilian Defence, "1.e4 c5" (B20)](https://en.wikipedia.org/wiki/Sicilian_Defence)

![popularity of ezreal over time](/img/posts/chess_openings_prefixes.png)

Another wrinkle is that positions can transpose. "1.c4 d5 2.d4 ..." is the same as "1.d4 d5 2.c4 ..."  yet one started as a [Queen's pawn game, "1. d4" (A40)](https://en.wikipedia.org/wiki/Queen's_Pawn_Game) and the other as an [English Opening, "1.c4" (A10)](https://en.wikipedia.org/wiki/English_Opening).

So rather than looking at named openings we'll look at the meta for 1,2,4,6 ply games.

### One-ply meta

The one-ply meta is the unextraordinary: "1.e4".

It is the most emphatic move seizing control of the center, unblocking your queen and bishop as well as keeping your future options flexible. Every book, coach, youtube video tells you to do this move first.

![popularity of one ply moves over time](/img/posts/meta-one-ply.png)

### Two-ply meta

The second ply is where I imagined things could get interesting. There are many accurate responses to "1.e4": [Modern Defence](https://en.wikipedia.org/wiki/Modern_Defence), [Caro-Kann](https://en.wikipedia.org/wiki/Caro%E2%80%93Kann_Defence), [Sicilian Defence](https://en.wikipedia.org/wiki/Sicilian_Defence), [French Defence](https://en.wikipedia.org/wiki/French_Defence), etc as well as many positions that transpose to one another.

What the data clearly shows is the [Open Game](https://en.wikipedia.org/wiki/Open_Game) is heavily preferred, again it keeps your options flexible while seizing control of as much of the board as possible.

![popularity two ply moves over time](/img/posts/meta-two-ply.png)

### Four-ply meta

The fourth-ply distribution shows an interesting fact. There is a preference for openings that lead to a [Scotch](https://en.wikipedia.org/wiki/Scotch_Game), [Italian](https://en.wikipedia.org/wiki/Italian_Game) or [Three Knights game](https://en.wikipedia.org/wiki/Three_Knights_Game) but I wouldn't consider it very meta with less than 20% of games going down that route and many many other openings being played at all ratings. 

![popularity of four ply moves over time](/img/posts/meta-four-ply.png)

### Six-ply meta

The six-ply distribution continues the trend that there is no heavily dominate opening picked by players. Players prefer to play in the center following good principles but that's it.

![popularity of six ply moves over time](/img/posts/meta-six-ply.png)

### Professional Play

In other games certain meta strategies are near life or death. A champion (Kalista) in the 2017 League of Legend's World Championship had a [100% ban rate](https://gol.gg/tournament/tournament-picksandbans/World%20Championship%202017/), whereas in the 2018 League of Legend's World Championship Aatrox nearly had a [100% pick/ban rate](https://www.redbull.com/us-en/the-champions-who-are-most-contested-in-the-LEC#:~:text=Aatrox%20achieved%20a%20pick/ban%20rate%20of%2099%20percent%20over%20118%20games%2C%20missing%20out%20on%20only%20one%20game%20the%20whole%20tournament).

At the professional level in Chess there is no such strategy and picking meta standard lines is unadvised, as computers have allowed players to memorize [30 plies of theory](https://www.chess.com/events/2026-fide-candidates-open/05/Nakamura_Hikaru-Sindarov_Javokhir) then play them perfectly without blinking an eye. 

In fact top players thrive on picking unorthodox or unfavored openings purely to get their opponents out of their comfort zone and actually thinking. With the hopes that their opponents who rely more on preparation will falter when their game knowledge is put to the test.

This tactic is even more prevalent in tournaments with lower time formats, where opponents simply cannot afford to spend more than 1-2 seconds deliberating a move lest they risk losing on time. 

At the latest [EWC](https://www.chess.com/events/2026-esports-world-cup-playoffs/game), which sported a "10+0" (10 minutes + 0 seconds on every move) time format, the Queen's Gambit was the most popular opening but much below a 40% ratio and many other openings were selected as well.

### Conclusion

The meta strategy for any game is often touted as overstated for anyone but the top professionals (as the blatant skill issues cover up the impact of a marginally better strategy) and instead players should pick what they enjoy and focus on improving.

In Chess you can argue that the possible strategies to pick from are taking control of the center or taking control of the sides. In fact that is how the ECO categories its openings. Therefore you could argue that Chess's meta is to take control of the center.

<figure class="image">
  <img src="/img/posts/eco-openings.png" alt="table format of eco splitting flank vs center strategies">
  <figcaption>How the ECO labels its opening</figcaption>
</figure>

There is an argument that via social media, books, courses and coaches the popularity of playing principled chess (in the center) has increased. 

<figure class="image">
  <img src="/img/posts/meta-four-play-beginners.png" alt="popularity of four ply moves over time for beginners">
  <figcaption>% of openings in the 0-999 rating bracket</figcaption>
</figure>

I'd argue that center vs flank used to be a point of contention for the meta, but now it has become an aspect of the game similar to how Jungling became integral to League of Legends.

For me the meta in Chess, now, would be defined by a concrete opening line becoming dominate and being played substantially more than others.

With that in mind, we can see that Chess rules have "stagnated" but there is no stagnation in the Chess strategies, many options are available to players each being played at a variety of levels and players are free to rotate between them as desired. 

For players wishing to come up with their own openings they need to be prepared against numerous other openings that primarily revolve around controlling the center.

For players chasing the meta they will have to satiate themselves with playing "1. e4" and then pick any viable path down from there.

### Notes

All graphs were generated based on data from [Lichess](https://lichess.org/) and is based on games in the classic time format. 