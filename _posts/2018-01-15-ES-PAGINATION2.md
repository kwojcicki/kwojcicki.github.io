---
layout:     post
title:      "Elasticsearch Terms Query Limits"
subtitle:   "Exploring the limits of Elasticsearch Terms Query"
date:       2016-03-27 17:00:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [ Elasticsearch ]
---
# Intro

Almost every application has some sort of pagination mechanism. One of the most common is a simple list of numbers allowing you to quickly switch between pages.

Another popular one is a prev/next pagination 

Regardless of your method many developers dread the implementation and lets be honest who actually goes past the second page of a google search!

# Elasticsearch

Elasticsearch has a ton of great documentation and some of it (while a little outdated) explains the issue with [pagination in a distributed system](https://www.elastic.co/guide/en/elasticsearch/guide/current/pagination.html)
 
```
Deep Paging in Distributed Systems

To understand why deep paging is problematic, let’s imagine that we are searching within a single index with five primary shards. When we request the first page of results (results 1 to 10), each shard produces its own top 10 results and returns them to the coordinating node, which then sorts all 50 results in order to select the overall top 10.

Now imagine that we ask for page 1,000—results 10,001 to 10,010. Everything works in the same way except that each shard has to produce its top 10,010 results. The coordinating node then sorts through all 50,050 results and discards 50,040 of them!

You can see that, in a distributed system, the cost of sorting results grows exponentially the deeper we page. There is a good reason that web search engines don’t return more than 1,000 results for any query.
```

Basically the deeper a request pages into the data the more work the coordinating node and other nodes will have to do. While this may not cause problems locally in a dev build, once enough data is accrued the request can cause terrible consequences for ones Ela