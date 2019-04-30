---
layout:     post
title:      "Signaling Intent"
subtitle:   "How signaling intent can make you a better programmer"
date:       2019-02-27 17:17:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [ Programming ]
---

# Signaling Intent

As programmers we spend a large amount of time reading code be it during a code review, while debugging a problem or when looking for a new library/service.

The main aspects we focus on while reading code is: what the code does, how the code does works, how one can use this code and what the intent of the code is.

There are many ways to signal what a piece of code is intended to do. The most comment is documentation either, but as we all know documentation is often lacking or way out of date.
But documentation isn't the only way to show intent, while I believe code does require documentation much of documentation can be replaced with well written code.

Lets get straight into some examples: 



## 1. Language

The great thing about clean code is the reader doesn't have to be an expert on the domain to appreciate its beauty. The same concept applies to intent, by taking a little thought 

```
public static void yyy(Collection<?> x) {
	....
}
```

```
public static <T extends Iterable<? extends Serializable>> void xxx(T x){
	....		
}
``` 

```
...

fillInSettingsPageForm = (...) => {

	const inputField = await browser.element(locator.jsSettingsPageInputField);
	console.log(inputField)
	
	assert(await browser.getText(locator....))
	assert(await browser.getHTML(locator....))
	
	await browser.setValue(locator....)
	
}

...
```


```
tf.train.RMSPropOptimizer(learning_rate=0.02)

  def __init__(self,
               learning_rate,
               decay=0.9,
               momentum=0.0,
               epsilon=1e-10,
               use_locking=False,
               centered=False,
               name="RMSProp"):
               
```

