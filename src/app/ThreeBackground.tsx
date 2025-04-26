"use client"
import { useEffect } from 'react';
import * as THREE from 'three';

const Background = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    const particles: THREE.Mesh[] = [];

    const particleShader = {
      vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
            vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0,2,4));
            gl_FragColor = vec4(color, 1.0);
        }
      `
    };

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: particleShader.vertexShader,
      fragmentShader: particleShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });

    function createParticles(): void {
      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const particle = new THREE.Mesh(geometry, particleMaterial);
      scene.add(particle);
      particles.push(particle);
    }

    for (let i = 0; i < 500; i++) {
      createParticles();
    }

    particles.forEach(particle => {
      particle.position.x = Math.random() * 6 - 3;
      particle.position.y = Math.random() * 6 - 3;
      particle.position.z = Math.random() * 6 - 3;
    });

    const animate = (): void => {
      requestAnimationFrame(animate);
      particles.forEach((particle, index) => {
        const time = performance.now() * 0.0005 + index * 0.05;
        (particle.material as THREE.ShaderMaterial).uniforms.time.value = time;

        particle.position.x += Math.sin(time) * 0.01;
        particle.position.y += Math.cos(time) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default Background;
