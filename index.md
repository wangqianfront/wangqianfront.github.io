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

### [About Me](http://wangqianfront.github.io/pages/about/index.html)


```javascript
  who = 一名本应该在写前端的但不知怎的一直在写后端的马脓 -> 
  @echo 'github: https://github.com/wangqianfront'
  @echo 'weibo: http://weibo.com/qain1989'
  @echo 'email: 407278091@qq.com'
  @echo 'ps: nodejs学习中。。。。。。' 
  @send()
```


#### 本站设计参考

1. [jekll中文](http://jekyllcn.com/)
2. [kramdown](http://kramdown.gettalong.org/quickref.html)
3. [github guides](https://guides.github.com/)


