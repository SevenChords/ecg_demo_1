
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

const mesh = new THREE.Mesh( geometry, material );
mesh.position.z = 1;
mesh.position.x = -1;
mesh.position.y = -1;

scene.add( mesh );

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
/*
/*
///////////////*/

let moveStep = 0.1;
let shiftPressed = false;

//the camera rotation pivot
let orbit = new THREE.Object3D();
orbit.rotation.order = "YXZ"; //this is important to keep level, so Z should be the last axis to rotate in order...
orbit.position.copy( mesh.position );
scene.add(orbit );

//offset the camera and add it to the pivot
//you could adapt the code so that you can 'zoom' by changing the z value in camera.position in a mousewheel event..
let cameraDistance = 4;

orbit.add( camera );
camera.position.z = cameraDistance;
let zoomScale = 1;

let moveCamera = false;
let mouseLastX;
let mouseLastY;

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

	if (keyName === "a") {
	  orbit.translateX(-moveStep);
	  
	  return;
	}
	if (keyName === "d") {
	  orbit.translateX(moveStep);
	 
	  return;
	}
	if (keyName === "w") {
	  orbit.translateZ(-moveStep);
	  
	  return;
	}
	if (keyName === "s") {
	  orbit.translateZ(moveStep);
	 
	  return;
	}
	if (keyName === "Shift") {
	  shiftPressed = true;
	  return;
	}
});
document.addEventListener('keyup', (event) => {
	const keyName = event.key;
	if (keyName === "Shift") {
		shiftPressed = false;
		return;
	  }
});


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

	console.log(eulerAngles);
   	uniforms.u_eulerAngles.value = eulerAngles;

	// mesh.rotation.y = time / 2000;
    uniforms.u_time.value = time;
	renderer.render( scene, camera );

}

