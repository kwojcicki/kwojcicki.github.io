---
layout: post
title: "I love Typescript"
subtitle: "Why Typescript is my goto for enterprise software"
date: 2026-02-13 09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

> Disclaimer: This is in the context of writing good ol CRUD apps, that don't require withstanding a solar storm or ns latency

- I can run `npm install`, open VSC and have auto complete, type hinting and go to implementation
- ESLint enables infinite guardrails for devs and LLMs
  - Prevent specific libraries/methods from being used
  - Stop error prone call patterns or structure
- Thriving ecosystem
- Easily monkey-patch or even edit libraries
  - Library has a bug or a doesn't support your exact use case? Add a post-install script that overrides some `.js` file or

```typescript
import * as theme from '@some/library/theme';

const originalCreateTheme = theme.createVictoryTheme;
theme.createVictoryTheme = (
  themeMode?: ThemeMode | undefined,
  baseTheme?: VictoryThemeDefinition,
): VictoryThemeDefinition => {
  const victoryTheme = originalCreateTheme(themeMode, baseTheme);
  victoryTheme.area.style.data.strokeWidth = 5;
  return victoryTheme;
};
```
- Can be used across the full-stack
- I don't have to endlessly `try/catch` or add `throws`
  - If an exception occurs, great a top level `try/catch` can return a 500 or let some other mechanism retry the input (SQS)
- `JSON.parse(...)` and `JSON.stringify`

```typescript
const body = JSON.stringify(...);
const response = await fetch('https://httpbin.org/post', {method: 'POST', body});
const data = await response.json();
```
- You can take a production bundle, edit it and redeploy it in seconds
- The standard library is structurally limited and concise
   - most programmers can read Typescript and understand it
   - At a granular enough level there is a single way to do things, and it's usually the right one.
   - I have two requests I want done in parallel? No deciding if I want to use a thread, virtual thread, thread pool, coroutine, executor, future, fiber...

```typescript
const req1 = DB.get(...);
const req2 = DB.get(...);

const results = await Promise.allSettled([req1, req2]);
```
- Single threaded execution model. Many head aches are avoided when you don't have two pieces of code executing against the same set of variables.
- Encourages functional and immutable structures with `as const`
- Branded types
  - No more relying on parameter names to know if a number is positive/negative or milliseconds/seconds/minutes

```typescript
type Seconds = number & { __brand: "seconds" }
type Minutes = number & { __brand: "minutes" }

const tenSeconds = 10 as Seconds;

const toMinutes = (seconds: Seconds): Minutes => (seconds / 60) as Minutes

// doesn't work
toMinutes(10);

// works
toMinutes(tenSeconds);
```
- Discriminated Union

```typescript
type Result = {
  id: number,
  started: Date,
} & (
  | { type: "success", data: string }
  | { type: "failure", reason: string }
)

const result: Result = ...

if(result.type === "success") console.log(result.data);
else console.error(result.reason);

```
- Minimal boilerplate
  - Easily create objects with additional fields, no builders or constructors

```typescript
const result = doSomething(input);
return { input, result }
```
- It's fast enough
