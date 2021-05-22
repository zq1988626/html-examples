/**
 * @author mrdoob / http://mrdoob.com/
 */
define(["THREE"],function(THREE){
    var Sidebar = function ( editor ) {

        var currentRenderer = null;
        var currentPmremGenerator = null;
        var signals = editor.signals;

        function updateRenderer() {
            createRenderer([true, true, 1, 1, false]);
        }

        function createRenderer( antialias, shadows, shadowType, toneMapping, physicallyCorrectLights ) {

            var parameters = { antialias: antialias };

            if ( currentRenderer !== null ) {
                currentRenderer.dispose();
                currentPmremGenerator.dispose();
            }

            parameters.toneMapping = THREE.ReinhardToneMapping;// add
            currentRenderer = new THREE.WebGLRenderer( parameters );
            currentRenderer.toneMapping = THREE.ReinhardToneMapping;// add
            currentRenderer.toneMappingExposure = 2;// add
            currentRenderer.outputEncoding = THREE.sRGBEncoding;// add
            currentPmremGenerator = new THREE.PMREMGenerator( currentRenderer );
            currentPmremGenerator.compileCubemapShader();
            currentPmremGenerator.compileEquirectangularShader();

            if ( shadows ) {

                currentRenderer.shadowMap.enabled = true;
                currentRenderer.shadowMap.type = parseFloat( shadowType );

            }

            currentRenderer.toneMapping = parseFloat( toneMapping );
            currentRenderer.physicallyCorrectLights = physicallyCorrectLights;

            signals.rendererChanged.dispatch( currentRenderer, currentPmremGenerator );
        }

        function updateTonemapping() {
            currentRenderer.toneMappingExposure = toneMappingExposure.getValue();
            currentRenderer.toneMappingWhitePoint = toneMappingWhitePoint.getValue();
            signals.rendererUpdated.dispatch();
        }

        createRenderer([true, true, 1, 1, false]);

    };

    return Sidebar;
});
