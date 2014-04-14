---
layout: post
category : Front-End
title:  前端知识手册
header: 前端
tagline:
tags : [前端,learning]
---
{% include JB/setup %}

这是一个自用前端知识清单，整理的流程如下：收集->汇总->修改。

基本概念
======

   * Viewport: 展现网页的媒体，比如窗口或者某个区域，它的大小是有限制的，为了不被平台术语所束缚，我们给他起名viewport，中文意思就是视口，此处可脑补“凿壁偷光”的场景。
   * Canvas: 而我们在渲染网页的时候通常并不知道我们需要多大的空间，而且这些空间通常尺寸会超过viewport的大小，于是实际上我们需要设想一个无限大的画布来绘制我们的元素，我们把它称为canvas。
   * Box: element（元素）和node(节点)是大家很熟悉的概念，当我们做布局计算的时候，通常会把节点变成box，一个节点可能产生多个box，伪元素也会产生box。
   * Render tree: 对应于dom树，我们把box的包含关系构成的属性结构成为渲染树render tree

盒模型
=====

HTML -> Element
CSS -> Box

在CSS中，布局的基本单位是盒，盒总是矩形的。元素与盒并非一一对应的关系，一个元素可能生成多个盒，CSS规则中的伪元素也可能生成盒，display属性为none的元素则不生成盒。除了元素之外，HTML中的文本节点也可能会生成盒。

决定了如何渲染，一是计算尺寸(宽/高)，二是如何定位。内容区域、内边距(padding)、边框(border)、外边距(margin)

CSS定位机制
==========

* 常规流(Normal Flow): static position relative position
* 浮动(Float)
* 绝对定位(Absolute Position): absolute position fixed position

1）普通流：
正常流是页面，大部分盒排布于正常流中。正常流中的盒必定位于某一格式化上下文中，正常流中有两种格式化上下文：块级格式化上下文（block formatting context，简称BFC）和行内格式化上下文（inline formatting context,IFC）。

在块级格式化上下文中，盒呈纵向排布，在行内格式化上下文中，盒则呈横向排布。正常流根容器中是块级格式化上下文，不同的盒可能会在内部产生行内格式化上下文或者块级格式化上下文。

2）浮动：浮动的框可以左右移动，直至它的外边缘遇到包含框或者另一个浮动框的边缘。浮动框不属于文档中的普通流，当一个元素浮动之后，不会影响到块级框的布局而只会影响内联框（通常是文本）的排列，文档中的普通流就会表现得和浮动框不存在一样，当浮动框高度超出包含框的时候，也就会出现包含框不会自动伸高来闭合浮动元素（“高度塌陷”现象）。顾名思义，就是漂浮于普通流之上，但是只能左右浮动。
正是因为浮动的这种特性，导致本属于普通流中的元素浮动之后，包含框内部由于不存在其他普通流元素了，也就表现出高度为0（高度塌陷）。在实际布局中，往往这并不是我们所希望的，所以需要闭合浮动元素，使其包含框表现出正常的高度。

绝对定位就不多说了，不在本文讨论范围之内，下回分解。

CSS3新布局方案

新的布局标准可以更简单更灵活的实现布局。CSS3目前有5种布局方案：

 1. 多栏布局(Multi-Column Layout )
 2. 灵活盒布局(Flexible Box Layout)
 3. 栅格布局(Grid Layout)
 4. CSS3的浮动盒(CSS3 Floating Boxes)
 5. Regions
	
Block Formatting Context
========================

Block Formatting Context，简称BFC，中文直译“块级格式化上下文”。简单地说，BFC就是像例子里面一样顺次竖着排块级盒的一种上下文，竖着排盒子而已。在一个BFC中，box是垂直布局的。在一个IFC中，box是水平布局的。

创建了 BFC的元素就是一个独立的盒子，里面的子元素不会在布局上影响外面的元素，反之亦然，同时BFC任然属于文档中的普通流。

canvas会设立一个BFC，这也是最外层的formatting context了，问题的复杂性在于有些块级盒内部也可以产生BFC（至少它必须也能包含块级盒），于是说BFC是可以嵌套滴：

http://alistapart.com/article/css-floats-101
lifesinger/lifesinger.github.com#159
http://www.cnblogs.com/winter-cn/archive/2013/05/11/3072929.html

hasLayout
=========

IE6/7没有BFC的概念。IE6/7的hasLayout与BFC类似。通常用zoom:1触发。

触发

   * display: inline-block
   * height: 除auto外任何值
   * float: left right
   * position: absolute
   * width: 除auto外任何值
   * writing-mode: tb-rl
   * zoom: 除normal外任何值

常见属性
=======

	position:
	static
	relative
	absolute
	fixed
	
	overflow:
	hidden
	visible
	auto
	scroll

CSS Hack
========

区别属性：

	IE6       | _property:value
	--------- | -------------
	IE6/7     |	*property:value
	IE6/7/8/9 |	property:value\9

区别规则：

	IE6   			| 	* html selector { ... }
	--------------- | -------------
	IE7             | 	*:first-child+html selector { ... }
	非IE6          	|	html>body selector { ... }
	firefox only    |	@-moz-document url-prefix() { ... }
	saf3+/chrome1+  |	@media all and (-webkit-min-device-pixel-ratio:0) { ... }
	opera only 		|   @media all and (-webkit-min-device-pixel-ratio:10000),not all and (-webkit-min-device-pixel-ratio:0) { ... }
	iPhone/mobile webkit |	@media screen and (max-device-width: 480px) { ... } 
