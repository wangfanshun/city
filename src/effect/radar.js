import * as THREE from 'three'
import {color} from '../config/index'
export default class Radar{
  constructor(scene,time){
    this.scene=scene
    this.time=time
    this.init()
  }

  init(){
    const geometry = new THREE.CircleGeometry( 50, 32 );
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_radar_color:{
          value:new THREE.Color(color.radarColor)
        },
        u_time:this.time,
        u_line_Width:{
          value:2
        }
      },
      side:THREE.DoubleSide,
      transparent: true,
      vertexShader:`
        varying vec3 v_position;
        void main(){
          v_position=position;
          gl_Position= projectionMatrix *modelViewMatrix * vec4(position, 1.0);
        }
      `,
    
      fragmentShader: `
        varying vec3 v_position;
        uniform float u_time;
        uniform float u_line_Width;
        uniform vec3 u_radar_color;
        void main(){
          vec3 baseColor = u_radar_color;
          float capcity = 1.0;
          float dis = distance(v_position,vec3(0.0,0.0,0.0));
          float angle = atan(v_position.x, v_position.y);
          float new_angle = mod(angle + u_time, 3.1415926 * 2.0);
          if(dis<50.0-u_line_Width){
            capcity=1.0-new_angle;
          }
          gl_FragColor= vec4(baseColor,capcity);
        }
      `
    });
    const circle = new THREE.Mesh( geometry, material );
    circle.rotation.x=Math.PI/2
    circle.position.y=30
    circle.position.x=150
    circle.position.z=150
    this.scene.add( circle );
  }
}