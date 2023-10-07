import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
export default class Text{
  constructor(scene,cameraDir){
    this.scene=scene
    this.font=null
    this.cameraDir=cameraDir
    console.log(this.cameraDir, 'cameraDir')
    this.textInfo=[
      {
        text:'第一高楼',
        position:{
          x:-10,
          y:130,
          z:410
        }
      },
      {
        text:'第二高楼',
        position:{
          x:180,
          y:110,
          z:-70
        }
      }
    ]
    this.init()
  }
  init(){
    const loader = new FontLoader();
    loader.load('../../public/font.json',font=>{
      this.font=font
      this.textInfo.forEach(t=>{
        this.createText(t)
      })
    })
  }
  createText(t){
    const geometry = new TextGeometry( t.text, {
      font: this.font,
      size: 20,
      height: 2,
      curveSegments: 2,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 2,
      bevelSegments: 2
    })
    const material = new THREE.ShaderMaterial( {
      uniforms:{
        u_cameraDir:{
          value:this.cameraDir
        }
      },
      vertexShader:`
        unform vec3 u_cameraDir;      
        void main(){
          vec3 v_position=u_cameraDir*position'
          gl_Position= projectionMatrix *modelViewMatrix * vec4(v_position, 1.0);
        }
      `,
      fragmentShader:`
        void main(){
          gl_FragColor= vec4(u_color,capcity);
        }
      `,
      // side:THREE.DoubleSide,
      depthTest:false,
      transparent:true
    } );
    const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial())
    mesh.position.copy(t.position)
    this.scene.add(mesh)
  }
}