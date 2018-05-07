import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';

//import './main.js';
import fragmentShader1 from './fragmentShader.frag';
import vertexShader1 from './vertexShader.frag';

import * as THREE from 'three'

class CanvasWebGL extends Component {

  constructor(props) {
    super(props);
    this.container = null;
    this.camera=null;
    this.scene=null;
    this.renderer=null;;
    this.uniforms = null;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  init() {
    this.container = document.getElementById( 'container' );

    this.camera = new THREE.Camera();
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    this.uniforms = {
      u_time: { type: "f", value: 1.0 },
      u_resolution: { type: "v2", value: new THREE.Vector2() },
      u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial( {
      uniforms: this.uniforms,
      //vertexShader: vertexShader1, //document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: "void main() {  gl_FragColor = vec4(1.0,0.0,1.0,1.0); }"//fragmentShader1 //document.getElementById( 'fragmentShader' ).textContent
    } );

    var mesh = new THREE.Mesh( geometry, material );
    this.scene.add( mesh );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.container.appendChild( this.renderer.domElement );

    this.onWindowResize();
    window.addEventListener( 'resize', this.onWindowResize, false );

    document.onmousemove = this.onMouseMove;
  }

  componentDidMount(){
        this.init();
        this.animate();
  }

  render() {
    return (
      <div>
        <h2>WEBGL</h2>
        <div id="container"></div>
      </div>
    );
  }

  onWindowResize( event ) {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
    this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    //console.log( { w: window.innerWidth, h:window.innerHeight });
  }

  onMouseMove( e ) {
    this.uniforms.u_mouse.value.x = e.pageX;
    this.uniforms.u_mouse.value.y = e.pageY
  }

  animate() {
    var that = this;
    requestAnimationFrame( function() { that.animate(); } );
    this.render2();
  }

  render2() {
    this.uniforms.u_time.value += 0.05;
    this.renderer.render( this.scene, this.camera );
  }
}

export default CanvasWebGL;
