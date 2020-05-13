---
layout: post
title: "Elasticsearch Terms Query Limits"
subtitle: "Exploring the limits of Elasticsearch Terms Query"
date: 2016-03-27 17:00:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Elasticsearch]
---

# Background

## Terms Query

[ES Terms Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html)

A terms query filters documents that have fields that match any of the provided terms. For example:

```
GET /_search
{
    "query": {
        "terms" : { "id" : ["id1", "id2", "id3"]}
    }
}
```

This query will return all documents that have a field "id" which have a value of "id1" or "id2" or "id3"

## Query Context

[ES Query Context](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html)

When you provide Elasticsearch a query it will not only filter out any documents that do not match the query, but assign each document a score which signifies how well the document matched the query, this score is added to the `_score` field of the returned documents.

Sometimes one does not care about how well a document matches the query instead all they care about is does this document match the query.

In that case one can use the filter context where no `_score` is calculated, resulting in quicker searches and better caching.

## Bool query

[ES Bool Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)

The bool query returns all documents that match the `must` clauses and documents which match more `should` clause's will have a bigger final `_score`

For example:

```
POST _search
{
  "query": {
    "bool" : {
      "must" : {
        "term" : { "name" : "Krystian" }
      },
      "must_not" : {
        "range" : {
          "age" : { "gte" : 10, "lte" : 20 }
        }
      },
      "should" : [
        { "term" : { "hobby" : "sitting" } },
        { "term" : { "hobby" : "sleeping" } }
      ],
      "minimum_should_match" : 1
    }
  }
}
```

This query will return all documents that have the field "name" equal to "Krystian" and !(20 >= age >= 10) and have sitting or sleeping as a hobby.

The minimum_should_match parameter means that at minimum for any documents returned at least 1 should clause should match.

