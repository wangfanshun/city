
import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'
import {color} from '../config/index'
import * as THREE from 'three'
export default class SurroundLine{
  constructor(scene,child,height,time){
    this.scene=scene
    this.child=child
    this.height=height
    this.time=time
    this.createMesh()
    this.createLine()
  }
  createLine(){
    const edges = new THREE.EdgesGeometry( this.child.geometry )
    const { max, min } = this.child.geometry.boundingBox
    const material = new THREE. ShaderMaterial({
      uniforms:{
        u_line_color:{
          value:new THREE.Color(color.soundLine)
        },
        u_mesh_color: {
          value:new THREE.Color(color.mesh)
        },
        //线的颜色
        u_scan_color:{
          value:new THREE.Color(color.scanLine)
        },
        u_max:{
          value:max
        },
        u_min:{
          value:min
        },
        u_time:this.time
      },
      vertexShader:`
      varying vec3 v_color;
      uniform vec3 u_line_color;
      uniform vec3 u_scan_color;
      uniform vec3 u_max;
      uniform vec3 u_min;
      uniform float u_time;
      void main(){
        float new_time = mod(u_time * 0.1, 1.0);        
        float rangY=mix(u_min.y,u_max.y,new_time);
        if(position.y>rangY&&position.y<rangY+200.0){
          float grade = 1.0 - sin((position.y - rangY) / 200.0 * 3.14);
          v_color = mix(u_line_color,u_scan_color,grade);
        }else{
          v_color=u_line_color;
        };
        gl_Position= projectionMatrix *modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragmentShader:`
      varying vec3 v_color;         
      void main(){
        gl_FragColor= vec4(v_color, 1.0);
      }     
      `
    })
    const MeshLine = new THREE.LineSegments(edges,material)
    MeshLine.scale.copy(this.child.scale)
    MeshLine.rotation.copy(this.child.rotation)
    MeshLine.position.copy(this.child.position) 
    this.scene.add(MeshLine)
  }
  computedMesh(){
    this.child.geometry.computeBoundingBox()
    this.child.geometry.computeBoundingSphere()
  }
  createMesh(){
    this.computedMesh()
    const {max,min}= this.child.geometry.boundingBox
    const size =max.z-min.z
    const material = new THREE.ShaderMaterial({
      uniforms:{
        u_height:this.height,
        u_risingColor:{
          value:new THREE.Color(color.risingColor)
        },
        u_mesh_color: {
          value:new THREE.Color(color.mesh)
        },
        u_head_color: {
          value:new THREE.Color(color.head)
        },
        u_size:{
          value:size
        }
      },
      vertexShader:`
        varying vec3 v_position;
        void main(){
          v_position= position;
          gl_Position= projectionMatrix *modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader:`
        varying vec3 v_position;
        uniform vec3 u_mesh_color;
        uniform vec3 u_head_color;
        uniform vec3 u_risingColor;
        uniform float u_size;
        uniform float u_height;
        void main(){
          vec3 base_color = u_mesh_color;
          base_color = mix(base_color, u_head_color, v_position.z / u_size);
          if(v_position.z>u_height&&v_position.z<u_height+6.0){
            float r =(v_position.z-u_height)/3.0;
            base_color=mix(u_risingColor,u_mesh_color,abs(r-1.0));
          }
          gl_FragColor = vec4(base_color,1.0);
        }
      `
    })
    const mesh= new THREE.Mesh(this.child.geometry, material)
    mesh.position.copy(this.child.position)
    mesh.rotation.copy(this.child.rotation)
    mesh.scale.copy(this.child.scale)
    this.scene.add(mesh)
  }
}