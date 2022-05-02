
import * as THREE from "../node_modules/three/build/three.module.js";





const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 10;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

const uniforms = {
    u_resolution: { value: { x: null, y: null } },
    u_time: { value: 0.0 },
    u_mouse: { value: { x: null, y: null } },
	u_eulerAngles: new THREE.Uniform( new THREE.Vector3() ),
  }

const material = new THREE.RawShaderMaterial( {

	uniforms: uniforms,
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById('fragmentShader').textContent,
   
} );
material.needsUpdate = true;

const loader = new THREE.TextureLoader();
const mesh = new THREE.Mesh( geometry, material );
mesh.position.z = 0;
mesh.position.x = 0;
mesh.position.y = 0;

scene.add( mesh );

const planeGeometry = new THREE.PlaneGeometry( 10, 10 );


const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide,
	map: loader.load('textures/neon-grid.jpeg'),} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.z = 0;
plane.position.x = 0;
plane.position.y = -0.5;
plane.rotateX(0.5 * Math.PI);
scene.add( plane );






function getEulerAngles(mvMatrix)
{
	// todo rotation in abhängigkeit von vector zwischen Kamereaposition und Würfel Mittelpunkt implementieren
	const eulerAngles = new THREE.Euler();
	eulerAngles.setFromRotationMatrix(mvMatrix);
	return eulerAngles;
}

/////////////////
/*
/*
//CAMERA CONTROL
Coded with a little Help from Ethan Hermsey at https://stackoverflow.com/questions/60678494/orbit-controls-follow-the-mouse-without-clicking-three-js
and Gav at https://www.gavsblog.com/blog/detect-single-and-multiple-keypress-events-javascript
/*
/*	
///////////////*/

let moveStep = 0.1;
let shiftPressed = false;

//the camera rotation pivot
let orbit = new THREE.Object3D();
orbit.rotation.order = "YXZ"; //this is important to keep level, so Z should be the last axis to rotate in order...
// orbit.position.copy( mesh.position );
scene.add(orbit );

//offset the camera and add it to the pivot
//you could adapt the code so that you can 'zoom' by changing the z value in camera.position in a mousewheel event..
let cameraDistance = 0;

orbit.add( camera );
camera.position.z = cameraDistance;
let zoomScale = 1;

let moveCamera = false;
let mouseLastX;
let mouseLastY;
let fly = false;
let povHeight = 0;

orbit.position.y = povHeight;
orbit.position.z = 4;

let keysPressed = {};

if(fly){
	document.addEventListener('mousedown', function(e){
		moveCamera = true;
		mouseLastX = e.offsetX;
		mouseLastY = e.offsetY;
	});
	document.addEventListener('mousemove', function(e){
		if(moveCamera){
			let scale = 0.008;
			if(shiftPressed){
				orbit.translateY( -(mouseLastY - e.offsetY) * scale );
				orbit.translateX( (mouseLastX - e.offsetX) * scale ); 
				orbit.rotation.z = 0; //this is important to keep the camera level..
			}
			else{
				orbit.rotateX( (mouseLastY - e.offsetY) * scale );
				orbit.rotateY( (mouseLastX - e.offsetX) * scale ); 
				orbit.rotation.z = 0; //this is important to keep the camera level..
			}
			
			mouseLastX = e.offsetX;
			mouseLastY = e.offsetY;
		}
	});
	document.addEventListener('mouseup', function(e){
		moveCamera = false;
	});
	document.addEventListener('mouseup', function(e){
		moveCamera = false;
	});
	
	document.addEventListener('keydown', (event) => {
		const keyName = event.key;
		keysPressed[event.key] = true;
		if (keysPressed["a"]) {
		  orbit.translateX(-moveStep);
		  
		  
		}
		if (keysPressed["d"]) {
		  orbit.translateX(moveStep);
		 
		 
		}
		if (keysPressed["w"]) {
		  orbit.translateZ(-moveStep);
		  
		 
		}
		if (keysPressed["s"]) {
		  orbit.translateZ(moveStep);
		 
		 
		}
		if (keysPressed["Shift"]) {
		  shiftPressed = true;
		 
		}
	});
	document.addEventListener('keyup', (event) => {
		const keyName = event.key;
		if (keyName === "Shift") {
			shiftPressed = false;
			return;
		  }
		  delete keysPressed[keyName];
	});
}
else{
	document.querySelector("body").style.cursor = "none";
	document.addEventListener('mousemove', function(e){
		if(mouseLastX == null){
			mouseLastX = e.offsetX;
			mouseLastY = e.offsetY;
		}
			
			let scale = 0.005;
			orbit.rotateX((mouseLastY - e.offsetY) * scale);
			orbit.rotateY((mouseLastX - e.offsetX) * scale);
			// camera.rotateX( (mouseLastY - e.offsetY) * scale );
			// orbit.rotateY( (mouseLastX - e.offsetX) * scale ); 
			orbit.rotation.z = 0; //this is important to keep the camera level..
		
			
			mouseLastX = e.offsetX;
			mouseLastY = e.offsetY;
		
	});
	
	document.addEventListener('keydown', (event) => {
		console.log(keysPressed)
		keysPressed[event.key] = true;
		const keyName = event.key;
		console.log(keyName);
		if (keysPressed["a"]) {
			orbit.translateX(-moveStep);
		 
		}
		if (keysPressed["d"]) {
			orbit.translateX(moveStep);
		 
		  
		}
		if (keysPressed["w"]) {
			let angle = orbit.rotation.y;
			orbit.position.x += Math.sin(-angle) * moveStep;
			orbit.position.z += Math.cos(angle) * -moveStep;
			
		
		}
		if (keysPressed["s"]) {
			let angle = orbit.rotation.y;
			orbit.position.x += Math.sin(-angle) * -moveStep;
			orbit.position.z += Math.cos(angle) * moveStep;
		 
		  
		}
		
	});
	document.addEventListener('keyup', (event) => {
		const keyName = event.key;
		if (keyName === "Shift") {
			shiftPressed = false;
			return;
		  }
		  delete keysPressed[event.key];
	});
}



function zoom(event) {
	event.preventDefault();
	console.log(event.deltaY);
	zoomScale = event.deltaY * 0.01;
  
	// Restrict scale
	// zoomScale = Math.min(Math.max(.125, zoomScale), 4);
	orbit.translateZ(zoomScale);
	// Apply scale transform

  }

window.onwheel = zoom;


///CAMERA CONTROL - END
///////////////////////


const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.debug.checkShaderErrors = true
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );



console.log(scene.children[0]);

// animation

function animation( time ) {
    	
	const eulerAngles = getEulerAngles(camera.matrixWorldInverse);

	// console.log(eulerAngles);
   	uniforms.u_eulerAngles.value = eulerAngles;

	// mesh.rotation.y = time / 2000;
    uniforms.u_time.value = time;
	renderer.render( scene, camera );

}

