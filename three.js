
import * as THREE from "../node_modules/three/build/three.module.js";

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

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

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );



console.log(scene.children[0]);

// animation

function animation( time ) {
    
	// mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 2000;
   
    uniforms.u_time.value = time;
	renderer.render( scene, camera );

}