[This SO question](https://stackoverflow.com/questions/48984706/default-value-of-minimum-should-match) takes a deep dive into how minimum_should_match works in different contexts and queries.

# Initial Problem

Back in 2017 the team I was working on received a Jira from the QA team about Tooltips being unable to load with 1k Events. Our UI had an event timeline where the user could hover over events and a http request was made to the backend to receive more information about the events. The backend would take the requested Event IDs and perform a query against an Elasticsearch v5.5 instance. In situations where a large amount of Event IDs were requested the backend would return _Interal Server Error 500_.

The query performed by the backend service looked essentially like this

```
{ "query": { "terms" : { "event_ids" : ["event1", "event2", .... , "event1029"]} } }
```

Which can be replicated in go code by doing

```
func TestExample1(t *testing.T) {
   client := setUpClient(t)
   ids := createIds()

   // creating query
   q := elastic.NewTermsQuery("EventID", stringToIntArray(ids)...)
   searchService := client.Search().Index("*").Query(q)

   _, err := searchService.Do(context.TODO())
   assert.Nil(t, err)
}

// dont need to really understand these helper methods, just for being able to run the code
func createIds() []string {
   ids := make([]string, 66000)
   i := 0
   for i < 66000 {
      ids[i] = fmt.Sprintf("id%d", i)
      i++
   }
   return ids
}

func setUpClient(t *testing.T) *elastic.Client {
   client, err := elastic.NewSimpleClient(elastic.SetURL("http://localhost:9200"),
      elastic.SetTraceLog(log.New(os.Stderr, "ELASTIC ", log.LstdFlags)))
   if err != nil {
      t.Fatal("Cant connect to ES")
   }
   return client
}

func stringToIntArray(val []string) []interface{} {
   ret := make([]interface{}, 0)
   for _, item := range val {
      ret = append(ret, item)
   }
   return ret
}
```

When this is run against ES 5.5 the query will return an error saying

```
ELASTIC 2018/07/05 14:53:23 HTTP/1.1 400 Bad Request
Transfer-Encoding: chunked
Content-Type: application/json; charset=UTF-8

8000
{"error":{"root_cause":[{"type":"too_many_clauses","reason":"too_many_clauses: maxClauseCount is set to 1024"}],"type":"search_phase_execution_exception","reason":"all shards failed","phase":"query","grouped":true,"failed_shards":[{"shard":0,"index":"events-2017.02.31","node":"cbJd_LkQTayn3p6DycegVQ","reason":{"type":"query_shard_exception","reason":"failed to create query: {\n \"terms\" : {\n \"EventID\" : [\n \"id9\",\n \"`
```

The error returned indicates that there are too many clauses in the query.

Clauses come from a [bool query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html), so my guess is that ES turns the terms query into a bunch of should clauses in a bool query with 1 should clause per 1 term which causes 1024+ should clauses, which then results in this error code (this is my only my speculation no proof to back it up, [this](https://github.com/elastic/elasticsearch/pull/27968/commits/92849ba2067493786398da60807b3a4a7587f39d#r158552400) does seem to hint at a relation between terms query and bool query but that is only guessing).

It seems others also had an [issue](https://github.com/elastic/elasticsearch/issues/28980#issuecomment-386651557) with the terms filter using ES 5.6 .

# Initial Solution

To fix the issue a simple trick was added to turn the terms query into a bool query with multiple terms queries inside such as this

```
func TestExample2(t *testing.T) {

   client := setUpClient(t)
   ids := createIds()

   q := elastic.NewBoolQuery()
   // ensure each document returned matches atleast one of the should clauses
   q = q.MinimumNumberShouldMatch(1)
   i := 0
   // maximum of 1024 terms per query need to split up the terms across multiple
   // should queries
   for i < len(ids) {
      // if more than 1024 terms remaining then put in the next 1024 terms and iterate again
      // if less than 1024 terms remaining then put the remaining terms in
      if len(ids)-(i+1024) < 0 {
         q = q.Should(elastic.NewTermsQuery("EventID", stringToInterfaceArray(ids[i:])...))
         i += len(ids)
      } else {
         q = q.Should(elastic.NewTermsQuery("EventID", stringToInterfaceArray(ids[i:i+1024])...))
         i += 1024
      }
   }
   searchService := client.Search().Index("*").Query(q)

   _, err := searchService.Do(context.TODO())
   assert.Nil(t, err)
}
```

Resulting in this query:

```
{
  "query": {
    "bool" : {
      "should" : [
        { "terms" : { "EventID" : [ "id0", "id1", ... "id1023" ] } },
        { "terms" : { "EventID" : [ "id1024", "id1025", ... "id2047" ] } },
        ...
       ],
    "minimum_should_match" : 1
    }
  }
}
```

This would split up the terms across multiple should queries and ensure that atleast 1 should clause matched the documents that were returned. This bumped up the
possible events to be search to 1024 _ 1024 (1024 clauses per bool query _ 1024 terms per terms query) = 1048576. There might be potential to nest bool queries inside of bool queries
but that was left untested and as an exercise to the reader (wink)

# Rediscovery

With more ES features being added to our product this issue of max terms came up in conversation again.

When retested it was found that any amount of terms could in fact be used even 999 999 terms without any warning just a slow query response time. By then however our product had already upversioned ES from 5.5 to 6.3.

As mentioned by the ES team in this [issue](https://github.com/elastic/elasticsearch/issues/28980#issuecomment-386651557) they are not quite sure why a terms query could not have 1k+ terms in ES 5.5 but by ES 6.0 they know it got magically fixed.

This can be verified by running the first example against ES 6.0 and seeing that it returns no errors. However with [ES 6.2](https://www.elastic.co/guide/en/elasticsearch/reference/current/release-notes-6.2.0.html) a small feature was introduced

```
"Introduce limit to the number of terms in Terms Query #27968 (issue: #18829)".
```

With this update ES introduced an actual limit to the # of terms that can be allowed. The limit is 2^16 == 65536.

This limit was not actually enforced in [ES 6.2](https://github.com/elastic/elasticsearch/commit/edb922435fc567a1ba87ad09fcde9257dedc1999#diff-1391ee50bb2cf8de56a2408044a4638cR426) and instead will show a deprecated error in the logs but the query will run okay.

```
[2018-07-10T16:38:17,005][WARN ][o.e.d.i.q.TermsQueryBuilder] Deprecated: the number of terms [66000] used in the Terms Query request has exceeded the allowed maximum of [65536]. This maximum can be set by changing the [index.max_terms_count] index level setting.
```

this explains why we were able to run a terms query with 999 999 terms. If one runs the first example against a ES 6.2 one can see there is no error and the query returns as expected.

But with [ES 7.0](https://github.com/elastic/elasticsearch/pull/27968/files#diff-1391ee50bb2cf8de56a2408044a4638cR422) this limit will be enforced and will cause any query to fail if > 65536 terms and return error 400.

# Solution

The previous hack while it worked, it is un-ideal, what should be done is the should terms can go in the filter context of the bool query and the limit can be bumped up to 65536

```
func TestGoodSolution(t *testing.T) {

   // new limit to 65536 term's per terms query
   maxTerms := 65536

   client := setUpClient(t)
   ids := createIds()

   q := elastic.NewBoolQuery()
   // ensure each document returned matches atleast one of the should clauses
   q = q.MinimumNumberShouldMatch(1)
   i := 0
   // maximum of 65536 terms per query need to split up the terms across multiple
   // should queries
   for i < len(ids) {
      // if more than 65536 terms remaining then put in the next 65536 terms and iterate again
      // if less than 65536 terms remaining then put the remaining terms in
      if len(ids)-(i+maxTerms) < 0 {
         q = q.Should(elastic.NewTermsQuery("EventID", stringToInterfaceArray(ids[i:])...))
         i += len(ids)
      } else {
         q = q.Should(elastic.NewTermsQuery("EventID", stringToInterfaceArray(ids[i:i+maxTerms])...))
         i += maxTerms
      }
   }

   // putting the should clauses into the filter
   searchService := client.Search().Index("*").Query(elastic.NewBoolQuery().Filter(q))

   _, err := searchService.Do(context.TODO())
   assert.Nil(t, err)
}
```
