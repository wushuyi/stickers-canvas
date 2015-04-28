var URL = window.URL || window.webkitURL;

var $el = {};
var pixiCache = {};
var dataCache = {};
var cache = {};
$el.win = $(window);
$el.wrapper = $('.wrapper');
$el.main = $('#main');
$el.fileBtn = $('#file-btn');
$el.fileInput = $('#file-input');
var stats;

dataCache.viewSize = {
    width: 640,
    height: 960
};

$el.wrapper.on('touchmove', function (e) {
    e.preventDefault();
});

pixiCache.renderer = new PIXI.autoDetectRenderer(
    dataCache.viewSize.width,
    dataCache.viewSize.height, {
        view: $el.main.get(0),
        transparent: true
    });

pixiCache.stage = new PIXI.Container();
pixiCache.page1 = new PIXI.Container();
pixiCache.page2 = new PIXI.Container();
pixiCache.page3 = new PIXI.Container();

pixiCache.graphics1 = new PIXI.Graphics();
pixiCache.graphics2 = new PIXI.Graphics();
pixiCache.graphics3 = new PIXI.Graphics();



var pattern1 = Trianglify({
    height: dataCache.viewSize.height,
    width: dataCache.viewSize.width,
    variance: "0.7",
    cell_size: 70,
    seed: '01vby',
    x_colors: 'Spectral'
});
var texture1 = new PIXI.Texture.fromCanvas(pattern1.canvas());
var sprite1 =  new PIXI.Sprite(texture1);
var textureBtnNormal = new PIXI.Texture.fromImage('./assets/images/button1_normal.png');
var textureBtnActive = new PIXI.Texture.fromImage('./assets/images/button1_active.png');
var spriteBtnNormal =  new PIXI.Sprite(textureBtnNormal);

spriteBtnNormal.position.set(dataCache.viewSize.width / 2, dataCache.viewSize.height - 100);
spriteBtnNormal.anchor.set(0.5);
spriteBtnNormal.scale.set(1.4);
spriteBtnNormal.interactive = true;
var spriteBtnNormalClickTime;
var spriteBtnNormalClick = function(){
    if(spriteBtnNormalClickTime){
        clearTimeout(spriteBtnNormalClickTime);
    }
    spriteBtnNormal.texture = textureBtnActive;
    spriteBtnNormalClickTime = setTimeout(function(){
        spriteBtnNormal.texture = textureBtnNormal;
    }, 600);
};
$el.fileBtn
    .on('click', spriteBtnNormalClick)
    .on('tap',spriteBtnNormalClick);

$el.fileInput.on('change', function(e){
    var file = e.target.files[0];
    var objUrl = URL.createObjectURL(file);
    loadImage(
        objUrl,
        function (canvas) {
            if(canvas.type === "error") {
                console.log("Error loading image " + objUrl);
            } else {
                var texture = new PIXI.Texture.fromCanvas(canvas);
                var sprite = new PIXI.Sprite(texture);
                window.test = sprite;
                pixiCache.page1.addChild(sprite);
            }
        },
        {
            maxWidth: 640,
            maxHeight: 640,
            minWidth: 50,
            minHeight: 50,
            canvas: true
        }
    );
});

pixiCache.page1.addChild(sprite1);
pixiCache.page1.addChild(spriteBtnNormal);

var pattern2 = Trianglify({
    height: dataCache.viewSize.height,
    width: dataCache.viewSize.width,
    variance: "0.7",
    cell_size: 70,
    seed: 'yub0v',
    x_colors: 'YlGnBu'
});
var texture2 = new PIXI.Texture.fromCanvas(pattern2.canvas());
var sprite2 =  new PIXI.Sprite(texture2);

pixiCache.page2.addChild(sprite2);

var pattern3 = Trianglify({
    height: dataCache.viewSize.height,
    width: dataCache.viewSize.width,
    variance: "0.7",
    cell_size: 70,
    seed: 'yub0v',
    x_colors: 'PRGn'
});
var texture3 = new PIXI.Texture.fromCanvas(pattern3.canvas());
var sprite3 =  new PIXI.Sprite(texture3);

pixiCache.page3.addChild(sprite3);

pixiCache.page2.position.x = -dataCache.viewSize.width;
pixiCache.page3.position.x = -dataCache.viewSize.width;
pixiCache.stage.addChild(pixiCache.page3);
pixiCache.stage.addChild(pixiCache.page2);
pixiCache.stage.addChild(pixiCache.page1);

