"use client"

import React, { useMemo, useRef, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ---------- Utilities
function fibonacciSpherePoints(count = 5000, radius = 1) {
    const pts = new Float32Array(count * 3);
    const speeds = new Float32Array(count); // per-particle angular speed
    const axes = new Float32Array(count * 3); // per-particle axis of rotation
    const colors = new Float32Array(count * 3); // per-particle color

    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        const y = ((i * offset) - 1) + (offset / 2);
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;

        const x = Math.cos(phi) * r;
        const z = Math.sin(phi) * r;

        pts[i * 3 + 0] = x * radius;
        pts[i * 3 + 1] = y * radius;
        pts[i * 3 + 2] = z * radius;

        // speed: much slower for subtle movement
        speeds[i] = 0.2 + Math.random() * 0.2;

        // random rotation axis (normalized)
        const ax = Math.random() * 2 - 1;
        const ay = Math.random() * 2 - 1;
        const az = Math.random() * 2 - 1;
        const len = Math.hypot(ax, ay, az) || 1;
        axes[i * 3 + 0] = ax / len;
        axes[i * 3 + 1] = ay / len;
        axes[i * 3 + 2] = az / len;

        // Assign colors based on distribution
        const rand = Math.random();
        if (rand < 0.25) {
            // #1f59f9 = 25% of particles
            colors[i * 3 + 0] = 0.122; // 31/255
            colors[i * 3 + 1] = 0.349; // 89/255  
            colors[i * 3 + 2] = 0.976; // 249/255
        } else if (rand < 0.5) {
            // #2bc491 = 25% of particles
            colors[i * 3 + 0] = 0.169; // 43/255
            colors[i * 3 + 1] = 0.769; // 196/255
            colors[i * 3 + 2] = 0.569; // 145/255
        } else {
            // rgb(31, 213, 249) = 50% of particles
            colors[i * 3 + 0] = 0.122; // 31/255
            colors[i * 3 + 1] = 0.835; // 213/255
            colors[i * 3 + 2] = 0.976; // 249/255
        }
    }

    return { pts, speeds, axes, colors };
}

// ---------- Shaders (Points for maximum perf)
const vertexShader = `
  uniform float uTime;
  attribute float aSpeed;
  attribute vec3 aAxis;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;

  // rotate a point around an arbitrary axis through the origin
  mat3 rotation3d(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(
      oc*axis.x*axis.x + c,         oc*axis.x*axis.y - axis.z*s, oc*axis.z*axis.x + axis.y*s,
      oc*axis.x*axis.y + axis.z*s,  oc*axis.y*axis.y + c,        oc*axis.y*axis.z - axis.x*s,
      oc*axis.z*axis.x - axis.y*s,  oc*axis.y*axis.z + axis.x*s, oc*axis.z*axis.z + c
    );
  }

  void main(){
    vec3 p = position;
    
    // Global sphere rotation to the right (around Y-axis)
    float globalRotation = uTime * 0.1; // slow rotation speed
    mat3 globalRot = rotation3d(vec3(0.0, 1.0, 0.0), globalRotation);
    p = globalRot * p;
    
    // Individual particle random movement (much smaller)
    float angle = uTime * aSpeed * 0.05; // very subtle random drift
    p = rotation3d(aAxis, angle) * p;

    // perspective-correct size with very small, high-quality particles
    float dist = length((modelViewMatrix * vec4(p, 1.0)).xyz);
    float size = 0.4 / dist; // 2x smaller particles for ultra-premium quality
    
    // Enhanced distance-based alpha with better falloff
    vAlpha = clamp(3.5 / dist, 0.1, 1.0);
    
    // Pass color to fragment shader
    vColor = aColor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = max(size * 30.0, 0.5); // 2x smaller particles with lower minimum
  }
`;

const fragmentShader = `
  precision highp float;
  varying float vAlpha;
  varying vec3 vColor;
  void main(){
    // Ultra-high quality micro particles with perfect circles
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    
    // Perfect circular mask with premium antialiasing
    float mask = 1.0 - smoothstep(0.25, 0.5, r);
    
    // Enhanced radial gradient for depth and quality - gentle to preserve colors
    float brightness = pow(1.0 - r * 2.0, 1.2);
    brightness = clamp(brightness, 0.6, 1.0); // High minimum to preserve color distinction
    
    // Very subtle core highlight to maintain premium look without washing out colors
    float core = exp(-r * 6.0) * 0.15;
    
    // Apply brightness while preserving color identity
    vec3 finalColor = vColor * brightness + vColor * core;
    
    gl_FragColor = vec4(finalColor, vAlpha * mask);
  }
`;

// ---------- Points Mesh
function ParticleSphere({ count = 6000, baseRadius = 1 }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { pts, speeds, axes, colors } = useMemo(() => fibonacciSpherePoints(count, baseRadius), [count, baseRadius]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
        geo.setAttribute("aAxis", new THREE.BufferAttribute(axes, 3));
        geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [pts, speeds, axes, colors]);

    const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

    useFrame((_, dt) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += dt;
        }
    });

    return (
        <points geometry={geometry} frustumCulled>
            {/* @ts-ignore */}
            <shaderMaterial ref={materialRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                depthWrite={false}
                transparent
            />
        </points>
    );
}

// ---------- Scroll Scene Wrapper
function Scene() {
    const group = useRef<THREE.Group>(null);
    const { camera } = useThree();

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Initial camera setup
        camera.position.set(0, 0, 6);
        camera.lookAt(0, 0, 0);

        const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
                trigger: "#scroll-stage",
                start: "top top",
                end: "+=2000", // longer scroll area for slower zoom-in animation
                scrub: true,
                pin: true,
            },
        });

        // 1) Grow sphere 
        tl.to(group.current!.scale, { x: 8, y: 8, z: 8, duration: 5 }, 0);

        // 2) Move camera forward into the sphere
        tl.to(camera.position, { z: 0.5, duration: 5 }, 0.4);

        // 3) Drift camera slightly for parallax feel
        tl.to(camera.position, { x: 0.6, y: -0.3, duration: 0.8 }, 0.8);

        // 4) Optional: fade in text when inside (show much sooner)
        tl.to("#inside-text", { autoAlpha: 1, y: 0, duration: 0.6 }, 1);

        return () => {
            tl.scrollTrigger && tl.scrollTrigger.kill();
            tl.kill();
        };
    }, [camera]);

    return (
        <group ref={group} scale={[0.05, 0.05, 0.05]}>
            <ParticleSphere count={24000} baseRadius={1} />
            {/* optional faint core glow */}
            <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#000" transparent opacity={0.05} />
            </mesh>
        </group>
    );
}

// ---------- Page Scaffolding
export default function ParticleSphereScroll() {
    return (
        <div className="relative w-full bg-black text-white">
            {/* Scroll stage pinned during the animation */}
            <section id="scroll-stage" className="sticky top-0 h-screen w-full">
                <Canvas camera={{ fov: 60, near: 0.1, far: 100 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
                    <color attach="background" args={[0x000000]} />
                    <fog attach="fog" args={[0x000000, 5, 50]} />

                    <Scene />
                </Canvas>

                {/* Inside-sphere CTA/Text */}
                <div id="inside-text" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 translate-y-6">
                    <div className="mx-auto max-w-2xl text-center px-6">
                        <h2 className="text-3xl md:text-5xl font-light tracking-tight">
                            Bring ML to your trading
                        </h2>
                        <p className="mt-4 text-white/70">
                            Our Machine Learning models are trained on thousands of trades to boost algorithm performance.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
