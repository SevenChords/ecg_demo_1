var cubeRotation_x = 0.0;
var cubeRotation_y = 0.0;
var cubeRotation_z = 0.0;

main();

function main(){
    //get webgl context
    const canvas = document.getElementById('glCanvas');
    // resize to fit window
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    // get webGL context
    const gl = canvas.getContext('webgl');

    if (gl === null){
        alert("Unable to initialize WebGL");
        return
    }

    // black bachground
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // sourcecode for vertex shader
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
        attribute vec2 aTexCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform float uTime;

        varying lowp vec4 vColor;
        varying vec2 vTexCoord;
        varying float vTime;

        void main(){
            gl_Position = uProjectionMatrix * uModelViewMatrix *  uTime;
            vColor = aVertexColor;
            vTexCoord = aTexCoord;
            vTime = uTime;
        }
    `;
    
    // sourcecode for fragment shader
    const fsSource = `
        precision mediump float;

        varying vec2 vTexCoord;
        varying float vTime;
        
        vec2 iResolution = vec2(1.0, 1.0);

        uniform float x_rot;
        uniform float y_rot;
        uniform float z_rot;

        float PI = 3.14159265359;

        float circle(vec2 pos, vec2 uv, float screenRatio, float size, vec3 color){
            vec2 vectorFromCenter = pos - uv;
            vectorFromCenter.y *= screenRatio;
            float distFromCenter = length(vectorFromCenter);
            float circle = smoothstep(size, size, distFromCenter);
            //return color * (1.-circle);
            return circle;
        }

        float castleRim(float x, float a, float phi){
            float t = 1.;
            float result = a * fract(x/t + phi);
            return result;
        }

        float normSin(float x){
            return sin(x)*0.5 + 0.5;
        }

        float normCos(float x){
            return cos(x)*0.5 + 0.5;
        }

        void main()
        {
            // Normalized pixel coordinates (from 0 to 1)
            vec2 uv = vTexCoord/iResolution.xy;
            float screenRatio = iResolution.y / iResolution.x;
            vec3 aColor = vec3(0.2, 0.1, 0.5);
            float circleSize = 0.7;
            vec2 pos = vec2(0.5, 0.5);
            float saturation = 0.6;
            
            vec3 col = vec3(0.0, 0.0, 0.0);    
        
            for(float i = 1.; i < 100.; i++){
                col += aColor * saturation * circle(pos, uv, screenRatio, circleSize, aColor);
                circleSize *= 0.8;
                //circleSize *= 0.8 + castleRim(vTime*1., 0.05, 0.);
                saturation *= 0.99;
                //saturation *= 0.99 + castleRim(vTime*1., 0.02, 0.);
                
                aColor *= 0.9;
                //pos.x *= (1. + sin(vTime)*0.05);
                pos.x -= ((mod(y_rot+PI, 2.*PI)) - PI) * 0.2 * PI;
                //pos.y *= (1. + cos(vTime*1.1)*0.05);
                //circleSize *= 1.0 + normSin(vTime*0.9)*0.1;
            }


            gl_FragColor = vec4(col,1.0);
        }
    `;

    // initialize shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // get and store memory adresses for attributes and uniforms of the shader program
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            texCoord: gl.getAttribLocation(shaderProgram, 'aTexCoord')
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            time: gl.getUniformLocation(shaderProgram, 'uTime'),
            x_rot: gl.getUniformLocation(shaderProgram, 'x_rot'),
            y_rot: gl.getUniformLocation(shaderProgram, 'y_rot'),
            z_rot: gl.getUniformLocation(shaderProgram, 'z_rot')
        },
    };

    const buffers = initBuffers(gl);

    var then = 0;

    //draw scene repeatedly
    function render(now){
        now *= 0.001;
        const deltaTime = now - then;
        then = now;
        
        drawScene(gl, programInfo, buffers, deltaTime, now);
        
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}



function initShaderProgram(gl, vsSource, fsSource){
    // create one shader program consisting of one vertex shader and one fragment shader
    
    // get WebGlShader-Object with compiled shader code
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    
    // create shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // link shader program
    gl.linkProgram(shaderProgram);

    // check
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    console.log("shader program initialized");
    return shaderProgram;
}

function loadShader(gl, type, source){
    // instantiate WebGlShader-Object and compile shader code

    // create WebGlShader-Object
    const shader = gl.createShader(type);
    // send shader source code to WebGlShader-Object
    gl.shaderSource(shader, source);
    // compile source code
    gl.compileShader(shader);
    
    // check
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert("an error occured compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    console.log("shader loaded: " + type);
    return shader;
}

function initBuffers(gl){

    // define the vertices
    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0,  1.0,
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ]

    // create buffer object
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // fill the vertex positions into position buffer
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);



    // define colors
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
    ];

    var colors = [];
    for (var j = 0; j < faceColors.length; j++){
        const c = faceColors[j];
        colors = colors.concat(c, c, c, c);
    }

    // create buffer object
    const colorBuffer = gl.createBuffer();

    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // fill colors into color buffer
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW);


    // define element array
    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
      ];

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    // define texture buffer
    const cubeCoords = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
      ];

    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeCoords), gl.STATIC_DRAW);


    // return buffers in a dictionary
    return{
        positions: positionBuffer,
        colors: colorBuffer,
        texCoord: textureBuffer,
        indices: indexBuffer,
    };
}

function drawScene(gl, programInfo, buffers, deltaTime, now){

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);

    // enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // near things obscure far things
    gl.depthFunc(gl.LEQUAL);

    // clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // produce projection matrix
    const fieldOfView = 45 * Math.PI / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix,
                    fieldOfView,
                    aspect,
                    zNear,
                    zFar);    
                    
    // produce model view matrix
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 0.0, -6.0]);  // amount to translate

    // translate model view matrix    
    mat4.translate(modelViewMatrix,
                   modelViewMatrix,
                   [-0.0, 0.0, 1.0])
    
    // rotate modelviewmatrix around x-axis
    //cubeRotation_x += deltaTime;
    mat4.rotate(modelViewMatrix,
                modelViewMatrix,
                cubeRotation_x,
                [1.0, 0.0, 0.0]);

    // rotate modelviewmatrix around y-axis
    cubeRotation_y += deltaTime*0.3;
    mat4.rotate(modelViewMatrix,
                modelViewMatrix,
                cubeRotation_y,
                [0.0, 1.0, 0.0]);

    // rotate modelviewmatrix around z-axis
    //cubeRotation_z += deltaTime;
    mat4.rotate(modelViewMatrix,
                modelViewMatrix,
                cubeRotation_z,
                [0.0, 0.0, 1.0]);
        
    // setup transfer from position buffer to vertexPosition attribute
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // setup transfer from color buffer to vertexColor attribute
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    // setup transfer from texture buffer to aTexCoord attribute
    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord)
        gl.vertexAttribPointer(
            programInfo.attribLocations.texCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset
        )
        gl.enableVertexAttribArray(programInfo.attribLocations.texCoord);
    }

    //specify program to be used
    gl.useProgram(programInfo.program);

    // set uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
        
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    gl.uniform1f(programInfo.uniformLocations.time, now);

    gl.uniform1f(programInfo.uniformLocations.x_rot, cubeRotation_x);
    gl.uniform1f(programInfo.uniformLocations.y_rot, cubeRotation_y);
    gl.uniform1f(programInfo.uniformLocations.z_rot, cubeRotation_z);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}