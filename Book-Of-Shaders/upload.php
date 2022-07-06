<?php
require_once("ShaderConfig.php");

$shaderCount = count($config)+1;

$shader_config_name = "shader_$shaderCount";
$marker_target_dir = "markers/";
$shader_target_dir = "shaders/";

$marker_base = basename($_FILES["marker"]["name"]);
$vs_base = basename($_FILES["vs"]["name"]);
$fs_base = basename($_FILES["fs"]["name"]);

$marker_target_file = $marker_target_dir . "$shader_config_name.patt";
$vs_target_file = $shader_target_dir . "$shader_config_name.vs";
$fs_target_file = $shader_target_dir . "$shader_config_name.fs";



if(isset($_POST["submit"])) {
  
  if(
    isset($_FILES["fs"]) && 
    isset($_FILES["marker"]) && 
    isset($_POST["shader_name"]) &&
    isset($_POST["geometry"])
  ){
    //move upload vertex shader file or use default
    copy("default_vertex.vs", $vs_target_file);
    if(isset($_FILES["vs"])){
      move_uploaded_file($_FILES["vs"]["tmp_name"], $vs_target_file);

    }
    else{
      
    }
   
    move_uploaded_file($_FILES["fs"]["tmp_name"], $fs_target_file);
  
    move_uploaded_file($_FILES["marker"]["tmp_name"], $marker_target_file);
  
    
    $name = $_POST["shader_name"];
    $geometry = $_POST["geometry"];
    $created_by = $_POST["created_by"] ?? "";
    $comment = $_POST["comment"] ?? "";

    $o = new \stdClass();
    $o->name = $name;
    $o->created_by = $created_by;
    $o->geometry = $geometry;
    $o->comment = $comment;
    $config[$shader_config_name] = $o;

    file_put_contents("ShaderConfig.php", "<?php \n".'$config ='.var_export($config, true).";");
    
    echo "Shader has been uploaded!";
  }
  else{
    echo "missing input";
  }

  
}
