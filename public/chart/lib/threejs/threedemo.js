;define(["require","controller"
],function(require,base){
	return F.class(base,{
		name:"threedemo",

		bindEvent:function(){
			
		},
		
		loadThree:function(){
			var container;
			var camera, scene, renderer;
			var group;
			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;
			var mouseX = 0;
			var mouseXOnMouseDown = 0;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var loader = new THREE.FontLoader();
			loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
				init( font );
				animate();
			} );
			function init( font ) {
				container = $('#threedemo')[0];
				//document.body.appendChild( container );
				var info = $('#threecontent')[0];
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.style.fontSize = '20px';
				info.innerHTML = '我是标题';
				container.appendChild( info );
				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( 0, 150, 500 );
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xf0f0f0 );
				// Get text from hash
				var theText = "Hello three.js! :)";
				var hash = document.location.hash.substr( 1 );
				if ( hash.length !== 0 ) {
					theText = hash;
				}
				var geometry = new THREE.TextBufferGeometry( theText, {
					font: font,
					size: 80,
					height: 20,
					curveSegments: 2
				});
				geometry.computeBoundingBox();
				var centerOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
				var materials = [
					new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
					new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
				];
				var mesh = new THREE.Mesh( geometry, materials );
				mesh.position.x = centerOffset;
				mesh.position.y = 100;
				mesh.position.z = 0;
				mesh.rotation.x = 0;
				mesh.rotation.y = Math.PI * 2;
				group = new THREE.Group();
				group.add( mesh );
				scene.add( group );
				renderer = new THREE.CanvasRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				
				
				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function onWindowResize() {
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			//
			function onDocumentMouseDown( event ) {
				event.preventDefault();
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mouseout', onDocumentMouseOut, false );
				mouseXOnMouseDown = event.clientX - windowHalfX;
				targetRotationOnMouseDown = targetRotation;
			}
			function onDocumentMouseMove( event ) {
				mouseX = event.clientX - windowHalfX;
				targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
			}
			function onDocumentMouseUp( event ) {
				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
			}
			function onDocumentMouseOut( event ) {
				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
			}
			function onDocumentTouchStart( event ) {
				if ( event.touches.length == 1 ) {
					event.preventDefault();
					mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
					targetRotationOnMouseDown = targetRotation;
				}
			}
			function onDocumentTouchMove( event ) {
				if ( event.touches.length == 1 ) {
					event.preventDefault();
					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
				}
			}
			//
			function animate() {
				requestAnimationFrame( animate );
				render();
			}
			function render() {
				group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
				renderer.render( scene, camera );
			}
		},
		
		onLoad:function(){
			this.bindEvent();
			var _this = this;
			this.loadThree();
		}
	});
});