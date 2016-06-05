(function (window) {

    // 由于是第三方库，我们使用严格模式，尽可能发现潜在问题
    'use strict';



    function Ggallery(id) {
        // 布局的枚举类型
        this.LAYOUT = {
            PUZZLE: 1,    // 拼图布局
            WATERFALL: 2, // 瀑布布局
            BARREL: 3,     // 木桶布局
            SQUARE: 4       //  正方形布局
        };
        this.containerSelector = id || "#ggalleryContainer";
        this.container = document.querySelector(this.containerSelector);
        this.picBox = "ggalleryBox";
        

    }

    // 私有变量可以写在这里
    var _options = {
        layout : '',
        puzzleHeight:'',
        coulumn : '',
        heightMin : '',
        gutter : '',
        squareSize:'',
        fullscreenState : '',
        image: [],
        imageUrl: [],
        imageNum: '',
        barrelBinAspectRationow : 0,
        barrelBinCheckedImg : []
    };

    /**
     * 创建全屏模式
     */
    var _createFullscreen = function () {
        if (event.target.getAttribute('src')) {
            var fullscreen = document.createElement("div"),
                img = document.createElement("img"),
                leftArrow = document.createElement("div"),
                rightArrow = document.createElement("div"),
                body = document.querySelector("body");
            fullscreen.id = "gGalleryFullscreen";
            leftArrow.id = "gGalleryLeftArrow";
            rightArrow.id = "gGalleryRightArrow";
            img.src = event.target.src;
            img.className = "bigPic";
            img.id = event.target.id;
            fullscreen.appendChild(img);
            fullscreen.appendChild(leftArrow);
            fullscreen.appendChild(rightArrow);
            body.appendChild(fullscreen);
            setTimeout(function () {
                var bigPic = document.querySelector(".bigPic");
                bigPic.style.transform = 'translate(-50%, -50%)';
            },10);
            fullscreen.onclick = function () {
                var fullscreen = document.querySelector("#gGalleryFullscreen"),
                    leftArrow = document.querySelector("#gGalleryLeftArrow"),
                    rightArrow = document.querySelector("#gGalleryRightArrow"),
                    bigPic = document.querySelector(".bigPic");
                if (event.target !== leftArrow && event.target !== rightArrow && event.target !== bigPic) {
                    bigPic.style.transform = 'translate(-50%, -50%) scale(0.01,0.01)';
                    setTimeout(function () {
                        fullscreen.remove();
                    },300);
                }
                
                if (event.target === leftArrow && bigPic.id !== "Pic1") {
                    var newidl ="Pic" + (bigPic.id.slice(3) - 1);
                    bigPic.remove();
                    var newbigPicl = new Image(),
                        newPicl = document.querySelector("#" + newidl);
                    newbigPicl.src = newPicl.src;
                    newbigPicl.className = "bigPic";
                    newbigPicl.id = newidl;
                    newbigPicl.style.transform = 'translate(-50%, -50%)';
                    fullscreen.appendChild(newbigPicl);
                }
                if (event.target === rightArrow && bigPic.id !== "Pic" + (_options.imageNum)) {
                    var newidr ="Pic" + (parseInt(bigPic.id.slice(3)) + 1);
                    bigPic.remove();
                    var newbigPicr = new Image(),
                        newPicr = document.querySelector("#" + newidr);
                    newbigPicr.src = newPicr.src;
                    newbigPicr.id = newidr;
                    newbigPicr.className = "bigPic";
                    newbigPicr.style.transform = 'translate(-50%, -50%)';
                    fullscreen.appendChild(newbigPicr);
                }
                
            };
        }
    };

    /**
     * 拼图模式图片数量为3和5时修正样式用
     * @param  {Array} picBox 
     * @param  {obj} parent 
     */
    var _puzzleStyleFix = function (picBox,parent) {
        var len = picBox.length;
        switch (len) {
            case 3 :
                picBox[1].style.width = picBox[1].offsetHeight +"px";
                picBox[2].style.width = picBox[2].offsetHeight +"px";
                picBox[0].style.width = parent.offsetWidth - picBox[1].offsetWidth + "px";
                break;
            case 5 :
                picBox[1].style.height = picBox[1].offsetWidth + "px";
                picBox[4].style.height = parent.offsetHeight - picBox[1].offsetHeight + "px";
                break;
            default :
                for (var i = 0; i < len; i++) {
                    picBox[i].style.height = "";
                    picBox[i].style.width = "";
                }
        }
    };
    
    /************* 以下是本库提供的公有方法 *************/

    /**
     * 初始化并设置相册
     * 当相册原本包含图片时，该方法会替换原有图片
     * @param {(string|string[])} image  一张图片的 URL 或多张图片 URL 组成的数组
     * @param {object}            option 配置项
     */
    Ggallery.prototype.setImage = function (image,opt) {
        if (typeof image === 'string') {
            // 包装成数组处理
            this.setImage([image]);
            return;
        }
        this.container.innerHTML = "";
        this.container.style.height = "";

        var _opt = opt || {};
        _options.layout = _opt.layout || 2;
        _options.fullscreenState = _opt.fullscreenState || true;
        _options.puzzleHeight = _opt.puzzleHeight || 800;
        _options.coulumn = _opt.coulumn || 4;
        _options.heightMin = _opt.heightMin || 300;
        _options.gutter = _opt.gutter || 0;
        _options.squareSize = _opt.squareSize || 25;
        _options.image = [];
        _options.imageUrl = [];
        _options.imageNum = 0;
        _options.barrelBinAspectRationow = 0;
        _options.barrelBinCheckedImg = [];
        
        this.setLayout(_options.layout);
        this.addImage(image,0);

        window.onresize = this.setImage.bind(this,_options.imageUrl,_options);
    };



    /**
     * 获取相册所有图像对应的 DOM 元素
     * 可以不是 ，而是更外层的元素
     * @return {HTMLElement[]} 相册所有图像对应的 DOM 元素组成的数组
     */
    Ggallery.prototype.getImageDomElements = function() {
        return document.querySelectorAll(".ggalleryBox");
    };

    /**
     * 向相册添加图片
     * 在拼图布局下，根据图片数量重新计算布局方式；其他布局下向尾部追加图片
     * @param {(string|string[])} image 一张图片的 URL 或多张图片 URL 组成的数组
     */
    Ggallery.prototype.addImage = function (image,i) {
        var img = new Image(),
        picBox = document.createElement("div");
        img.src = image[i];
        _options.imageUrl.push(image[i]);
        _options.imageNum ++;
        picBox.style.border = _options.gutter / 2 + "px solid transparent";
        picBox.className = this.picBox;
        img.id = "Pic" + _options.imageNum;
        img.className = "images";
        picBox.appendChild(img);
        _options.image.push(picBox);
        switch(_options.layout) {
            case 1 :
                if (_options.image.length > 6) {
                    throw "PUZZLE layout only can contain 6 photos";
                }
                this.container.appendChild(picBox);
                this.container.style.height = _options.puzzleHeight + "px";
                this.container.className = this.containerSelector.slice(1) + ' puzzle-' + _options.image.length;
                _puzzleStyleFix(_options.image,this.container);
                break;
            case 2 :
                var targetCoulumn = this.getMinWaterfallCoulumn();
                targetCoulumn[0].appendChild(picBox);
                break;
            case 3 :
                if (img.complete) {
                    this.initBarrelBin(img,picBox,i,image.length);
                }else{
                    img.addEventListener("load",this.initBarrelBin.bind(this,img,picBox,i,image.length));
                }              
                break;
            case 4 :
                picBox.style.width = _options.squareSize + "%";
                this.container.appendChild(picBox);
                picBox.style.height = picBox.offsetWidth + "px";
        }
        if (i < image.length - 1) {
            if (img.complete) {
                this.addImage(image,i + 1);
            }else{
                img.addEventListener("load",this.addImage.bind(this,image,i + 1));
            } 
        }
    };

    /**
     * 移除相册中的图片
     * @param  {(HTMLElement|HTMLElement[])} image 需要移除的图片
     * @return {boolean} 是否全部移除成功
     */
    Ggallery.prototype.removeImage = function (imageNum) {
        _options.imageUrl.splice(imageNum,1);
        this.setImage(_options.imageUrl,_options);
    };



    /**
     * 设置相册的布局
     * @param {number} layout 布局值，IfeAlbum.LAYOUT 中的值
     */
    Ggallery.prototype.setLayout = function (layout) {
        _options.layout = layout || 2;
        switch(_options.layout) {
            case 2 :
                this.container.className = this.containerSelector.slice(1) + ' waterfall';
                var len = _options.coulumn;
                for (var i = 0; i < len; i++) {
                    var coulumn = document.createElement("div");
                    coulumn.className = "ggalleryWaterfallColunms";
                    coulumn.id = "coulumn-" + (i + 1);
                    this.container.appendChild(coulumn);
                }
                break;
            case 3 :
                this.container.className = this.containerSelector.slice(1) + " barrel";
                break;
            case 4 :
                this.container.className = this.containerSelector.slice(1) + " square";      
        }
    };

    Ggallery.prototype.getStyle = function() {
        return _options;
    };

    /**
     * 获取相册的布局
     * @return {number} 布局枚举类型的值
     */
    Ggallery.prototype.getLayout = function() {
        return _options.layout;
    };

    /**
     * 设置图片之间的间距
     * 注意这个值仅代表图片间的间距，不应直接用于图片的 margin 属性，如左上角图的左边和上边应该紧贴相册的左边和上边
     * 相册本身的 padding 始终是 0，用户想修改相册外框的空白需要自己设置相框元素的 padding
     * @param {number}  x  图片之间的横向间距
     * @param {number} [y] 图片之间的纵向间距，如果是 undefined 则等同于 x
     */
    Ggallery.prototype.setGutter = function (x, y) {
        if (y === undefined) {
            y = x;
        }
        var picBox = this.getImageDomElements();
        for (var i = 0, len = picBox.length; i < len; i++) {
            picBox[i].style.borderWidth = y / 2 + "px " + x / 2 + "px";
        }
    };

    Ggallery.prototype.getGutter = function () {
        return _options.gutter;
    }



    /**
     * 允许点击图片时全屏浏览图片
     */
    Ggallery.prototype.enableFullscreen = function () {
        _options.fullscreenState = true;
        this.container.addEventListener('click', _createFullscreen, false);
    };



    /**
     * 禁止点击图片时全屏浏览图片
     */
    Ggallery.prototype.disableFullscreen = function () {
        _options.fullscreenState = false;
        this.container.removeEventListener('click', _createFullscreen, false);
    };



    /**
     * 获取点击图片时全屏浏览图片是否被允许
     * @return {boolean} 是否允许全屏浏览
     */
    Ggallery.prototype.isFullscreenEnabled = function () {
        return _options.fullscreenState;
    };

    /**
     * 获取瀑布布局下高度最小的一栏
     * @return {array} 按高度倒序排布的数组
     */
    Ggallery.prototype.getMinWaterfallCoulumn = function() {
        var colunms = document.querySelectorAll(".ggalleryWaterfallColunms"),
        colunmsArr = [];
        for (var i = 0; i < colunms.length; i++) {
            colunmsArr.push(colunms[i]);
        }
        var sortedColunms = colunmsArr.sort(function (a,b) {
            return a.offsetHeight - b.offsetHeight;
        });
        return sortedColunms;
    };


    /**
     * 获取木桶模式每行高度的下限
     * @return {number} 最少图片数（含）
     */
    Ggallery.prototype.getBarrelHeight = function () {
        return _options.heightMin;
    };

    /**
     * 构成木桶布局
     * @param  {obj} img    图片对象
     * @param  {obj} picBox 图片+外层DIV对象
     * @param  {int} picno  图片序号
     * @param  {int} piclen 图片总数
     */
    Ggallery.prototype.initBarrelBin = function(img,picBox,picno,piclen) {
        _options.barrelBinAspectRationow += ((img.width + 10) / img.height);
        var ar = this.container.offsetWidth / _options.heightMin;
        var image = "";
        var row = document.createElement("div");
        row.className = "ggalleryBarrelBinRows";
        row.style.width = "100%";
        if (_options.barrelBinAspectRationow < ar) {
            _options.barrelBinCheckedImg.push(picBox);  
        }else{
            _options.barrelBinCheckedImg.push(picBox);
            for (var i = 0,len = _options.barrelBinCheckedImg.length; i < len; i++) {
                    image = _options.barrelBinCheckedImg[i].children[0];
                    _options.barrelBinCheckedImg[i].style.width = ((image.width + 10) / image.height * (this.container.offsetWidth / _options.barrelBinAspectRationow)) + "px";
                    row.appendChild(_options.barrelBinCheckedImg[i]);
                }
            this.container.appendChild(row);
            row.style.height = (this.container.offsetWidth / _options.barrelBinAspectRationow) + "px";
            _options.barrelBinCheckedImg = [];
            _options.barrelBinAspectRationow = 0;
        }
        if (picno === piclen - 1) {
            for (var j = 0,lenj = _options.barrelBinCheckedImg.length; j < lenj; j++) {
                    image = _options.barrelBinCheckedImg[j].children[0];
                    _options.barrelBinCheckedImg[j].style.width = (image.width * _options.heightMin / image.height) + "px";
                    row.appendChild(_options.barrelBinCheckedImg[j]);
                    this.container.appendChild(row);
            }
        }
        var rows = document.querySelectorAll(".ggalleryBarrelBinRows");
        if (rows) {
            for (var k = 0; k < rows.length; k++) {
                if (rows[k].children.length === 0) {
                    this.container.removeChild(rows[k]);
                }
            }
        }
    };
    
    /************* 以上是本库提供的公有方法 *************/



    // 实例化
    if (typeof window.Ggallery === 'undefined') {
        // 只有当未初始化时才实例化
        window.Ggallery = function (id) {
            return new Ggallery(id);
        };
    }

}(window));