---
layout: post
title: "Could not open library 'libcurl.dll'"
subtitle: "Fixing Ruby/Jekyll installation to find module libcurl"
date: 2019-02-11 19:18:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Tutorial]
---

# Intro

As a user of github and github pages I am also a user of jekyll which is a static site generator written in Ruby.

As many others have seen setting up Ruby for the first time can be problematic, one of the most common errors seen is something of the following:

```
PS C:\Users\kwojc\git\kwojcicki.github.io> bundle exec jekyll server
Traceback (most recent call last):
        31: from C:/Ruby25-x64/bin/jekyll:23:in `<main>'
        30: from C:/Ruby25-x64/bin/jekyll:23:in `load'
        29: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/jekyll-3.7.4/exe/jekyll:11:in `<top (required)>'
        28: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/jekyll-3.7.4/lib/jekyll/plugin_manager.rb:51:in `require_from_bundler'
        27: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/bundler-2.0.1/lib/bundler.rb:114:in `require'
        26: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/bundler-2.0.1/lib/bundler/runtime.rb:65:in `require'
        25: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/bundler-2.0.1/lib/bundler/runtime.rb:65:in `each'
        24: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/bundler-2.0.1/lib/bundler/runtime.rb:76:in `block in require'
        23: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/bundler-2.0.1/lib/bundler/runtime.rb:76:in `each'
        22: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/bundler-2.0.1/lib/bundler/runtime.rb:81:in `block (2 levels) in require'
        21: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/bundler-2.0.1/lib/bundler/runtime.rb:81:in `require'
        20: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/html-proofer-3.10.2/lib/html-proofer.rb:9:in `<top (required)>'
        19: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/html-proofer-3.10.2/lib/html-proofer.rb:3:in `require_all'
        18: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/html-proofer-3.10.2/lib/html-proofer.rb:3:in `each'
        17: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/html-proofer-3.10.2/lib/html-proofer.rb:4:in `block in require_all'
        16: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/html-proofer-3.10.2/lib/html-proofer.rb:4:in `require'
        15: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/html-proofer-3.10.2/lib/html-proofer/url_validator.rb:1:in `<top (required)>'
        14: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/html-proofer-3.10.2/lib/html-proofer/url_validator.rb:1:in `require'
        13: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/typhoeus-1.3.1/lib/typhoeus.rb:2:in `<top (required)>'
        12: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/typhoeus-1.3.1/lib/typhoeus.rb:2:in `require'
        11: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon.rb:15:in `<top (required)>'
        10: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon.rb:15:in `require'
         9: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon/curl.rb:8:in `<top (required)>'
         8: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon/curl.rb:13:in `<module:Ethon>'
         7: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon/curl.rb:27:in `<module:Curl>'
         6: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon/curl.rb:27:in `require'
         5: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon/curls/settings.rb:1:in `<top (required)>'
         4: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon/curls/settings.rb:2:in `<module:Ethon>'
         3: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ethon-0.12.0/lib/ethon/curls/settings.rb:7:in `<module:Curl>'
         2: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ffi-1.10.0-x64-mingw32/lib/ffi/library.rb:99:in `ffi_lib'
         1: from C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ffi-1.10.0-x64-mingw32/lib/ffi/library.rb:99:in `map'
C:/Ruby25-x64/lib/ruby/gems/2.5.0/gems/ffi-1.10.0-x64-mingw32/lib/ffi/library.rb:145:in `block in ffi_lib': Could not op (LoadError)libcurl': The specified module could not be found.
.
Could not open library 'libcurl.dll': The specified module could not be found.
.
Could not open library 'libcurl.so.4': The specified module could not be found.
.
Could not open library 'libcurl.so.4.dll': The specified module could not be found.
```

# Fix

If you are using some linux flavor OS simply install libcurl/curl using your favorite package manager: apt, yum etc.

To fix this on a windows machine we will need to download a curl binary and ensure its in our Path environment variable.

- First visit https://curl.haxx.se/download.html or [click here](https://curl.haxx.se/download.html) and download the appropriate file for your operating system ensure that you correctly select 32 or 64 bit.
- Unzip the zipped folder anywhere
- Take the bin/libcurl.dll (\***\*note if you have a 64 bit system the dll may be called libcurl-x64.dll you must rename it to libcurl.dll\*\***) and place it into your ruby bin (for me it was C:\Ruby25-x64\bin)
- Ensure that your ruby bin is in your Path environment variable, heres a link that can help https://www.java.com/en/download/help/path.xml or [click here](https://www.java.com/en/download/help/path.xml)
- Restart your console/machine to ensure the Path variable update was applied and start up your local jekyll server
- Success! ![Jekyll started successfully](/img/posts/jekyll.png)
