---
layout: post
title: "Fix Godot Tileset Pixel Blending"
subtitle: "Fixing tileset pixel blending and strange artifacts appearing"
date: 2019-05-23 13:15:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Tutorial]
---

# Intro

Godot users utilizing tilemap's may notice pixel bleeding or strange artifacts appearing on the screen. Such as the following:

![Example image](/img/posts/godot_bleeding.PNG)

This typically becomes an issue if there is any scaling of the screen or tiles.

# Solution

This problem is caused by Godot's default import parameter [filter setting](https://docs.godotengine.org/en/stable/getting_started/workflow/assets/importing_images.html#filter). The filter setting causes tiles to blend with one another when scaling is performed.

To disable filtering select your texture in the Filesystem panel

![Example image](/img/posts/godot_select.PNG)

Next switch to the import tab, disable filter and most importantly reimport (otherwise the changes wont take affect)

![Example image](/img/posts/godot_disable.PNG)

This process needs to be done for all resources, alteratively one can update the presets to have filtering disable by default

![Example image](/img/posts/godot_default.PNG)

Once reimported your viewport will rerender with the updated tilesets and all pixel bleeding/artifacts will be gone

![Example image](/img/posts/godot_bleeding_fixed.PNG)