var animate = function animateFn(time) {
    TWEEN.update();
    requestAnimationFrame(animate);
    pixiCache.renderer.render(pixiCache.stage);
    stats.update();
};
cache.pageLock = false;
var zoomOutRight = function (page, runTime) {
    var animationTime = runTime;
    var run0 = {
        alpha: 1,
        scale: 1,
        positionX: 0
    };
    var run40 = {
        alpha: 1,
        scale: 0.475,
        positionX: -42
    };
    var run100 = {
        alpha: 0,
        scale: 0.1,
        positionX: 2000
    };
    var tween40, tween100;
    var update = function () {
        page.alpha = run0.alpha;
        page.scale.x = run0.scale;
        page.scale.y = run0.scale;
        page.position.x = (1 - run0.scale) * page.width + run0.positionX;
        page.position.y = (1 - run0.scale) * page.height;
    };
    cache.lock = true;
    tween40 = new TWEEN.Tween(run0)
        .to(run40, animationTime * 0.4)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(update);
    tween100 = new TWEEN.Tween(run0)
        .to(run100, animationTime * 0.6)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(update);
    tween40.chain(tween100);
    tween40.start();
};
var zoomOutLeft = function (page, runTime) {
    var animationTime = runTime;
    var run0 = {
        alpha: 1,
        scale: 1,
        positionX: 0
    };
    var run40 = {
        alpha: 1,
        scale: 0.475,
        positionX: 42
    };
    var run100 = {
        alpha: 0,
        scale: 0.1,
        positionX: -2000
    };
    var tween40, tween100;
    var update = function () {
        page.alpha = run0.alpha;
        page.scale.x = run0.scale;
        page.scale.y = run0.scale;
        page.position.x = (1 - run0.scale) * page.width + run0.positionX;
        page.position.y = (1 - run0.scale) * page.height;
    };
    cache.lock = true;
    tween40 = new TWEEN.Tween(run0)
        .to(run40, animationTime * 0.4)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(update);
    tween100 = new TWEEN.Tween(run0)
        .to(run100, animationTime * 0.6)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(update);
    tween40.chain(tween100);
    tween40.start();
};
var zoomInRight = function (page, runTime) {
    var animationTime = runTime;
    var run100 = {
        alpha: 1,
        scale: 1,
        positionX: 0
    };
    var run60 = {
        alpha: 1,
        scale: 0.475,
        positionX: -10
    };
    var run0 = {
        alpha: 0,
        scale: 0.1,
        positionX: 1000
    };
    var tween40, tween100;
    var update = function () {
        page.alpha = run0.alpha;
        page.scale.x = run0.scale;
        page.scale.y = run0.scale;
        page.position.x = (1 - run0.scale) * page.width + run0.positionX;
        page.position.y = (1 - run0.scale) * page.height;
    };
    cache.lock = true;
    tween40 = new TWEEN.Tween(run0)
        .to(run60, animationTime * 0.6)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(update)
        .onStart(function(){
            cache.pageLock = true;
        });
    tween100 = new TWEEN.Tween(run0)
        .to(run100, animationTime * 0.4)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(update)
        .onComplete(function(){
            cache.pageLock = false;
        });
    tween40.chain(tween100);
    tween40.start();
};
var zoomInLeft = function (page, runTime) {
    var animationTime = runTime;
    var run100 = {
        alpha: 1,
        scale: 1,
        positionX: 0
    };
    var run60 = {
        alpha: 1,
        scale: 0.475,
        positionX: 10
    };
    var run0 = {
        alpha: 0,
        scale: 0.1,
        positionX: -1000
    };
    var tween60, tween100;
    var update = function () {
        page.alpha = run0.alpha;
        page.scale.x = run0.scale;
        page.scale.y = run0.scale;
        page.position.x = (1 - run0.scale) * page.width + run0.positionX;
        page.position.y = (1 - run0.scale) * page.height;
    };
    cache.lock = true;
    tween60 = new TWEEN.Tween(run0)
        .to(run60, animationTime * 0.6)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(update)
        .onStart(function(){
            cache.pageLock = true;
        });
    tween100 = new TWEEN.Tween(run0)
        .to(run100, animationTime * 0.4)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(update)
        .onComplete(function(){
            cache.pageLock = false;
        });
    tween60.chain(tween100);
    tween60.start();
};
cache.lock = false;
cache.pageMax = 3;
cache.nowPage = 1;
var nextPage = function () {
    var outPage, inPage;
    outPage = "page" + cache.nowPage;
    if (cache.nowPage === cache.pageMax) {
        cache.nowPage = 0;
    }
    inPage = "page" + (cache.nowPage + 1);
    pixiCache[inPage].position.x = -dataCache.viewSize.width;
    pixiCache.stage.addChild(pixiCache.page2);
    zoomOutRight(pixiCache[outPage], 1000);
    zoomInLeft(pixiCache[inPage], 1200);
    cache.nowPage += 1;
    onPageSwich(cache.nowPage);
};
var prevPage = function () {
    var outPage, inPage;
    outPage = "page" + cache.nowPage;
    if (cache.nowPage === 1) {
        cache.nowPage = cache.pageMax + 1;
    }
    inPage = "page" + (cache.nowPage - 1);
    pixiCache[inPage].position.x = dataCache.viewSize.width;
    pixiCache.stage.addChild(pixiCache.page2);
    zoomOutLeft(pixiCache[outPage], 1000);
    zoomInRight(pixiCache[inPage], 1200);
    cache.nowPage -= 1;
    onPageSwich(cache.nowPage);
};
var onPageSwich = function onPageSwichFn(index){
    if(index === 1){
        $el.fileBtn.css({
            marginTop: 0
        });
    }else{
        $el.fileBtn.css({
            marginTop: 1000
        });
    }
};
interact($el.main.get(0))
    .draggable({
        onmove: function (event) {
            if(cache.pageLock || cache.lock ){
                return false;
            }
            if (event.dx > 50) {
                nextPage();
                cache.lock = true;
            } else if (event.dx < -50) {
                prevPage();
                cache.lock = true;
            }
        },
        onend: function (evnet) {
            cache.lock = false;
        }
    });

requestAnimationFrame(animate);
stats = new Stats();
var sds = stats.domElement.style;
sds.position = 'absolute';
sds.right = '0px';
sds.top = '0px';
sds.margin = '4em 3em';
document.body.appendChild(stats.domElement);



