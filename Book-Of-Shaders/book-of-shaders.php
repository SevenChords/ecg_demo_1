<!DOCTYPE html>
<html>
<?php

require_once("ShaderClass.php");

$shaders = Shader::getShaders();

?>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script>
  <!-- and it's easy to individually load additional languages -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/languages/go.min.js"></script>

  <style>
    #shader-popup {
      margin: 0;
      width: 100vw;
      height: 100vh;
      overflow: scroll;
      padding: 40px;
      background-color: white;
      position: fixed;
      top: 5vh;
      left: 5vw;
      z-index: 100000;
    }

    #shadercode {
      overflow: scroll;
    }

    .comment {
      color: rgb(168, 168, 168);
    }

    @media only screen and (max-width: 800px) {
      #shader-popup {
        margin: 0;
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        padding: 40px;
        background-color: white;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100000;
      }


    }
  </style>
</head>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<!-- we import arjs version without NFT but with marker + location based support -->
<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
<script>
  // sourcecode for vertex shader
 
let shaders = JSON.parse(JSON.stringify(<?php echo json_encode($shaders)?>));
console.log(shaders);
for (let i = 0; i < shaders.length; i++) {
  const shader = shaders[i];
  AFRAME.registerShader(shader.name, {
    schema: {
      color: { type: 'color', is: 'uniform' },
      timeMsec: { type: 'time', is: 'uniform' }
    },

    vertexShader: shader.vsSource,
    fragmentShader: shader.fsSource
  });
}



  let timesClicked = 0;
  let activeIndex = -1;
 


  AFRAME.registerComponent('clickhandler', {
    schema: {
      txt: { default: '-1' }
    },
    init: function () {
      var data = this.data;
      var el = this.el;
      el.addEventListener('click', function () {
       
        let fs, vs;
        fs = shaders[data.txt].fsSource;
        vs = shaders[data.txt].vsSource;
        alert(data.txt);
        activeIndex = data.txt;
        document.getElementById("fs-display").innerHTML = fs;
        document.getElementById("vs-display").innerHTML = vs;
        document.getElementById("shader-popup").style.display = "block";
        hljs.highlightAll();
        
      });
    }
  });
 
 

</script>
<script >
  
</script>
<body style="margin : 0px; overflow: hidden;">

  <div  id="shader-popup" style="display:none">
    <div class="d-flex justify-content-between">
      <h4>Shadercode</h4>
      <h5 onclick="closePopup()">X</h5>
    </div>
    <p>
    <h1>Fragment Shader</h1>
    <button class='btn btn-outline-secondary mb-2' id='copy-fs' onclick="copyShaderToClipboard('fs')">Code kopieren</button>
    <pre > <code id="fs-display"></code></pre>
    <h1>Vertex Shader</h1>
    <button class='btn btn-outline-secondary mb-2'' id='copy-vs' onclick="copyShaderToClipboard('vs')">Code kopieren</button>
    <pre><code  id="vs-display"></code></pre>
    </p>
    
   
  </div>
  <a-scene embedded  arjs>
  <?php
  $i = -1;
    foreach($shaders as $shader){
      $i++;
      echo '
      <a-marker type="pattern" url="markers/'.$shader->marker.'">
        <a-'.$shader->geometry.'  rotation="-90 0 0" clickhandler="txt:'.$i.'" position="0 0 0" scale="2 1.5 1" material="shader: '.$shader->name.'"></a-'.$shader->geometry.'>

        <a-text value="'.$shader->displayName.'" rotation="-90 0 0" position="-1 0 -1.05" ></a-text>
        <a-text value="Created by: '.$shader->created_by.'" rotation="-90 0 0" position="-1 0 -0.85" ></a-text>
        <a-text value="'.$shader->comment.'" wrap-count="40" rotation="-90 0 0" position="-1 0 0.9" scale="0.4 0.6 1" baseline="top" ></a-text>
     
      </a-marker>';
    }
    ?>

    

   
<a-entity camera > </a-entity>
  <!-- set fuse to false, so you actually have to click and not just point at an element, since this will be more useful in this type of application -->
<a-cursor fuse="false"></a-cursor>
    
  </a-scene>


  <script defer>
   
    function closePopup() {

      document.getElementById("shader-popup").style.display = "none";
    }
   
    function copyShaderToClipboard(type){
    let shader = shaders[activeIndex];
   
    if(type == "vs"){
      text = shader.vsSource;
    }
    else if(type == "fs"){
      text = shader.fsSource;

    }

    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
      alert("In Zwischenablage kopiert");
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }
  </script>
</body>

</html>