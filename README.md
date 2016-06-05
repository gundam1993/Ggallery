# Ggallery.js

一个使用原生JS编写的相册库

[Demo](http://gundam1993.github.io/Ggallery/demo/)

### 写在前面
个人的第一个类库，也算是学习前端以来的一个总结，用了很久才完成，但是依然感觉感觉写得很差，以后慢慢改进吧。

**注：IE和Edge测试暂时不支持拼图布局模式的两张布局模式。IE上还会有些其他小问题，FireFox暂时没有测试过，如果有使用FireFox的朋友看到的话欢迎反馈。**

## Usage 使用方法
1. 包含ggallery.min.css和ggallery.min.js
```html
<link rel="stylesheet" href="./css/ggallery.min.css" />
<script src="./js/ggallery.js"></script>
```
2. 定义一个div容器，并指定id。
```html
<div id="gallery"></div>
```
3. 使用div容器的id构造Album对象,注意输入的ID需要使用CSS选择器写法。
```javascript
var obj = new Ggallery("#gallery");
```
4. 调用初始化函数初始化类库，并传入初始化参数。
```javascript
obj.setImage("", {
    layout: 2,
    fullscreenState: true
});
```
* 第一个参数为一个字符串数组，传入一个或多个图片的地址。
* 第二个参数为一个对象，用于配置类库。

|配置项|说明|可选项|含义|默认值|
|:---:|:---:|:---:|:---:|:---:|
|layout|布局类型|1<br />2<br />3<br />4|拼图布局<br />瀑布布局<br />木桶布局<br />方块布局|2|
|fullscreenState|点击图片全屏|true<br />false<|启用全屏<br />禁止全屏|true|
|gutter|图片间距|number<br />&gt;0|间距(px)|0|
|puzzleHeight|拼图布局拼图区域高度|Number<br />&gt;0|高度(px)|800|
|coulumn|瀑布布局列数|Number<br />&gt;0<br />|瀑布布局列数|4|
|heightMin|木桶布局高度基数|Number<br />&gt;0|高度基数(px)|300|
|squareSize|方块布局图片尺寸|Number<br />&gt;0|方块布局图片尺寸(%)|25|

5. 调用```obj.addImage([]);```追加图片。
例如：
```javascript
//添加1张图片
obj.addImage(["./img/example.jpg"]);
//添加多张图片
obj.addImage(["./img/example1.jpg", "./img/example2.jpg"]);
```
## 关于图片顺序
***注：添加多张图片时，将会等待一张图片加载完后再加载下一张，显示的图片顺序与输入的数组中的顺序保持一致。***

