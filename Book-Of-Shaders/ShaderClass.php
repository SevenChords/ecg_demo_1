<?php

class Shader{
    public $fsSource = "";
    public $vsSource = "";
    public $name = "";
    public $displayName = "";
    public $marker = "";
    public $created_by = "";
    public $geometry = "";
    public $comment = "";

    function __construct($fsSource, $vsSource, $name, $displayName, $created_by, $geometry, $comment){
        $this->fsSource = $fsSource;
        $this->vsSource = $vsSource;
        $this->name = $name;
        $this->displayName = $displayName;
        $this->created_by = $created_by;
        $this->geometry = $geometry;
        $this->comment = $comment;
        $this->marker = "$name.patt";
    }

     /**
     * Returns array of all Shaders available. Array objects are of type Shader
     *
     * @var array
     */
    public static function getShaders(){
        require_once("ShaderConfig.php");
       
        $shaders = array();

        foreach($config as $key => $shaderConfig){
            $base = $key;
            $name = explode(".", $base)[0];
            $vsShader = "shaders/$name.vs";
            $fsShader = "shaders/$name.fs";
            $displayName = $shaderConfig->name ?? $name;
            $created_by = $shaderConfig->created_by;
            $geometry = $shaderConfig->geometry;
            $comment = $shaderConfig->comment;
            $shaderObject = new Shader(file_get_contents($fsShader), file_get_contents($vsShader), $name, $displayName, $created_by, $geometry, $comment);
            array_push($shaders, $shaderObject);
        }
        return $shaders;
    }
}