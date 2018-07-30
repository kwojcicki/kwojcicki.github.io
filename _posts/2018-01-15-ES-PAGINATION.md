---
layout:     post
title:      "Elasticsearch Deep Pagination"
subtitle:   "When and how to do to deep pagination in Elasticsearch"
date:       2016-03-27 17:00:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [ Elasticsearch ]
---

# Intro

Almost every application has some sort of pagination mechanism. One of the most common is a simple list of numbers allowing you to quickly switch between pages.
![Google Pagination](/img/posts/google-pagination.png)

Another popular one is a prev/next pagination 
![Reddit Pagination](/img/posts/reddit-pagination.png)

Regardless of your method many developers dread the implementation and lets be honest who actually goes past the second page of a google search!

# Elasticsearch

Elasticsearch has a ton of great documentation and some of it (while a little outdated) explains the issue with [pagination in a distributed system](https://www.elastic.co/guide/en/elasticsearch/guide/current/pagination.html)
 
```
Deep Paging in Distributed Systems

To understand why deep paging is problematic, let's imagine that we are searching within a single index with five primary shards. When we request the first page of results (results 1 to 10), each shard produces its own top 10 results and returns them to the coordinating node, which then sorts all 50 results in order to select the overall top 10.

Now imagine that we ask for page 1,000-results 10,001 to 10,010. Everything works in the same way except that each shard has to produce its top 10,010 results. The coordinating node then sorts through all 50,050 results and discards 50,040 of them!

You can see that, in a distributed system, the cost of sorting results grows exponentially the deeper we page. There is a good reason that web search engines don't return more than 1,000 results for any query.
```

Basically the deeper a request pages into the data the more work the coordinating node and other nodes will have to do. While this may not cause problems locally in a dev build, once enough data is accrued the request can cause terrible consequences for ones Elasticsearch cluster

# Solutions

While Elasticsearch does have its limitations, these limitations are quite reasonable with possible solutions to satisfy most customers

### 1. Do not do it!

As simple as that, for the average user if the result they are looking for is not in the first few pages they will refine their search. So instead give the user as many tools for searching as possible to be able to filter the results down to what the user needs.

### 2. Change your Elasticsearch query

#### 2a. From / Size
A very basic form of pagination can be achieved using the [From/Size query parameters](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html). These allow you to specify offset from the first result you want to fetch and how many hits to be returned.
Warning there is a limit that ```from + size <= 10 000```, if that equality is broken the search will fail. 
This default can be overwritten by changing ```index.max_result_window```, THIS IS NOT RECOMMENDED as it could cause query time to explode.

#### 2b. Scroll Query
```
While a search request returns a single "page" of results, the scroll API can be used to retrieve large numbers of results (or even all results) from a single search request, in much the same way as you would use a cursor on a traditional database.
```


#### 2c. Search After parameter

While pagination can be done using from and size the query cost becomes too expensive when the deep pagination is reached. With the scroll api while efficient for deep pagination the scroll contexts are costly and are not recommended for real time use. So what is Elasticsearchs ultimate solution? A live cursor using the search_after parameter.

```
GET twitter/_search
{
    "size": 10,
    "query": {
        "match" : {
            "title" : "elasticsearch"
        }
    },
    "search_after": [1463538857, "654323"],
    "sort": [
        {"date": "asc"},
        {"_id": "desc"}
    ]
}
```

### 3. Aggregate

### 4. Limited Paging


