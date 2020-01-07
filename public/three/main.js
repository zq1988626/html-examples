requirejs.config({
    paths: {
        "jquery":"jquery-1.12.4",
        "tc":"tc",
        "gui":"js/libs/dat.gui.min",
        "THREE":"build/three",
        "OrbitControls":"js/controls/OrbitControls",
        "CopyShader":"js/shaders/CopyShader",
        "SimplexNoise":"js/math/SimplexNoise",
        "EffectComposer":"js/postprocessing/EffectComposer",
        "SSAOShader":"js/shaders/SSAOShader",
        "ShaderPass":"js/postprocessing/ShaderPass",
        "SSAOPass":"js/postprocessing/SSAOPass"
    },
    shim:{
        "CopyShader":{deps:["THREE"],exports:"window.THREE.CopyShader"},
        "OrbitControls":{deps:["THREE"],exports:"window.THREE.OrbitControls"},
        "SimplexNoise":{deps:["THREE"],exports:"window.THREE.SimplexNoise"},
        "EffectComposer":{deps:["THREE"],exports:"window.THREE.EffectComposer"},
        "SSAOShader":{deps:["THREE"],exports:"window.THREE.SSAOShader"},
        "ShaderPass":{deps:["THREE","EffectComposer"],exports:"window.THREE.ShaderPass"},
        "SSAOPass":{deps:["THREE","EffectComposer"],exports:"window.THREE.SSAOPass"}
    }
});
(function(){
    var controller = document.body.getAttribute("controller")
    controller&&requirejs([controller])
})();