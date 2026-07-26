---
layout: post
title: "Jane Street Puzzle: 'Pent-Up' Frustration 3 / Knight Moves 7"
subtitle: "Presenting my solution to the 'Pent-Up' Frustration 3 / Knight Moves 7"
date: 2026-07-26 09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Tutorial]
---

<script type="text/javascript" async src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML'></script>

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({ TeX: { extensions: ["color.js"] }});
</script>


  <style>
    /* :root {
      color-scheme: dark;
      --ink: #fff1d1;
      --edge: #76523b;
      --gold: #f4b449;
      --panel: #211815;
    } */

    /* * { box-sizing: border-box; }

    body {
      margin: 0;
      background: radial-gradient(circle at 50% 0, #3d3040, #110d0d 66%);
      color: var(--ink);
      font: 15px/1.4 Georgia, serif;
    }

    main { max-width: 1120px; margin: auto; padding: 22px; }
    h1 { margin: 0; font-size: clamp(1.45rem, 3vw, 2.25rem); } */
    .shell p { color: #dbc8a6; }

    .shell {
      overflow: hidden;
      border: 1px solid var(--edge);
      border-radius: 16px;
      background: #1d1715;
      box-shadow: 0 24px 60px #0009;
      color-scheme: dark;
      --ink: #fff1d1;
      --edge: #76523b;
      --gold: #f4b449;
      --panel: #211815;
    }

    canvas { display: block; width: 100%; height: auto; background: #FFE6C8; }

    .move-controls,
    .spacing-control {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 10px;
      align-items: center;
      padding: 12px;
      background: var(--panel);
    }

    .move-controls { grid-template-columns: auto auto 1fr auto; border-top: 1px solid var(--edge); }
    .spacing-control { padding-top: 0; color: #dbc8a6; font-size: .9rem; }
    .spacing-control output { min-width: 3ch; color: var(--ink); text-align: right; font-variant-numeric: tabular-nums; }

    button {
      border: 1px solid #9b7047;
      border-radius: 8px;
      background: #4a3022;
      color: var(--ink);
      padding: 7px 10px;
      font: inherit;
      cursor: pointer;
    }

    button:hover { background: #67432e; }
    input { width: 100%; accent-color: var(--gold); }
    .detail { min-height: 25px; margin: 10px 2px 0; color: #f0d29a; }
    .hint { font-size: .87rem; color: #bda985; }

    @media (max-width: 600px) { main { padding: 12px; } }
  </style>

# Introduction

In Jane Street's [latest puzzle, ‘Pent-Up’ Frustration 3 / Knight Moves 7,](https://www.janestreet.com/puzzles/beside-the-point-index/) we're given the following prompt 

> The board above has been tiled with the 12 pentominoes (plus a 2-by-2 tetromino) into 13 regions. Think of each of these 13 regions as constructed out of 1-by-1-by-1 cubes. We need to add a tower to each region. A tower is an additional size-1 cube placed on one of a region’s squares. <br><br> After adding these towers, place a knight at the bottom-left square. It then proceeds to make knight’s moves until it has visited all the towers. It never visits the same space twice. (A move on this board involves travelling 0 units in one dimension, 1 in another, and 2 in the third. The knight is allowed to “pass through” towers as it moves.) <br><br> But there’s a catch: As you can see, the knight starts with a score of 0. On its Nth move, its score increases by N if the move is to a location at the same altitude as the square it moved from. If, instead, it moves up, the score is multiplied by N. And finally, if it moves down, the score is divided by N. This last type of move is only allowed if the score is evenly divisible by N. <br><br> Every three moves, up until move #18, the knight wrote down its score upon arriving at a given square. From then on it only wrote down its score every K moves, for some larger value K. Using this information, can you reconstruct the knight’s path?  <br><br> After filling all the remaining visited squares with the missing score values, find the unvisited squares. For each of these squares, compute the sum of the scores in any orthogonally adjacent squares that were part of the knight’s path. The answer to this puzzle is the sum of these “neighbor sums” from the unvisited squares.

As well as a visual depiction

<img src="https://www.janestreet.com/puzzles/pent-3-knight-7.png" />

# Solution

$$ 33609 $$ is the final result, with the path and tower placement depicted in the animation below (a hand sketched version is shown in the next subsection)

<section class="shell">
      <canvas id="board" width="1300" height="760" aria-label="Isometric solution board" style="width: 100%"></canvas>

<div class="move-controls">
<button id="previous" type="button" aria-label="Previous move">◀</button>
<button id="autoplay" type="button">Auto play</button>
<input id="move-slider" type="range" min="0" max="54" value="0" aria-label="Solution move">
<button id="next" type="button" aria-label="Next move">▶</button>
</div>

<label style="display: none" class="spacing-control" for="spacing-slider">
Tile spacing
<input  id="spacing-slider" type="range" min="0" max="120" value="98">
<output id="spacing-value">120</output>
</label>
</section>

 <script>
    const BOARD_SIZE = 8;
    const CANVAS_WIDTH = 1300;
    const CANVAS_HEIGHT = 760;
    const BOARD_CENTER = { x: 650, y: 420 };
    // Match the grass tile's top-face proportions so neighboring tile edges align.
    const VIEW_ANGLE = Math.PI / 4;
    const ISO_VERTICAL_SCALE = 0.583;
    const TILE_SIZE = { width: 96, height: 90 };
    const SPAWN_LIGHT_FLOOR_OFFSET = 26;
    const PRISM_HALF_HEIGHT = 23.5;
    const PRISM_HOVER_HEIGHT = 16;
    const REGION_COLORS = [
      '#ff69b6', '#70efff', '#aa7dff', '#85ff79', '#ffd55c', '#ff8e47', '#55ffd1',
      '#f168ff', '#70a0ff', '#ff8bd5', '#bdff48', '#55efff', '#ffa267'
    ];

    const regions = [
      [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
      [[1, 6], [1, 7], [1, 8], [2, 8], [3, 8]],
      [[2, 1], [2, 2], [2, 3], [3, 1], [3, 3]],
      [[2, 4], [2, 5], [3, 4], [3, 5], [3, 6]],
      [[2, 6], [2, 7], [3, 7], [4, 7], [4, 8]],
      [[3, 2], [4, 2], [4, 3], [5, 3], [6, 3]],
      [[4, 1], [5, 1], [5, 2], [6, 1], [7, 1]],
      [[4, 4], [4, 5], [5, 4], [5, 5]],
      [[4, 6], [5, 6], [5, 7], [6, 5], [6, 6]],
      [[5, 8], [6, 8], [7, 8], [8, 7], [8, 8]],
      [[6, 2], [7, 2], [8, 1], [8, 2], [8, 3]],
      [[6, 4], [7, 3], [7, 4], [7, 5], [8, 4]],
      [[6, 7], [7, 6], [7, 7], [8, 5], [8, 6]]
    ];

    const path = [
      [8, 1], [7, 3], [6, 5], [6, 7], [8, 8], [7, 6], [5, 5], [3, 5],
      [1, 5], [3, 4], [1, 3], [2, 1], [4, 1], [2, 2], [1, 4], [1, 6],
      [2, 4], [4, 3], [6, 4], [7, 2], [5, 1], [5, 3], [4, 5], [2, 6],
      [2, 8], [3, 6], [4, 4], [6, 3], [7, 1], [8, 3], [8, 5], [8, 7],
      [6, 6], [6, 8], [4, 8], [2, 7], [4, 6], [2, 5], [3, 3], [5, 2],
      [3, 1], [2, 3], [4, 2], [6, 1], [8, 2], [7, 4], [6, 2], [5, 4],
      [7, 5], [5, 6], [7, 7], [5, 8], [3, 7], [1, 8], [3, 8]
    ];

    const scores = [
      0, 1, 3, 1, 5, 10, 16, 112, 14, 23, 33, 44, 528, 541, 555, 37,
      53, 70, 88, 107, 127, 2667, 2689, 2712, 113, 138, 164, 191, 219,
      248, 7440, 240, 272, 8976, 264, 299, 335, 372, 410, 449, 489, 530,
      572, 615, 659, 704, 750, 797, 845, 894, 944, 995, 1047, 1100, 59400
    ];

    const towerMoves = new Set([0, 1, 2, 7, 12, 13, 14, 21, 22, 23, 30, 33, 54]);
    const clueMoves = new Set([0, 3, 6, 9, 12, 15, 18, 25, 32, 39, 46, 53]);

    const canvas = document.querySelector('#board');
    const context = canvas.getContext('2d');
    const grassBuffer = document.createElement('canvas');
    grassBuffer.width = TILE_SIZE.width;
    grassBuffer.height = TILE_SIZE.height;
    const grassBufferContext = grassBuffer.getContext('2d');
    const previousButton = document.querySelector('#previous');
    const nextButton = document.querySelector('#next');
    const autoplayButton = document.querySelector('#autoplay');
    const moveSlider = document.querySelector('#move-slider');
    const spacingSlider = document.querySelector('#spacing-slider');
    const spacingValue = document.querySelector('#spacing-value');
    const detail = document.querySelector('#detail');
    let boardHasEnteredViewport = false;

    const moveByCell = new Map(path.map((cell, move) => [cell.join(','), move]));
    const regionByCell = new Map(
      regions.flatMap((cells, region) => cells.map(cell => [cell.join(','), region]))
    );
    const assets = {
      grass: loadImage('/img/posts/Grass Tile.svg'),
      grassWithDrip: loadImage('/img/posts/Grass Tile With Drip.svg'),
      dirt: loadImage('/img/posts/Dirt Tile.svg'),
      prism: loadImage('/img/posts/Prism.svg'),
      spawnLight: loadImage('/img/posts/Spawn Light.svg')
    };

    const boardObserver = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;

      boardHasEnteredViewport = true;
      boardObserver.disconnect();
    }, { threshold: 1 });
    boardObserver.observe(canvas);

    let selectedMove = 0;
    let tileSpacing = Number(spacingSlider.value);
    let time = 0;
    let tileWaveStartedAt = null;
    let prismMotion = { fromMove: 0, toMove: 0, startedAt: 0 };
    let autoplayTimer = null;

    function loadImage(source) {
      const image = new Image();
      image.src = source;
      return image;
    }

    function project(row, column, height = 0) {
      const boardX = (column - 4.5) * tileSpacing;
      const boardY = (row - 4.5) * tileSpacing;
      const cosine = Math.cos(VIEW_ANGLE);
      const sine = Math.sin(VIEW_ANGLE);

      return {
        x: BOARD_CENTER.x + boardX * cosine - boardY * sine,
        y: BOARD_CENTER.y + (boardX * sine + boardY * cosine) * ISO_VERTICAL_SCALE - height * 31
      };
    }

    function boardCellsInDepthOrder() {
      const cells = [];
      for (let row = 1; row <= BOARD_SIZE; row += 1) {
        for (let column = 1; column <= BOARD_SIZE; column += 1) {
          cells.push({ row, column, ...project(row, column) });
        }
      }
      return cells.sort((a, b) => a.y - b.y || a.x - b.x);
    }

    function drawImageCentered(image, x, y, width, height) {
      context.drawImage(image, x - width / 2, y - height / 2, width, height);
    }

    function tileWaveOffset(cell, now = performance.now()) {
      if (tileWaveStartedAt === null) return 0;

      const projectedColumn = cell.column - cell.row + BOARD_SIZE - 1;
      const delay = projectedColumn * 42;
      const progress = (now - tileWaveStartedAt - delay) / 480;
      if (progress <= 0 || progress >= 1) return 0;

      return -18 * Math.sin(progress * Math.PI) * (1 - progress * 0.2);
    }

    function drawGrassTop(x, y, region, grassAsset) {
      const left = x - TILE_SIZE.width / 2;
      const top = y - TILE_SIZE.height / 2;

      grassBufferContext.clearRect(0, 0, TILE_SIZE.width, TILE_SIZE.height);
      grassBufferContext.drawImage(grassAsset, 0, 0, TILE_SIZE.width, TILE_SIZE.height);
      grassBufferContext.globalCompositeOperation = 'source-atop';
      grassBufferContext.globalAlpha = 0.475;
      grassBufferContext.fillStyle = REGION_COLORS[region];
      grassBufferContext.fillRect(0, 0, TILE_SIZE.width, TILE_SIZE.height);
      grassBufferContext.globalCompositeOperation = 'source-over';
      grassBufferContext.globalAlpha = 1;
      context.drawImage(grassBuffer, left, top);
    }

    function drawTile(cell, now) {
      const region = regionByCell.get(`${cell.row},${cell.column}`);
      const move = moveByCell.get(`${cell.row},${cell.column}`);
      const isTower = towerMoves.has(move);
      const tileY = cell.y + tileWaveOffset(cell, now);
      const topSurfaceY = tileTopSurfaceY(tileY, isTower);
      const topShelfY = tileTopShelfY(tileY, isTower);

      if (isTower) {
        drawImageCentered(assets.dirt, cell.x, tileY, TILE_SIZE.width, TILE_SIZE.height);
        drawGrassTop(cell.x, topSurfaceY, region, assets.grassWithDrip);
      } else {
        drawGrassTop(cell.x, tileY, region, assets.grass);
      }

      if (clueMoves.has(move) || (Number.isInteger(move) && isScoreRevealed(move))) {
        drawProjectedScore(scores[move], cell.x, topShelfY);
      }

      if (move === selectedMove && assets.spawnLight.complete) {
        drawSpawnLight(cell.x, topShelfY);
      }
    }

    function drawProjectedScore(score, x, y) {
      context.save();
      context.translate(x, y);
      context.transform(0.46, 0.08, -0.18, 0.25, 0, 0);
      context.globalAlpha = 0.78;
      context.font = '700 56px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.lineWidth = 3;
      context.strokeStyle = '#f9f2cd';
      context.strokeText(score, 0, 0);
      context.fillStyle = '#30533b';
      context.fillText(score, 0, 0);
      context.restore();
    }

    function drawSpawnLight(x, shelfY) {
      context.save();
      context.globalAlpha = 0.86;
      drawImageCentered(assets.spawnLight, x, shelfY - SPAWN_LIGHT_FLOOR_OFFSET, 50, 80);
      context.restore();
    }

    function tileTopSurfaceY(tileY, isTower) {
      return isTower ? tileY - TILE_SIZE.height * 0.45 : tileY;
    }

    function tileTopShelfY(tileY, isTower) {
      return tileTopSurfaceY(tileY, isTower) - TILE_SIZE.height * 0.19;
    }

    function prismMotionProgress(now = performance.now()) {
      return Math.min(1, (now - prismMotion.startedAt) / 300);
    }

    function isScoreRevealed(move) {
      return move < selectedMove || (move === selectedMove && prismMotionProgress() >= 1);
    }

    function drawPrism() {
      const progress = prismMotionProgress();
      const eased = 1 - Math.pow(1 - progress, 3);
      const [fromRow, fromColumn] = path[prismMotion.fromMove];
      const [toRow, toColumn] = path[prismMotion.toMove];
      const row = fromRow + (toRow - fromRow) * eased;
      const column = fromColumn + (toColumn - fromColumn) * eased;
      const hop = Math.sin(progress * Math.PI) * 22;
      const prismPosition = project(row, column);
      const fromShelfOffset = tileTopShelfY(0, towerMoves.has(prismMotion.fromMove));
      const toShelfOffset = tileTopShelfY(0, towerMoves.has(prismMotion.toMove));
      const flightShelfOffset = fromShelfOffset + (toShelfOffset - fromShelfOffset) * eased;
      const bob = Math.sin(time * 2.2) * 6;
      const landingWave = tileWaveOffset({ row: toRow, column: toColumn });

      context.save();
      drawImageCentered(assets.prism, prismPosition.x, prismPosition.y + landingWave + flightShelfOffset - PRISM_HOVER_HEIGHT - PRISM_HALF_HEIGHT - hop + bob, 48, 47);
      context.restore();
    }

    function drawBoardBacking() {
      const boardCorners = [
        project(0.5, 0.5),
        project(0.5, 8.5),
        project(8.5, 8.5),
        project(8.5, 0.5)
      ];
      const padding = 18;
      const dropShadow = 10;
      const cornerRadius = 14;
      const center = boardCorners.reduce(
        (total, point) => ({ x: total.x + point.x / boardCorners.length, y: total.y + point.y / boardCorners.length }),
        { x: 0, y: 0 }
      );
      const expandedCorners = boardCorners.map((point) => {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        const distance = Math.hypot(dx, dy);
        return {
          x: point.x + (dx / distance) * padding,
          y: point.y + (dy / distance) * padding + dropShadow
        };
      });

      context.save();
      context.globalCompositeOperation = 'destination-over';
      context.fillStyle = '#FFCCA6';
      context.beginPath();
      for (let index = 0; index < expandedCorners.length; index += 1) {
        const previous = expandedCorners[(index - 1 + expandedCorners.length) % expandedCorners.length];
        const current = expandedCorners[index];
        const next = expandedCorners[(index + 1) % expandedCorners.length];
        const previousLength = Math.hypot(current.x - previous.x, current.y - previous.y);
        const nextLength = Math.hypot(next.x - current.x, next.y - current.y);
        const inset = Math.min(cornerRadius, previousLength / 2, nextLength / 2);
        const start = {
          x: current.x + ((previous.x - current.x) / previousLength) * inset,
          y: current.y + ((previous.y - current.y) / previousLength) * inset
        };
        const end = {
          x: current.x + ((next.x - current.x) / nextLength) * inset,
          y: current.y + ((next.y - current.y) / nextLength) * inset
        };

        if (index === 0) context.moveTo(start.x, start.y);
        else context.lineTo(start.x, start.y);
        context.quadraticCurveTo(current.x, current.y, end.x, end.y);
      }
      context.closePath();
      context.fill();
      context.restore();
    }

    function render() {
      time += 0.016;
      const now = performance.now();
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (assets.grass.complete) {
        if (boardHasEnteredViewport && tileWaveStartedAt === null) tileWaveStartedAt = now;
        for (const cell of boardCellsInDepthOrder()) drawTile(cell, now);
      }

      if (assets.prism.complete) drawPrism();
      drawBoardBacking();

      context.fillStyle = '#30533b';
      context.font = '700 17px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
      context.textAlign = 'center';
      context.fillText(`Move ${selectedMove}`, BOARD_CENTER.x, 51);

      requestAnimationFrame(render);
    }

    function updateSelectedMove(move) {
      const nextMove = Math.max(0, Math.min(path.length - 1, move));
      prismMotion = { fromMove: selectedMove, toMove: nextMove, startedAt: performance.now() };
      selectedMove = nextMove;
      moveSlider.value = selectedMove;

      // detail.textContent = selectedMove === 0
      //   ? 'Move 0: the prism hovers over the starting square.'
      //   : `Move ${selectedMove}: (${path[selectedMove - 1]}) → (${path[selectedMove]}). The prism hovers over the solved location.`;
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
      autoplayButton.textContent = 'Auto play';
    }

    function toggleAutoplay() {
      if (autoplayTimer) {
        stopAutoplay();
        return;
      }

      if (selectedMove === path.length - 1) updateSelectedMove(0);
      autoplayButton.textContent = 'Pause';
      autoplayTimer = setInterval(() => {
        if (selectedMove === path.length - 1) {
          stopAutoplay();
        } else {
          updateSelectedMove(selectedMove + 1);
        }
      }, 760);
    }

    previousButton.addEventListener('click', () => updateSelectedMove(selectedMove - 1));
    nextButton.addEventListener('click', () => updateSelectedMove(selectedMove + 1));
    autoplayButton.addEventListener('click', toggleAutoplay);
    moveSlider.addEventListener('input', event => updateSelectedMove(Number(event.target.value)));
    spacingSlider.addEventListener('input', event => {
      tileSpacing = Number(event.target.value);
      spacingValue.value = tileSpacing;
      spacingValue.textContent = tileSpacing;
    });

    updateSelectedMove(0);
    render();
  </script>

# Discovery

Brute force with problem specific optimization comes to mind for these types of problems.

Naively a naive brute force DFS would require checking 

$$
\begin{aligned}
\text{# of moves} &= (\text{# of squares in a row} \times \text{# of squares in a column - 1}) ^{|\text{+ moves}| + |\text{* moves}\ + |\text{/ moves}|} \\
&= 63 ^{8 + 4 + 4} \\
&= 6.158129128\times10^{28}
\end{aligned}
$$

Board positions to see which solved the problem.

Some simple observations bring that # down immensely
- `It then proceeds to make knight’s moves until it has visited all the towers`, meaning the last move must end with the horse on a tower
- `It never visits the same space twice.` and `We need to add a tower to each region` meaning there can only be 13 moves at z-index of 1
- `Every three moves, up until move #18, the knight wrote down its score upon arriving at a given square. From then on it only wrote down its score every K moves,` meaning we can check to see if every $$ \text{move} > 18 \text{ ? } (\text{move} - 18) \text{ % } k : \text{move % } 3 $$ lands on a clue tile
- The only way to make the first three moves valid is by starting on a tower and moving to the 1 clue tile

In addition we can verify there is only a singular sequence of operations and $$ K $$ that land on all the clue tiles:

```
Ops: [+, +, /, +, +, +, *, /, +, +, +, *, +, +, /, +, +, +, +, +, *, +, +, /, +, +, +, +, +, *, /, +, *, /, +, +, +, +, +, +, +, +, +, +, +, +, +, +, +, +, +, +, +]
Scores: [0, 1, 3, 1, 5, 10, 16, 112, 14, 23, 33, 44, 528, 541, 555, 37, 53, 70, 88, 107, 127, 2667, 2689, 2712, 113, 138, 164, 191, 219, 248, 7440, 240, 272, 8976, 264, 299, 335, 372, 410, 449, 489, 530, 572, 615, 659, 704, 750, 797, 845, 894, 944, 995, 1047, 1100]
K: 7
```

You'll notice that the sequence does not in fact end with z-index of 1, so we'll have to brute force and try appending the following sequences to the end of the known operations to see which works

```
[*]
[+, *]
[+, +, *]
[+, +, +, *]
[+, +, +, *]
[+, +, +, +, *]
[+, +, +, +, +, *]
[+, +, +, +, +, +, *]
```

With that set the runtime of the brute force is lighting fast and yields the path depicted in the graphic above or more crudely as shown below.

![Hand drawn solution to knight move 7](/img/posts/pentupfrustration3_knightmove7.PNG)

Here's the Java code that produced the final result of $33609$

```java
package janestreet;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class pentupfrustration3_knightmoves7 {

    static int[][] regions = new int[][]{
        {  1,  1,  1,  1,  1,  2,  2,  2 },
        {  3,  3,  3,  4,  4,  5,  5,  2 },
        {  3,  6,  3,  4,  4,  4,  5,  2 },
        {  7,  6,  6,  8,  8,  9,  5,  5 },
        {  7,  7,  6,  8,  8,  9,  9, 10 },
        {  7, 11,  6, 12,  9,  9, 13, 10 },
        {  7, 11, 12, 12, 12, 13, 13, 10 },
        { 11, 11, 11, 12, 13, 13, 10, 10 }
    };

    static List<int[]> hasTower = List.of(
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1},
        new int[]{-1, -1}
    );

    static boolean[][] visited = new boolean[8][8];

    static int[][] scores = new int[][]{
        {-1,-1,-1,-1,-1,37,-1,1100},
        {-1,-1,-1,-1,-1,-1,-1,-1},
        {-1,-1,-1,23,-1,138,-1,-1,},
        {528,-1,-1,-1,-1,-1,-1,-1,},
        {-1,449,-1,-1,16,-1,-1,-1},
        {-1,750,-1,88,-1,272,1,-1},
        {-1,-1,-1,-1,-1,-1,-1,-1},
        {0,-1,-1,-1,-1,-1,-1,-1}
    };

    static int[][] addMoves = new int[][]{
        {2,1,0},
        {-2,1,0},
        {-2,-1,0},
        {2,-1,0},

        {1,2,0},
        {1,-2,0},
        {-1,-2,0},
        {-1,2,0}
    };
    static int[][] divideMoves = new int[][]{
        {2,0,-1},
        {-2,0,-1},
        {0,2,-1},
        {0,-2,-1}
    };
    static int[][] multiplyMoves = new int[][]{
        {2,0,1},
        {-2,0,1},
        {0,2,1},
        {0,-2,1}
    };

    static int maxDepth = 0;
    static int maxTowers = 0;

    public static int calculate_ops(Set<Integer> numbers, int z, int m, int score, int k, List<Integer> sol, List<Character> ops){
        if(numbers.isEmpty()) return k;
        boolean removed = false;
        if(z < 0 || z > 1) return -1;
        if((m > 19 && (m - 19) % k == 0) || (m <= 19 && (m - 1) % k == 0)){
            if(!numbers.contains(score)){
                return -1;
            }
            removed = true;
            numbers.remove(score);
        }

        if(m == 19 && k == 3){
            for(int i = 4; i < 10; i++){
                int res = calculate_ops(numbers, z, m, score, i, sol, ops);
                if(res != -1) return res;
            }
            return -1;
        }

        sol.add(score);
        ops.add('+');
        int staySame = calculate_ops(numbers, z, m + 1, score + m, k, sol, ops);
        if(staySame != -1) return staySame;
        ops.removeLast();

        if(score % m == 0) {
            ops.add('/');
            int goDown = calculate_ops(numbers, z - 1, m + 1, score / m, k, sol, ops);
            if(goDown != -1) return goDown;
            ops.removeLast();
        }

        ops.add('*');
        int goUp = calculate_ops(numbers, z + 1, m + 1, score * m, k , sol, ops);
        if(goUp != -1) return goUp;
        ops.removeLast();
        sol.removeLast();

        if(removed){
            numbers.add(score);
        }
        return -1;
    }

    public static void placeMoves(int cellDestination, int move, List<List<Character>> ops, List<Character> currOps, int i, List<int[]> cells, int k, int r, int c, int z, int score, int towers){
        if(i == currOps.size()){
            recurse(cellDestination + 1, move, ops, cells, k, r, c, z, score, towers);
            return;
        }
        boolean modulo = (move > 19 && (move - 18) % k == 0) || (move > 0 && move <= 19 && move % 3 == 0);
        
        // go up
        if(currOps.get(i) == '*'){
            for(int[] dir: multiplyMoves){
                int r1 = r + dir[0], c1 = c + dir[1], z1 = z + dir[2];
                if(outOfBounds(r1, c1) || visited[r1][c1]) continue;
                if(modulo && (r1 != cells.get(cellDestination + 1)[0] || c1 != cells.get(cellDestination + 1)[1])) continue;
                int[] tower = hasTower.get(regions[r1][c1]);
                int oldTower0 = tower[0];
                int oldTower1 = tower[1];
                if(!placeTower(r1, c1)) continue;

                visited[r1][c1] = true;
                int oldScore = scores[r1][c1];
                scores[r1][c1] = score * move ;

                placeMoves(cellDestination, move + 1, ops, currOps, i + 1, cells, k, r1, c1, z1, scores[r1][c1], towers + 1);

                visited[r1][c1] = false;
                scores[r1][c1] = oldScore;
                tower[0] = oldTower0; tower[1] = oldTower1;
            }
        }
        // go down
        else if (currOps.get(i) == '/'){

            for(int[] dir: divideMoves){
                int r1 = r + dir[0], c1 = c + dir[1], z1 = z + dir[2];;
                if(outOfBounds(r1, c1) || visited[r1][c1] || towerAt(r1, c1)) continue;
                if(modulo && (r1 != cells.get(cellDestination + 1)[0] || c1 != cells.get(cellDestination + 1)[1])) continue;

                visited[r1][c1] = true;
                int oldScore = scores[r1][c1];
                scores[r1][c1] = score / move;

                placeMoves(cellDestination, move + 1, ops, currOps, i + 1, cells, k, r1, c1, z1, scores[r1][c1], towers);

                visited[r1][c1] = false;
                scores[r1][c1] = oldScore;
            }
        } else {
            for(int[] dir: addMoves){
                int r1 = r + dir[0], c1 = c + dir[1], z1 = z + dir[2];;
                if(outOfBounds(r1, c1) || visited[r1][c1]) continue;
                if(modulo && (r1 != cells.get(cellDestination + 1)[0] || c1 != cells.get(cellDestination + 1)[1])) continue;
                
                int[] tower = hasTower.get(regions[r1][c1]);
                int oldTower0 = tower[0];
                int oldTower1 = tower[1];
                if(z1 == 1 && !placeTower(r1, c1)) continue;

                visited[r1][c1] = true;
                int oldScore = scores[r1][c1];
                scores[r1][c1] = score + move;

                placeMoves(cellDestination, move + 1, ops, currOps, i + 1, cells, k, r1, c1, z1, scores[r1][c1], towers + (z1 == 1 ? 1 : 0));

                visited[r1][c1] = false;
                scores[r1][c1] = oldScore;
                tower[0] = oldTower0; tower[1] = oldTower1;
            }
    
        }
    }

    public static void calculateAnswer(){
        int total = 0;
        for(int r = 0; r < scores.length; r++){
            for(int c = 0; c < scores[r].length; c++){
                if(scores[r][c] == -1){

                    int tmp = (outOfBounds(r - 1, c) || scores[r - 1][c] == -1 ? 0 : scores[r - 1][c]) + 
                        (outOfBounds(r + 1, c) || scores[r + 1][c] == -1 ? 0 : scores[r + 1][c]) + 
                        (outOfBounds(r, c + 1) || scores[r][c + 1] == -1 ? 0 : scores[r][c + 1]) + 
                        (outOfBounds(r, c - 1) || scores[r][c - 1] == -1 ? 0 : scores[r][c - 1]);

                    total += tmp;
                }
            }
        }
        System.out.println("Final answer: " + total);
    }

    public static void recurse(int cellDestination, int move, List<List<Character>> ops, List<int[]> cells, int k, int r, int c, int z, int score, int towers){
        if(move > maxDepth || towers > maxTowers){
            System.out.println("move: " + cellDestination + " " + cells.size());
            printBoard(r, c, 0, k, towers);
            maxDepth = Math.max(move, maxDepth);
            maxTowers = Math.max(towers, maxTowers);
        }

        if(cellDestination == cells.size() - 1) {
            // has to end on a tower, original first 53 moves end up at z = 0
            placeMoves(cellDestination, move, ops, List.of('*'), 0, cells, k, r, c, z, score, towers);
            placeMoves(cellDestination, move, ops, List.of('+', '*'), 0, cells, k, r, c, z, score, towers);
            placeMoves(cellDestination, move, ops, List.of('+',  '+',  '*'), 0, cells, k, r, c, z, score, towers);
            placeMoves(cellDestination, move, ops, List.of('+',  '+',  '+',  '*'), 0, cells, k, r, c, z, score, towers);
            placeMoves(cellDestination, move, ops, List.of('+',  '+',  '+',  '+',  '*'), 0, cells, k, r, c, z, score, towers);
            placeMoves(cellDestination, move, ops, List.of('+',  '+',  '+',  '+',  '+', '*'), 0, cells, k, r, c, z, score, towers);
            return;
        } else if (cellDestination >= cells.size()) {
            printBoard(r, c, 0, k, towers);
            calculateAnswer();
            System.exit(0);
        }

        placeMoves(cellDestination, move, ops, ops.get(cellDestination), 0, cells, k, r, c, z, score, towers);
    }

    public static void main(String[] args){

        Set<Integer> numbers = new HashSet<>();
        numbers.add(37);
        numbers.add(1100);
        numbers.add(23);
        numbers.add(138);
        numbers.add(528);
        numbers.add(449);
        numbers.add(16);
        numbers.add(750);
        numbers.add(88);
        numbers.add(272);
        numbers.add(1);
        numbers.add(0);
        int m = 1;
        List<Character> tmpOps = new ArrayList<>();
        List<List<Character>> ops = new ArrayList<>();
        List<Character> tmp = new ArrayList<>();
        List<Integer> sol = new ArrayList<>();
        int k = calculate_ops(numbers, 1, m, 0, 3, sol, tmpOps);

        System.out.println("Ops: " + tmpOps);
        System.out.println("Scores: " + sol);
        System.out.println("K: " + k);

        for(int i = 0; i < sol.size(); i++){
            tmp.add(tmpOps.get(i));
            if(i > 0 && i <= 18 && tmp.size() % 3 == 0){
                ops.add(new ArrayList<>(tmp));
                tmp.clear();
            } else if(i > 18 && tmp.size() % k == 0){
                ops.add(new ArrayList<>(tmp));
                tmp.clear();
            }
        }

        List<int[]> path = new ArrayList<>();
        for(int i = 0; i <= 18; i++){
            if(i % 3 == 0){
                outer: for(int r = 0; r < scores.length; r++){
                    for(int c = 0; c < scores[r].length; c++){
                        if(scores[r][c] == sol.get(i)){
                            path.add(new int[]{r, c});
                            break outer;
                        }
                    }
                }
            }
        }

        for(int i = 19; i < sol.size(); i++){
            if((i - 18) % k == 0){
                outer: for(int r = 0; r < scores.length; r++){
                    for(int c = 0; c < scores[r].length; c++){
                        if(scores[r][c] == sol.get(i)){
                            path.add(new int[]{r, c});
                            break outer;
                        }
                    }
                }
            }
        }
        
        for(int[] i: path){
            System.out.println(Arrays.toString(i));
        }
        
        visited[7][0] = true;
        hasTower.get(11)[0] = 7;
        hasTower.get(11)[1] = 0;
        recurse(0, 1, ops, path, k, path.get(0)[0], path.get(0)[1], 1, 0, 1);
    }

    private static boolean outOfBounds(int r, int c){
        return r < 0 || c < 0 || r >= 8 || c >= 8;
    }

    private static boolean towerAt(int r, int c){
        int[] tower = hasTower.get(regions[r][c]);
        return tower[0] == r && tower[1] == c;
    }

    private static boolean placeTower(int r, int c){
        if(towerAt(r,c)) return true;
        int[] tower = hasTower.get(regions[r][c]);
        if(tower[0] != -1) return false;
        tower[0] = r;
        tower[1] = c;
        return true;
    }

    private static void printBoard(int r, int c, int z, int k, int towers){
        System.out.println("====================  " + (maxDepth - 1) + "  ====================");
        System.out.println(r + " " + c + " " + z + " k: " + k + " towers: " + towers);
        for(int[] score: scores){
            System.out.println(Arrays.toString(score));
        }
        for(boolean[] v: visited){
            System.out.println(Arrays.toString(v));
        }
        for(int[] t: hasTower){
            System.out.println(Arrays.toString(t));
        }
    }
}
```
