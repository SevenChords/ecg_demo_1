<!DOCTYPE html>
<html>
    <head>
        <title>Book-Of-Shaders Config</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.min.js" integrity="sha384-kjU+l4N0Yf4ZOJErLsIcvOU2qSb74wXpOhqTvwVx3OElZRweTnQ6d31fXEoRD1Jy" crossorigin="anonymous"></script>
       <style>
            label{
                display:block;
                margin-top:20px;
            }
            .fs-6{
                font-size:.7rem !important;
            }
        </style>
    </head>
<body>


<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Variable Naming-Rules</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Fragment-Color: <code>gl_FragColor</code>
        <br>
        Main-Method in Fragment-Shader: <code>void main() {}</code>
        <br>
        Varying Variables (when using our default vertex shader):<br>
        <code>
        varying vec2 vUv;<br>
varying lowp vec4 vColor;<br>
varying vec2 vTexCoord;<br>
varying float vTime;<br>
varying vec3 vNormal;<br>
        </code>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
<div class="container">


    <div class="col-md-6 offset-0 col-12 offset-md-3">
        <form action="upload.php" method="post" enctype="multipart/form-data">
            <h1>Expand your Book-Of-Shaders</h1>
            <p>With the following form you can upload your own shader- and marker- source code to add it to the Book-Of-Shaders.</p>
            Select files to upload and specify a Shader-Name:

                <div class="d-flex align-items-center">
                <i class="fs-1 bi bi-exclamation-triangle pe-3"></i>
                <p class="m-0">Mind the correct variable names and rules to have your shader running correctly</p>
                </div>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary text-center mx-auto d-inline-block" data-bs-toggle="modal" data-bs-target="#exampleModal">
            See rules
            </button>
            <label for="">Marker (.patt)</label>
            <div class="input-group">
                <input type="file" class="form-control" name="marker" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" required>
            </div>
            <label for="">Fragment Shader (.fs)</label>
            <div class="input-group">
                <input type="file" class="form-control" name="fs" id="inputGroupFileAddon045" aria-describedby="inputGroupFileAddon045" aria-label="Upload" required>
            </div>
            <label for="">Vertex Shader (.vs, leave emtpy for using  <a href="default_vertex.vs">default vertex shader</a>)</label>
            <div class="input-group">
                <input type="file" class="form-control" name="vs" id="inputGroupFile06" aria-describedby="inputGroupFile06" aria-label="Upload" >
            </div>
            <label for="">Shader-Geometry</label>
            <div class="form-check">
                <input class="form-check-input" type="radio" value="box" name="geometry" id="flexRadioDefault1">
                <label class="form-check-label" for="flexRadioDefault1">
                    Box
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" value="plane" name="geometry" id="flexRadioDefault2" checked>
                <label class="form-check-label" for="flexRadioDefault2">
                    Plane
                </label>
            </div>
            <label for="">Shader-Name</label>
            <input type="text" name="shader_name" class="form-control" required>
            <label for="">Comment (optional, displayed beneath the shader)</label>
            <textarea  name="comment" class="form-control" ></textarea>
            <label for="">Your Name ( will appear as 'creator')</label>
            <input type="text" name="created_by" class="form-control" required>


            <input type="submit" value="Upload Shader" name="submit" class="btn btn-outline-primary text-center mx-auto d-block mt-5">

        </form>

        <hr class="my-5">

        <h1>Existing Shaders</h1>
        <ul class="list-group mb-5">
            <?php
            require_once("ShaderClass.php");
            $shaders = Shader::getShaders();
            foreach($shaders as $shader){
                echo '
                <li class="list-group-item d-flex justify-content-between">
                    <h5 class="mb-0">'.$shader->displayName.'</h5>
                    <h5 class="mb-0 text-secondary fs-6">by '.$shader->created_by.'</h5>
                </li>
            ';
            }
            ?>
           

</ul>
    </div>

  



</div>


</body>
</html>