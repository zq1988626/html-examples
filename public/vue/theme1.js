$.getScript("https://blog-static.cnblogs.com/files/ZQ01/index.js",function(){
    ZQINIT.showLoading();
   updateElement();
    var $container = $(initHTML).appendTo(document.body);
    ZQINIT.initRequire(function(){
        var data = getData();
        updateBlog(data,$container).then(ZQINIT.hideLoading).then(function(){
                $("#home").show();
                ZQINIT.hideLoading();
        })
    })
});

var updateElement = function(){
    $("input[type=button]").removeClass().addClass("btn btn-default btn-sm");
}

var updateBlog = function(data,$container){
    return ZQINIT.requirePromise(["bootstrap"])
    .then(function(){
        ZQINIT.requirePromise(["css!blogcss"]);
        var header = $("#header");
        var bshead = $([
        '<div class="intro-header" style="background-image: url(\'https://kykjsoft.oss-cn-zhangjiakou.aliyuncs.com/home/img/index/bg4.jpg\') ">',
            '<div id="signature">',
                '<div class="container">',
                    '<div class="row">',
                        '<div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">',
                            '<div class="site-heading"></div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
        ].join(""));
        header.before(bshead);
        bshead.find(".site-heading").append(header);

        var bsnav = $([
        '<nav class="navbar navbar-default navbar-custom navbar-fixed-top">',
            '<div class="container-fluid">',
                '<div class="navbar-header page-scroll">',
                    '<button type="button" class="navbar-toggle">',
                        '<span class="sr-only">Toggle navigation</span>',
                        '<span class="icon-bar"></span>',
                        '<span class="icon-bar"></span>',
                        '<span class="icon-bar"></span>',
                    '</button>',
                    '<a class="navbar-brand" href="/">',data.title,'</a>',
                '</div>',
                '<div id="myblog_navbar"></div>',
            '</div>',
        '</nav>'
        ].join(""))
        bshead.after(bsnav);
        var navigator = $("#navigator").addClass("navbar-collapse");
        navigator.children("ul").addClass("nav navbar-nav navbar-right");
        navigator.children(".blogStats").hide();
        bsnav.find("#myblog_navbar").append(navigator);

        
        var container = $('<div class="container"></div>');
        bsnav.after(container);

        var oldmain = $("#main");
        oldmain.addClass("row");
        oldmain.children(":eq(0)")
        .addClass("col-lg-8 col-lg-offset-1 col-md-8 col-md-offset-1 col-sm-12 col-xs-12 post-container");
        oldmain.children(":eq(1)")
        .addClass("col-lg-3 col-lg-offset-0 col-md-3 col-md-offset-0 col-sm-12 col-xs-12 sidebar-container");
        container.append(oldmain);
        
        
            // 顶部滚动显示因此囊
            var c = $(".navbar-custom").height();
            $(window).on("scroll", {previousTop: 0}, function() {
                if ($(window).width() <= 1170) {return;}
                var b = $(window).scrollTop();
                if(b < this.previousTop){
                    if(b > 0 && $(".navbar-custom").hasClass("is-fixed") ){
                        $(".navbar-custom").addClass("is-visible")
                    }else{
                        $(".navbar-custom").removeClass("is-visible is-fixed") 
                    }
                }else{
                    $(".navbar-custom").removeClass("is-visible");
                    b > c && !$(".navbar-custom").hasClass("is-fixed") && $(".navbar-custom").addClass("is-fixed");
                }
                this.previousTop = b
            })

            // Drop Bootstarp low-performance Navbar
            // Use customize navbar with high-quality material design animation
            // in high-perf jank-free CSS3 implementation
            var $body   = document.body;
            var $toggle = $('.navbar-toggle');
            var $navbar = $('#myblog_navbar');
            var $collapse = $('.navbar-collapse');
            $toggle.click(function (e){
                if ($navbar.hasClass('in')) {
                    $navbar.removeClass();
                    setTimeout(function(){
                        if($navbar.not('.in')) {
                            $collapse[0].style.height = "0px"
                        }
                    },400)
                }else{
                    $collapse[0].style.height = "auto"
                    $navbar.addClass("in");
                }
            })

        return true;
    });
}
var getData = function(){
    var g = function(s){return $(s).text()}
    var ga = function($a){return {text:$a.text(),url:$a.attr("href")}}
    var pages = $("#mainContent .day").map(function(){
        return {
            dayTitle:ga($(".dayTitle a",this)),
            postTitle:ga($(".postTitle a",this)),
            postEdit:ga($(".postDesc a",this)),
            body:$(".postCon",this).html(),
            Mark:$(".postDesc",this)[0].childNodes[0].textContent
        }
    }).toArray()

    var data = {
        title:g("#Header1_HeaderTitle"),
        pages:pages,
        value:"222"
    }
    return data;
}
var initHTML="<div id='app'></div>";