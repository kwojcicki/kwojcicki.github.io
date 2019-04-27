---
layout:     post
title:      "Signaling Intent"
subtitle:   "How signaling intent can make you a better programmer"
date:       2019-03-23 15:18:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [ Programming ]
---

# Chrome Extension Developer Cookbook

[Highlighter/Reminder Extension](https://chrome.google.com/webstore/detail/mangowaffles-highlighter/cnbhfnmefmgngepojipphalclebolhhh)

# Messaging 
## Sending message from content script 
```
 chrome.runtime.sendMessage({}, function(response) {
    if (response.data === undefined) {
      attempt++;
      setTimeout(function() {
        askForData();
      }, 10 * attempt);
    } else {
      loadHighlights(response.data);
      website = response.website;
      if (DEBUG) console.log("Setting website to: " + website);
      token = response.token;
      email = response.email;
    }
  });
```

## Sending message from background scirpt

```
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
});
```

## Listening for message from anywhere
```
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
});
```

```
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'foo': 'hello', 'bar': 'hi'}, function() {
      console.log('Settings saved');
    });

    // Read it using the storage API
    chrome.storage.sync.get(['foo', 'bar'], function(items) {
      message('Settings retrieved', items);
    });
```


# On install page

```
chrome.runtime.onInstalled.addListener(function(details) {
  // TODO: remove update
  if (details.reason === "install" || details.reason === "update") {
    chrome.tabs.create({ url: chrome.extension.getURL("index.html") });
  }

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: ".*" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
```

# 
```
// show the popup when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  if (DEBUG) console.log("showing popup");
  chrome.pageAction.show(tab.id);
});
```

# 
```
chrome.identity.getProfileUserInfo(function(info) {
  email = info.email;
});
```

#JQuery

#Context menu/right click menu
Script should look like this:

```
function getword(info,tab) {
  console.log("Word " + info.selectionText + " was clicked.");
  chrome.tabs.create({  
    url: "http://www.google.com/search?q=" + info.selectionText
  });
}
chrome.contextMenus.create({
  title: "Search: %s", 
  contexts:["selection"], 
  onclick: getword
});
```

And manifest.json:
```
{
    "name": "App name",
    "version": "1.0",
    "manifest_version": 2,
    "description": "Your description",
    "permissions": [
      "contextMenus"
     ],
    "background": { 
      "scripts": ["script.js"]
    }
}
```