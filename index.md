---
layout: page
title:  Tech Notes
header:  Cease to struggle and you cease to live.
tagline: Thomas Carlyle
---
{% include JB/setup %}

## 所有文章

<ul class="posts">
  {% for post in site.posts %}
    <li><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

## Popular repositories
<ol id="pages">
   <li><a href="https://github.com/wangqianfront/InkSmell-Framework" target="_blank">https://github.com/wangqianfront/InkSmell-Framework</a>     InkSmell-Framework</li>
</ol>

## To-Do

This theme is still unfinished. If you'd like to be added as a contributor, [please fork](http://github.com/plusjade/jekyll-bootstrap)!
We need to clean up the themes, make theme usage guides with theme-specific markup examples.


