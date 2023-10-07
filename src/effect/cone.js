import * as THREE from 'three'
import {color} from '../config/index'
export default class Cone{
  constructor(scene,height,top){
    this.scene=scene
    this.top=top
    this.height=height
    this.config={
      color:new THREE.Color(color.wallColor)
    }
    this.creatWall()
  }
  creatWall(){
    const geometry = new THREE.ConeGeometry(20,40,4,20,false,0,Math.PI*2)
    const material = new THREE.ShaderMaterial( {
      uniforms:{
        u_color:{
          value:this.config.color
        },
        u_height:this.height,
        u_top:this.top
      },
      vertexShader:`
        uniform float u_top;
        uniform float u_height;        
        void main(){
          float angle= u_height/10.0;
          float newX=position.x*cos(u_height/20.0)-position.z*sin(u_height/20.0);
          float newY=position.y;
          float newZ=position.z*cos(u_height/20.0)+position.x*sin(u_height/20.0);
          vec4 v_position = vec4(newX,newY+u_top,newZ,1.0);
          gl_Position= projectionMatrix *modelViewMatrix * v_position;
        }
      `,
      fragmentShader:`
        uniform vec3 u_color;
        void main(){
          gl_FragColor= vec4(u_color,1.0);
        }
      `,
      side:THREE.DoubleSide,
      depthTest:false,
      transparent:true
    } );
    const ball = new THREE.Mesh( geometry, material );
    ball.position.y=50
    console.log(ball.rotation)
    ball.rotation.z=Math.PI
		this.scene.add( ball )
  }
}