---
layout:     post
title:      "Idiomatic Go"
subtitle:   "Opinionated Idiomatic Go style guide"
date:       2018-05-21 17:00:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [ Dead ]
---

### WIP this is a living document and you can expect frequent changes to it.

[Github repo](https://github.com/kwojcicki/go-hello-skeleton) for example of these best practices

Personally I quite enjoy coding in Go. However, for my own projects I prefer Java/Python primarily due to sheer power of the built in functionality. I can go crazy with one liners using map, filter, reduce and lambdas everywhere. This however results in code that cannot be understood a few weeks after being written. As said in multiple quotes by multiple people, code is read more often than it is written. Crazy functions with syntax sugar every while fun to write and look impressive are the source of many frustrations. Solutions to the same problem in Java/Python will look vastly almost as if they were solving separate problems. While coding standards can be put into place they have to be upheld, updated and are a pain in the ass during code reviews. This in my mind is why Go is so successful for enterprise projects. It requires you to adhere to the built in style and limits the basic operators that can be used. This results in code that readable for you as well as your future coworkers.

With that being said Google's style guide is a great start, there are certain places which it could be improved or expanded upon. This page will take a look at my opinionated styleguide for Go.

In general, the preferred method or idiomatic way of writing Go is to keep it simple. 

## Errors and general logging

Firstly do properly logging no more ```fmt.Println()```, instead migrate over to a logging library like logrus.

Secondly error messages should start with a lowercase letter and should not end with a '.', the same applies to log messages.

## Mutex hat

## Package naming

Packages should have lower case names and be relatively short and self explanatory. 

Try to avoid using generic names such as helper/utils/package. 

## Package structure

In general it is quite easy to combine packages together, on the other hand splitting up packages can be quite combersome. 

Prefer many small packages each with their own responsibility (SRP).

## Testing

## Defer

While defer is super helpful and often times the most intuitive tool you have to solve a problem, in my experience it is also the cause of many difficult bugs to catch.

Proper usage of defer can be challenging and there are [many gotchas](https://blog.learngoprogramming.com/5-gotchas-of-defer-in-go-golang-part-ii-cc550f6ad9aa)

In addition for small performance gains consider removing defer when used for trivial cases such as the following:

```
func getCat(id int) (cat){
	mutex.Lock()
	defer mutex.Unlock()
	return cats[id]
} 
```

## Structure initialization

When initializing a structure use named structs, helps with code reviews and in general the codes readability

```
params := request.Params{
	URL: "http://google.com",
	Method: "Post",
	Headers: map[string]string{"Authentication": "a123abc"},
	Body: body,
}
```
