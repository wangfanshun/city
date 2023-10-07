import * as THREE from 'three'
import {color} from '../config/index'
export default class Wall{
  constructor(scene,time){
    this.scene=scene
    this.time=time
    this.config={
      height:50,
      color:new THREE.Color(color.wallColor)
    }
    this.creatWall()
  }
  creatWall(){
    const geometry = new THREE.CylinderGeometry(this.config.height, this.config.height, 30,32, 32,true)
    const material = new THREE.ShaderMaterial( {
      uniforms:{
        u_time:this.time,
        u_color:{
          value:this.config.color
        },
        u_height:{
          value:this.config.height
        }
      },
      vertexShader:`
        varying float capcity;      
        uniform float u_time;
        uniform float u_height;        
        void main(){
          float coefficient = mod(u_time, 1.0);
          vec3 v_position = position*coefficient;
          capcity = position.y/u_height;
          gl_Position= projectionMatrix *modelViewMatrix * vec4(v_position, 1.0);
        }
      `,
      fragmentShader:`
        varying float capcity;
        uniform vec3 u_color;
        void main(){
          gl_FragColor= vec4(u_color,capcity);
        }
      `,
      side:THREE.DoubleSide,
      depthTest:false,
      transparent:true
    } );
    const cylinder = new THREE.Mesh( geometry, material );
    geometry.translate(0,25,0)
		this.scene.add( cylinder )
  }
}