---
layout: post
title: "Fix Godot Tileset Pixel Bleeding"
subtitle: "Fixing tileset pixel bleeding and visual artifacts in Godot"
date: 2019-05-24 10:46:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Tutorial]
---

# Intro

When using Godot's tilemaps you may notice visual artifacts such as pixel bleeding. The following is an example of pixel bleeding

![Example of pixel bleeding](/img/posts/godot_bleeding.PNG)

Pixel bleeding typically occurs when you scale either the screen or tiles.

# Solution

The cause for pixel bleeding is Godot's default import [filter setting](https://docs.godotengine.org/en/stable/getting_started/workflow/assets/importing_images.html#filter). The filter setting causes tiles to blend with one another when scaling is performed.

To disable filtering, select your texture in the FileSystem panel

![Example of selecting resource asset in FileSystem](/img/posts/godot_select.PNG)

Select the Import tab, disable Filter and most importantly, click Reimport (otherwise the changes won't take effect)

![Disabling filter in the import tab](/img/posts/godot_disable.PNG)

This process needs to be done for all resources. Alternatively, you can update the Presets to have filtering disabled by default

![Setting filter to be off by default](/img/posts/godot_default.PNG)

Once reimported, your viewport will re-render with the updated tilesets and the pixel bleeding will be resolved

![Example of the fixed image](/img/posts/godot_bleeding_fixed.PNG)
