import * as THREE from 'three'
import {color} from '../config/index'
export default class Fly{
  constructor(scene,time){
    this.scene=scene
    this.time=time
    this.config={
      height:250,
      color:new THREE.Color(color.wallColor),
      source:{
        x:300,
        y:0,
        z:-300
      },
      target:{
        x:-600,
        y:0,
        z:-250
      },
      range:25
    }
    this.creatFly()
  }
  creatFly(){
    const source= new THREE.Vector3(this.config.source.x,this.config.source.y,this.config.source.z)
    const target= new THREE.Vector3(this.config.target.x,this.config.target.y,this.config.target.z)
    const mid = new THREE.Vector3()
    mid.addVectors(source,target).multiplyScalar(0.5)
    mid.y=this.config.height
    const curve = new THREE.QuadraticBezierCurve3(source,mid,target)
    const len = parseInt(source.distanceTo(target))

    const points = curve.getPoints(len*2)
    const position=[]
    const a_position=[]
    points.forEach((p,index)=>{
      position.push(p.x,p.y,p.z)
      a_position.push(index)
    })
    console.log(len, 'len')
    const vertices =new Float32Array(position)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3))
    geometry.setAttribute('a_position',new THREE.Float32BufferAttribute(a_position,1))
    const material = new THREE.ShaderMaterial( {
      uniforms:{
        u_time:this.time,
        u_color:{
          value:this.config.color
        },
        u_height:{
          value:this.config.height
        },
        u_range:{
          value:250
        },
        u_total:{
          value:len*2
        },
        u_size:{
          value:35
        }
      },
      vertexShader:`
        attribute float a_position;
        varying float capcity;      
        uniform float u_time;
        uniform float u_total;
        uniform float u_range;
        uniform float u_height;     
        uniform float u_size;     
        void main(){
          float Fsize=u_size;
          float r=u_total*mod(u_time,1.0);
          if(a_position>r&&a_position<r+u_range){
            float newR = (a_position+u_range-u_total)/u_range;
            Fsize=u_size*newR;
            capcity=1.0;
          }else{
            capcity=0.0;
          }
          gl_PointSize = Fsize/10.0;
          gl_Position= projectionMatrix *modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader:`
        varying float capcity;
        uniform vec3 u_color;
        void main(){
          gl_FragColor= vec4(u_color,capcity);
        }
      `,
      // side:THREE.DoubleSide,
      depthTest:false,
      transparent:true
    } );
    const curveObject = new THREE.Points( geometry, material );
		this.scene.add( curveObject )
  }
}