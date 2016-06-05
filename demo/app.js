var img2 = ["img/1.png","img/10.png","img/3.png","img/4.png","img/6.png","img/8.png","img/2.png","img/7.png"],
    imgs = ["img/5.png","img/8.png","img/6.png","img/10.png","img/13.png","img/1.png"];
var style = {
    layout : 2,
    gutter : 10,
    squareSize : 20
};
var controler = document.querySelector("#controler"),
    layout = document.querySelector("#layout"),
    layoutControler = document.querySelector("#layoutControler"),
    puzzle = document.querySelector("#layout1"),
    puzzleHeightBlock = document.querySelector("#puzzleHeightBlock"),
    coulumnBlock = document.querySelector("#coulumnBlock"),
    barrelHeightBlock = document.querySelector("#barrelHeightBlock"),
    squareSizeBlock = document.querySelector("#squareSizeBlock"),
    waterfall = document.querySelector("#layout2"),
    barrel = document.querySelector("#layout3"),
    square = document.querySelector("#layout4"),
    fullscreen = document.querySelector("#fullscreen"),
    fullscreenTrue = document.querySelector("#fullscreenTrue"),
    fullscreenFalse = document.querySelector("#fullscreenFalse"),
    gutter = document.querySelector("#gutter"),
    gutterSetter = document.querySelector("#gutterSetter"),
    coulumn = document.querySelector("#coulumn"),
    coulumnSetter = document.querySelector("#coulumnSetter"),
    puzzleHeight = document.querySelector("#puzzleHeight"),
    puzzleHeightSetter = document.querySelector("#puzzleHeightSetter"),
    barrelHeight = document.querySelector("#barrelHeight"),
    barrelHeightSetter = document.querySelector("#barrelHeightSetter"),
    squareSize = document.querySelector("#squareSize"),
    squareSizeSetter = document.querySelector("#squareSizeSetter"),
    addImage = document.querySelector("#addImage"),
    removeImage = document.querySelector("#removeImage");

var a = new Ggallery("#ggalleryContainer");
a.setImage(imgs,style);
a.enableFullscreen();

setting.onclick = function () {
    var style = a.getStyle();
    if (controler.className === "hidden") {
        layout.innerHTML = "Layout:" + a.getLayout();
        fullscreen.innerHTML = "Fullscreen:" + a.isFullscreenEnabled();
        gutter.innerHTML = "Gutter:" + a.getGutter() + "px";
        coulumn.innerHTML = "Coulumn:" + style.coulumn;
        puzzleHeight.innerHTML = "Puzzle Hright:" + style.puzzleHeight + "px";
        barrelHeight.innerHTML = "Barrel Height:" + style.heightMin + "px";
        squareSize.innerHTML = "Square Size:" + style.squareSize +"%";
        controler.className = "";
        controler.style.transform = "translate(0,0)";
    }else{
        controler.className = "hidden";
        controler.style.transform = "translate(0,-100%)";
    }
};

function layoutChange (num,target) {
    style.layout = num;
    a.setImage(imgs,style);
    layout.innerHTML = "Layout:" + a.getLayout();
    var choose = layoutControler.querySelector(".choose");
    choose.className = "stylesControler";
    target.className = "stylesControler choose";
}


document.onclick = function () {
    switch (event.target) {
        case addImage :
            var img = [],
                num = Math.floor(8 * Math.random());
                console.log(num);
            img.push(img2[num]);
            a.addImage(img,0);
                imgs.push(img[0]);
            break;
        case removeImage :
            a.removeImage(0);
            break;
        case puzzle :
            layoutChange(1,puzzle);
            puzzleHeight.className = "";
            puzzleHeightBlock.className = "";
            coulumnBlock.className = "hidden";
            barrelHeightBlock.className = "hidden";
            squareSizeBlock.className = "hidden";
            break;
        case waterfall :
            layoutChange(2,waterfall);
            puzzleHeightBlock.className = "hidden";
            coulumnBlock.className = "";
            barrelHeightBlock.className = "hidden";
            squareSizeBlock.className = "hidden";
            break;
        case barrel :
            layoutChange(3,barrel);
            puzzleHeightBlock.className = "hidden";
            coulumnBlock.className = "hidden";
            barrelHeightBlock.className = "";
            squareSizeBlock.className = "hidden";
            break;
        case square :
            layoutChange(4,square);
            puzzleHeightBlock.className = "hidden";
            coulumnBlock.className = "hidden";
            barrelHeightBlock.className = "hidden";
            squareSizeBlock.className = "";
            break;
        case fullscreenTrue :
            a.enableFullscreen();
            fullscreenTrue.className = "stylesControler choose";
            fullscreenFalse.className = "stylesControler";
            fullscreen.innerHTML = "Fullscreen:" + a.isFullscreenEnabled();
            break;
        case fullscreenFalse :
            a.disableFullscreen();
            fullscreenFalse.className = "stylesControler choose";
            fullscreenTrue.className = "stylesControler";
            fullscreen.innerHTML = "Fullscreen:" + a.isFullscreenEnabled();
            break;
    }
};

gutterSetter.onchange = function () {
    style.gutter = gutterSetter.value;
    a.setGutter(gutterSetter.value);
    gutter.innerHTML = "Gutter:" + gutterSetter.value + "px";
};

coulumnSetter.onchange = function () {
    style.coulumn = coulumnSetter.value;
    a.setImage(imgs,style);
    coulumn.innerHTML = "Coulumn:" + style.coulumn;
};

puzzleHeightSetter.onchange = function () {
    style.puzzleHeight = puzzleHeightSetter.value;
    a.setImage(imgs,style);
    puzzleHeight.innerHTML = "Puzzle Hright:" + style.puzzleHeight + "px";
};

barrelHeightSetter.onchange = function () {
    style.heightMin = barrelHeightSetter.value;
    a.setImage(imgs,style);
    barrelHeight.innerHTML = "Barrel Height:" + style.heightMin + "px";
};

squareSizeSetter.onchange = function () {
    style.squareSize = squareSizeSetter.value;
    a.setImage(imgs,style);
    squareSize.innerHTML = "Square Size:" + style.squareSize +"%";
};