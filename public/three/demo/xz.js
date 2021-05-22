requirejs(["THREE","./editor/Loader","json!demo/data/xz.json","editor/Editor","editor/Viewport","editor/Sidebar"],function(
    THREE,Loader,sceneJSON,Editor,Viewport,Sidebar
){
    var editor = new Editor();
    var viewport = new Viewport( editor );
    document.body.appendChild( viewport.dom );
    var sidebar = new Sidebar( editor );
    //document.body.appendChild( sidebar.dom );
    var loader = new Loader(editor);
    loader.handleJSON(sceneJSON);
})