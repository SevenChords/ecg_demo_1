
import * as THREE from "../node_modules/three/build/three.module.js";





const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 10;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

const uniforms = {
    u_resolution: { value: { x: null, y: null } },
    u_time: { value: 0.0 },
    u_mouse: { value: { x: null, y: null } },
  }

const material = new THREE.RawShaderMaterial( {

	uniforms: uniforms,
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById('fragmentShader').textContent,
   
} );

const mesh = new THREE.Mesh( geometry, material );
mesh.position.z = -1;
scene.add( mesh );



//the camera rotation pivot
let orbit = new THREE.Object3D();
orbit.rotation.order = "YXZ"; //this is important to keep level, so Z should be the last axis to rotate in order...
orbit.position.copy( mesh.position );
scene.add(orbit );
let moveCamera = false;
let mouseLastX;
let mouseLastY;
document.addEventListener('mousedown', function(e){
	moveCamera = true;
	mouseLastX = e.offsetX;
	mouseLastY = e.offsetY;
})
document.addEventListener('mousemove', function(e){
	if(moveCamera){
		let scale = 0.008;
		
		orbit.rotateX( (mouseLastY - e.offsetY) * scale );
		orbit.rotateY( (mouseLastX - e.offsetX) * scale ); 
		orbit.rotation.z = 0; //this is important to keep the camera level..
		mouseLastX = e.offsetX;
	mouseLastY = e.offsetY;
	}
   
})
document.addEventListener('mouseup', function(e){
	moveCamera = false;
})

//offset the camera and add it to the pivot
//you could adapt the code so that you can 'zoom' by changing the z value in camera.position in a mousewheel event..
let cameraDistance = 4;
camera.position.z = cameraDistance;
orbit.add( camera );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );



console.log(scene.children[0]);

// animation

function animation( time ) {
    
	
	// mesh.rotation.y = time / 2000;
   
    uniforms.u_time.value = time;
	renderer.render( scene, camera );

}

