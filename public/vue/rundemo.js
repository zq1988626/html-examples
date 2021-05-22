define(["vue"],function(Vue){
    var html = $(".syntaxhighlighter.html .container").text()
    var js = new Function($(".syntaxhighlighter.javascript .container").text())
    js = 'define2(["vue"],function(Vue){  \
        new Vue({     \
            el:"#app",\
            data:function(){    \
                return {title:"测试"}\
            }   \
        });\
    })';
    var define2 = function(){
        define.apply(window,arguments)
    }
    var fn = new Function(js)
    $(document.body).append(html)
    fn();
})