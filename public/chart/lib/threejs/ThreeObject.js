(function(){
	var flog = new THREE.Fog( 0xcce0ff, 30000, 40000 );
	
	var utils={
		createMesh:function (geom, imageFile, bump) {
            var texture = THREE.ImageUtils.loadTexture(imageFile);
            geom.computeVertexNormals();
            var mat = new THREE.MeshPhongMaterial();
            mat.map = texture;
            if (bump) {
                var bump = THREE.ImageUtils.loadTexture(bump);
                mat.bumpMap = bump;
                mat.bumpScale = 0.2;
            }
            var mesh = new THREE.Mesh(geom, mat);
            return mesh;
        }
	}
	
	//接口
	var get={
		renderer:{
			webGL:function(){},
			Canvas:function(){},
			DOM:function(){},
			SVG:function(){},
			WebGL:function(){},
			WebGLTarget:function(){},
			WebGLTargetCube:function(){},
			WebGLShaders:function(){}
		},
		light:{
			ambient:function(){},
			directional:function(){},
			hemisphere:function(){}
		},
		material:{
			basic:function(){},
			lambert:function(){},
			phong:function(){}
		}
	}
	
	//实现
	var GetThreeElement = {
		renderer:{
			/*
			制定渲染器的宽高，我们用renderer.setSize(width,height)来设置；
			追加生成的canvas元素到容器元素中。canvas对象的获取方法为renderer.domElement；
			设置canvas背景色(clearColor)和背景色透明度（clearAlpha）,renderer.setClearColor(clearColor,clearAlpha);
			*/
			
			webGL:function(){
				
				/*
				antialias:true,       //是否开启反锯齿  
		        precision:"highp",    //着色精度选择  
		        alpha:true,           //是否可以设置背景色透明  
		        premultipliedAlpha:false,  
		        stencil:false,  
		        preserveDrawingBuffer:true, //是否保存绘图缓冲  
		        maxLights:1           //maxLights:最大灯光数  
		        logarithmicDepthBuffer:false	//重叠自动偏移，防止叠加闪烁
		        */
		       
				var renderer = new THREE.WebGLRenderer( { antialias: true,logarithmicDepthBuffer: true } );
				
				/*
			    //指定渲染器的高宽（和画布框大小一致）  
			    renderer.setSize(width, height );  
			    //追加canvas 元素到canvas3d元素中。  
			    document.getElementById('canvas3d').appendChild(renderer.domElement);  
			    //设置canvas背景色(clearColor)和背景色透明度（clearAlpha）  
			    renderer.setClearColor(0x000000,0.5); 
			    */
				
				return renderer;
			},
			canvas:function(){
				
			}
		},
		light:{
			//环境光源：为所有元素着色
			ambient:function(){
				var light = new THREE.AmbientLight( 0x666666 );
				return light;
			},
			//平行光源：模拟太阳光
			directional:function(){
				var light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
				light.position.set( 50, 200, 100 );
				light.position.multiplyScalar( 1.3 );
				light.castShadow = true;
				// light.shadowCameraVisible = true;
				light.shadowMapWidth = 1024;
				light.shadowMapHeight = 1024;
				var d = 300;
				light.shadowCameraLeft = -d;
				light.shadowCameraRight = d;
				light.shadowCameraTop = d;
				light.shadowCameraBottom = -d;
				light.shadowCameraFar = 1000;
				return light;
			},
			
			//半球光源：使场景更加自然
			hemisphere:function(){
		        //生成半球光源 使场景更加自然
		        var light=new THREE.HemisphereLight(0x0000ff,0x00ff00,0.6);
		        light.position.set(0,500,0);
		        light.groundColor = new THREE.Color(0x00ff00);//设置地面发出的光线的颜色
		        light.color = new THREE.Color(0x0000ff);//设置天空发出的光线的颜色
		        light.intensity = 0.6;
				return light;
			},
		},
		material:{
			/*	基础属性：
			 	ID：标识材质
				name： 名称
				opacity：透明度，结合transparent使用，范围为0~1
				transparent：是否透明，如果为true则结合opacity设置透明度。如果为false则物体不透明
				visible：是否可见，false则看不见，默认可以看见
				side：侧面，觉得几何体的哪一面应用这个材质，默认为THREE.FrontSide(前外面)，还有THREE.BackSide(后内面)和THREE.DoubleSide(两面)
				needUpdate：如果为true，则在几何体使用新的材质的时候更新材质缓存
				
				融合属性：
				blending ：觉得物体的材质如何和背景融合，默认值为NormalBlending,这种情况下只显示材质的上层
				blendsrc：除了标准融合外，还可以通过指定融合源，融合目标，和融合公式，创建自定义的融合模式，默认SrcAlphaFactor，即alpha通道进行融合
				blenddst：默认OneMinusAlphaFactor，定义目标的融合方式，默认也使用alpha通道融合
				blendingequation：融合公式，指定如何使用融合源和融合目标，默认为addEquation，即将颜色相加
			 
			 	高级属性：
			 	
			 * */
			
			//对光照无感，给几何体一种简单的颜色或显示线框
			basic:function(){
				/*
				color：设置材质的颜色
				wireframe：如果为true，则将材质渲染成线框，在调试的时候可以起到很好的作用
				wireframeLinewidth：wireframe为true时，设置线框中线的宽度
				wireframeLinecap：决定线框端点如何显示，可选的值 round，bevel(斜角)和miter(尖角)。
				vertexColors：通过这属性，定义顶点的颜色，在canvasRender中不起作用。
				fog：决定单个材质的是否受全局雾化的影响。 
				值得一提的是： 
				对于fog属性，在全局中如果设定了雾化属性，那么本应该对所有场景的物体都添加雾化效果。
				*/
				
				return new THREE.MeshBasicMaterial({color: "#060606"});
			},
			//对光照有反应，用于创建暗淡的不发光的物体
			lambert:function(args){
				/*
				basic的所有属性
		    	ambient：设置材质的环境色，和AmbientLight光源一起使用，这个颜色会与环境光的颜色相乘。即是对光源作出反应。
		　　		emissive：设置材质发射的颜色，不是一种光源，而是一种不受光照影响的颜色。默认为黑色。 
				*/
				return new THREE.MeshLambertMaterial({color: "#060606",ambient:"#ff0000",emissive:"#ff0000"});
			},
			//反射光照，用于创建金属类明亮的物体
			phong:function(){
				/*
				basic的所有属性
					ambient：设置材质的环境色，和AmbientLight光源一起使用，这个颜色会与环境光的颜色相乘。即是对光源作出反应。
					emissive：设置材质发射的颜色，不是一种光源，而是一种不受光照影响的颜色。默认为黑色
					specular：指定该材质的光亮程度及其高光部分的颜色，如果设置成和color属性相同的颜色，则会得到另一个更加类似金属的材质，如果设置成grey灰色，则看起来像塑料
					shininess：指定高光部分的亮度，默认值为30.
				 */
				
				return new THREE.MeshPhongMaterial({color: "#ffffff",ambient:"#ff0000"});
			}
		}
	}
	
	
	
	var ThreeObject = function(element){
		this.$element = $(element);
		this.element = this.$element[0];
		
		this.loader = new THREE.TextureLoader();
		this.clock = new THREE.Clock();
		
		this.renderer = GetThreeElement.renderer.webGL();
		
		this.scene = new THREE.Scene();
		//场景-雾化  
		this.scene.fog = flog;
		
		// 设置渲染器允许阴影映射
		this.renderer.shadowMapEnabled = true;
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.shadowMap.enabled = true;
	}
	ThreeObject.prototype.init = function(){
		this.camera = new THREE.PerspectiveCamera( 46, this.$element.width() / this.$element.height(), 1, 40000 );
		
		this.camera.position.y = 6000;
		this.camera.position.x = 6000;
		this.camera.position.z = 8000;
		
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize(this.$element.width(),this.$element.height() );
		this.renderer.setClearColor( this.scene.fog.color );
		
		//添加光源
		this.addLight();
		
		//添加手势控制器
		this.addControls();
		
		//添加地平线
		//this.loadGroupdTexture();
		
		this.element.innerHTML = "";
	
		this.element.appendChild( this.renderer.domElement );
		
		
		this.animate();
	}
	
	/*
	GridHelper( size, divisions, colorCenterLine, colorGrid )
	按照官方文档，有2个构造函数；
	4个参数分别是：网格宽度、等分数、中心线颜色，网格线颜色
	默认分别是10,10,0x444444,0x888888
	
	用法：
	var grid1=new THREE.GridHelper();
	var grid2=new THREE.GridHelper(30,30);
	var grid3=new THREE.GridHelper(30,30,0xf0f0f0,0xffffff)
	以上3种方法都可以。
	*/
	ThreeObject.prototype.addGridHelper = function(option) {
    	/// Global : group
		//var group = new THREE.Group();
		//group.add( helper );
		var helper = new THREE.GridHelper(option.size,option.divisions,option.colorCenterLine,option.colorGrid);
		helper.rotation = $.extend(helper.rotation,option.rotation);
		helper.position = $.extend(helper.position,option.position);
		this.scene.add( helper );
	}
	
	ThreeObject.prototype.animate = function() {
		var _this = this;
		this.render();
		requestAnimationFrame(function(){
			_this.animate();
		});
	}
	
	ThreeObject.prototype.render=function(){
		this.controls.update(this.clock.getDelta());
		this.renderer.render(this.scene, this.camera);
	}
	
	ThreeObject.prototype.resize = function(){
		this.camera.aspect = this.$element.width() / this.$element.height();
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.$element.width(), this.$element.height() );
	}
	
	ThreeObject.prototype.loadGroupdTexture = function(img){
		var groundTexture = THREE.ImageUtils.loadTexture(img||'textures/terrain/grasslight-big.jpg');
		//var groundTexture = this.loader.load(img||"textures/terrain/grasslight-big.jpg" );
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set( 25, 25 );
		groundTexture.anisotropy = 16;
	
 
 
		var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture,color: 0xffffff,emissive: 0x111111 } );
		var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 80000, 80000 ), groundMaterial );
		mesh.position.y = -100;
		mesh.rotation.x = - Math.PI / 2;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		this.scene.add(mesh);
	}
	
	ThreeObject.prototype.addPlane=function(option){
		
		
		// 创建平面的骨架
		var planeGeometry2 = new THREE.PlaneBufferGeometry(option.width, option.height, 1, 1);
		// 创建平面的材料
		// var planeMaterial = new THREE.MeshBasicMaterial({color: '#aaaaaa'});
		var planeMaterial2 = new THREE.MeshBasicMaterial({ color:option.color||"#ffffff"});
		var plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
		
		plane2.receiveShadow = true;
		// 设置平面的旋转角度
		plane2.rotation.x = -0.5 * Math.PI;
		// 设置平面的位置
		
		plane2.position = $.extend(plane2.position,option.position);
		
		this.scene.add(plane2);
	}
	
	//控制器
	ThreeObject.prototype.addControls = function(){
		var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	
	    // 如果使用animate方法时，将此函数删除
	    //controls.addEventListener( 'change', render );
	    // 使动画循环使用时阻尼或自转 意思是否有惯性
	    controls.enableDamping = true;
	    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
	    //controls.dampingFactor = 0.25;
	    //是否可以缩放
	    controls.enableZoom = true;
	    //是否自动旋转
	    controls.autoRotate = false;
	    //设置相机距离原点的最远距离
	    //controls.minDistance = 50;
	    //设置相机距离原点的最远距离
	    //controls.maxDistance = 200;
	    //是否开启右键拖拽
	    controls.enablePan = true;
		controls.center.set( 0.0, 100.0, 0.0 );
		controls.userPanSpeed = 10000;
		
		
		//水平方向视角限制
		controls.minAzimuthAngle = -Infinity; // radians
		controls.maxAzimuthAngle = Infinity; // radians
	
		//最大仰视角和俯视角
		//controls.minPolarAngle = Math.PI/16; // radians
		//controls.maxPolarAngle = Math.PI/2; // radians
		/*
		// Set to false to disable this control
		//鼠标控制是否可用
		this.enabled = true;
	
		// "target" sets the location of focus, where the object orbits around
		//聚焦坐标
		this.target = new THREE.Vector3();
	
		// How far you can dolly in and out ( PerspectiveCamera only )
		//最大最小相机移动距离(景深相机)
		this.minDistance = 0;
		this.maxDistance = Infinity;
	
		// How far you can zoom in and out ( OrthographicCamera only )
		//最大最小鼠标缩放大小（正交相机）
		this.minZoom = 0;
		this.maxZoom = Infinity;
		
		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		//最大仰视角和俯视角
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians
	
		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		//水平方向视角限制
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians
		
		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		//惯性滑动，滑动大小默认0.25
		this.enableDamping = false;
		this.dampingFactor = 0.25;
	
		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		//滚轮是否可控制zoom，zoom速度默认1
		this.enableZoom = true;
		this.zoomSpeed = 1.0;
	
		// Set to false to disable rotating
		//是否可旋转，旋转速度
		this.enableRotate = true;
		this.rotateSpeed = 1.0;
	
		// Set to false to disable panning
		//是否可平移，默认移动速度为7px
		this.enablePan = true;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push
	
		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		//是否自动旋转，自动旋转速度。默认每秒30圈
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
	
		// Set to false to disable use of the keys
		//是否能使用键盘
		this.enableKeys = true;
	
		// The four arrow keys
		//默认键盘控制上下左右的键
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
	
		// Mouse buttons
		//鼠标点击按钮
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
		*/
		
		this.controls = controls;
	}
	
	
	//添加光源
	ThreeObject.prototype.addLight = function(){
		//添加环境光源 为所有元素着色
		this.scene.add( new THREE.AmbientLight( 0x666666 ) );

		//添加方向光源模拟太阳光
		var light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
		light.position.set( 50, 200, 100 );
		light.position.multiplyScalar( 1.3 );
		light.castShadow = true;
		// light.shadowCameraVisible = true;
		light.shadowMapWidth = 1024;
		light.shadowMapHeight = 1024;
		var d = 300;
		light.shadowCameraLeft = -d;
		light.shadowCameraRight = d;
		light.shadowCameraTop = d;
		light.shadowCameraBottom = -d;

		light.shadowCameraFar = 1000;

		this.scene.add( light );
		
		
        //生成半球光源 使场景更加自然
        var hemiLight=new THREE.HemisphereLight(0x0000ff,0x00ff00,0.6);
        hemiLight.position.set(0,500,0);
        hemiLight.groundColor = new THREE.Color(0x00ff00);//设置地面发出的光线的颜色
        hemiLight.color = new THREE.Color(0x0000ff);//设置天空发出的光线的颜色
        hemiLight.intensity = 0.6;
        this.scene.add(hemiLight);
	}
	
	ThreeObject.prototype.addCube=function(){
		    	
        //立方体
        var cubeGeometry = new THREE.Geometry();
        
        var w = 1000;

        //创建立方体的顶点
        var vertices = [
            new THREE.Vector3(w, w, w), //v0
            new THREE.Vector3(-w, w, w), //v1
            new THREE.Vector3(-w, -w, w), //v2
            new THREE.Vector3(w, -w, w), //v3
            new THREE.Vector3(w, -w, -w), //v4
            new THREE.Vector3(w, w, -w), //v5
            new THREE.Vector3(-w, w, -w), //v6
            new THREE.Vector3(-w, -w, -w) //v7
        ];

        cubeGeometry.vertices = vertices;

        //创建立方的面
        var faces=[
            new THREE.Face3(0,1,2),
            new THREE.Face3(0,2,3),
            new THREE.Face3(0,3,4),
            new THREE.Face3(0,4,5),
            new THREE.Face3(1,6,7),
            new THREE.Face3(1,7,2),
            new THREE.Face3(6,5,4),
            new THREE.Face3(6,4,7),
            new THREE.Face3(5,6,1),
            new THREE.Face3(5,1,0),
            new THREE.Face3(3,2,7),
            new THREE.Face3(3,7,4)
        ];

        cubeGeometry.faces = faces;

        //生成法向量
        cubeGeometry.computeFaceNormals();
		
		var renderer = this.renderer;
		var texture = THREE.ImageUtils.loadTexture('textures/patterns/circuit_pattern2.png', function ( image ) {
            texture.image = image;
            texture.needsUpdate = true;
        } );
        var cubeMaterial = new THREE.MeshLambertMaterial();
        cubeMaterial.map = texture;
        cubeMaterial.bumpMap = texture;
        //cubeMaterial.bumpScale = 1000;
        

        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = 25;
        cube.position.y = w;
        cube.position.z = -5;

        //告诉立方体需要投射阴影
        cube.castShadow = true;

        //this.scene.add(cube);
	}
	
	//生成数据面
	var generateTexture = function ( data, width, height ) {
		var canvas, canvasScaled, context, image, imageData,
		level, diff, vector3, sun, shade;

		vector3 = new THREE.Vector3( 0, 0, 0 );

		sun = new THREE.Vector3( 1, 1, 1 );
		sun.normalize();

		canvas = document.createElement( 'canvas' );
		canvas.width = width;
		canvas.height = height;

		context = canvas.getContext( '2d' );
		context.fillStyle = '#fff';
		context.fillRect( 0, 0, width, height );

		image = context.getImageData( 0, 0, canvas.width, canvas.height );
		imageData = image.data;

		for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
			vector3.x = data[ j - 2 ] - data[ j + 2 ];
			vector3.y = 2;
			vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
			vector3.normalize();

			shade = vector3.dot( sun );
			/*颜色*/
			imageData[ i ] = ( 0 + shade * 160 ) * ( 0.5 + data[ j ] * 0.003 );
			imageData[ i + 1 ] = ( 0 + shade * 160 ) * ( 0.5 + data[ j ] * 0.003 );
			imageData[ i + 2 ] = ( shade * 160 ) * ( 0.5 + data[ j ] * 0.003 );
		}
		context.putImageData( image, 0, 0 );

		// Scaled 4x

		canvasScaled = document.createElement( 'canvas' );
		canvasScaled.width = width * 4;
		canvasScaled.height = height * 4;

		context = canvasScaled.getContext( '2d' );
		context.scale( 4, 4 );
		context.drawImage( canvas, 0, 0 );

		image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
		imageData = image.data;

		for ( var i = 0, l = imageData.length; i < l; i += 4 ) {
			var v = ~~ ( Math.random() * 5 );
			imageData[ i ] += v;
			imageData[ i + 1 ] += v;
			imageData[ i + 2 ] += v;
		}
		context.putImageData( image, 0, 0 );
		return canvasScaled;
	}
	
	
	/*
	 *
	 * addGeoMetry({
			width:respdata.width,
		    widthScale:10,
			depth:respdata.depth,
			depthScale:20,
			height:respdata.height,
		    hightScale:0.001
		})
	 * 
	 * */
	
	ThreeObject.prototype.addGeoMetry=function(option){
		var renderWidth = option.width*option.widthScale;
		var renderHeight = option.depth*option.depthScale;
		//创建煤层
		var geometry = new THREE.PlaneBufferGeometry(
			renderWidth,renderHeight, 
			option.width-1, option.depth-1
		);
		
		var data = option.height;
		
		//平面旋转角度
		geometry.rotateX( - Math.PI / 4 );
		var vertices = geometry.attributes.position.array;
		for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
			vertices[ j + 1 ] = data[ i ]*option.hightScale;
			data[i]*=option.hightScale;
		}
		
        geometry.computeFaceNormals();
		texture = new THREE.CanvasTexture(generateTexture(data,option.width,option.depth ) );
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		
		var Material = new THREE.MeshBasicMaterial( { map: texture } );
		
		var mesh = new THREE.Mesh( geometry,Material  );
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		this.scene.add(mesh);
	}
	
	ThreeObject.prototype.addGeoMetry2=function(option){
		var data = option.height;
		var width = option.width;
		
		var scale = 100;
		var offsetZ = option.width*scale/2;
		var offsetX = option.depth*scale/2;
		
        var cubeGeometry = new THREE.Geometry();

        //创建顶点列表
        var vertices = data.map(function(item,i){
        	return new THREE.Vector3(
	    		Math.floor(i/width)*scale*option.widthScale-offsetX, 
	    		i%width*scale*option.depthScale-offsetZ, 
	    		item*scale*option.heightScale
        	);
        });

        cubeGeometry.vertices = vertices;
        
        var faces = [];
        for(var i =0;i<vertices.length;i++){
        	if(i>=vertices.length-width){break}
        	if((i+1)%width!=0){
        		//if(vertices[i+1].z+vertices[i].z+vertices[i+width].z!=0){
        			faces.push(new THREE.Face3(i+1,i,i+width));
        		//}
        		//faces.push(new THREE.Face3(i,i+1,i+width));//反面
        	}
        	if(i%width!=0){
        		//if(vertices[i+width-1].z+vertices[i+width].z+vertices[i].z!=0){
        			faces.push(new THREE.Face3(i+width-1,i+width,i));
        		//}
        		//faces.push(new THREE.Face3(i+width,i+width-1,i));//反面
        	}
        }
        
        //封闭底面
        //faces.push(new THREE.Face3(0,width-1,vertices.length-1));
        //faces.push(new THREE.Face3(vertices.length-width,0,vertices.length-1));

        //创建立方的面
        /*
        var faces=[
            new THREE.Face3(0,1,2),
            new THREE.Face3(0,2,3),
            new THREE.Face3(0,3,4),
            new THREE.Face3(0,4,5),
            new THREE.Face3(1,6,7),
            new THREE.Face3(1,7,2),
            new THREE.Face3(6,5,4),
            new THREE.Face3(6,4,7),
            new THREE.Face3(5,6,1),
            new THREE.Face3(5,1,0),
            new THREE.Face3(3,2,7),
            new THREE.Face3(3,7,4)
        ];
        */

        cubeGeometry.faces = faces;

        //生成法向量
        cubeGeometry.computeFaceNormals();
        //计算顶点法线
        cubeGeometry.computeVertexNormals();
        
        /*
         * 
         * 材质种类： 
			MeshBasicMaterial：为几何体赋予一种简单的颜色，或者显示几何体的线框 
			MeshDepthMaterial：根据网格到相机的距离，该材质决定如何给网格染色 
			MeshNormalMaterial：根据物体表面的法向量计算颜色 
			MeshFaceMaterial：这是一种容器，可以在该容器中为物体的各个表面上设置不同的颜色 
			MeshLambertMaterial：考虑光照的影响，可以创建颜色暗淡，不光亮的物体 
			MeshPhongMaterial：考虑光照的影响，可以创建光亮的物体 
			ShaderMaterial：使用自定义的着色器程序，直接控制顶点的放置方式，以及像素的着色方式。 
			LineBasicMaterial：可以用于THREE.Line几何体，从而创建着色的直线 
			LineDashedMaterial：类似与基础材质，但可以创建虚线效果
         * 
         * */
        
		var texture = THREE.ImageUtils.loadTexture('textures/terrain/grasslight-big.jpg');
        var cubeMaterial = new THREE.MeshLambertMaterial({color:"#050505"});
        
        cubeMaterial.wireframe=false;//展示骨架
		//var cube = utils.createMesh(cubeGeometry,"textures/terrain/grasslight-big.jpg","textures/terrain/grasslight-big.jpg")
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = 0;
		//平面旋转角度
		cube.rotateX( - Math.PI / 2 );

        //告诉立方体需要投射阴影
        cube.castShadow = true;

        this.scene.add(cube);
	}
	
	
	
	
	window.ThreeObject = ThreeObject;
})();
