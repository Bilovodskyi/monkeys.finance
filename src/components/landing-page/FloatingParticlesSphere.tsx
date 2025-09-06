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

        // Distribute particles throughout entire sphere volume
        // Use cube root for uniform volume distribution (not surface bias)
        const randomRadius = radius * Math.pow(Math.random(), 1 / 3);

        pts[i * 3 + 0] = x * randomRadius;
        pts[i * 3 + 1] = y * randomRadius;
        pts[i * 3 + 2] = z * randomRadius;

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
    float size = 0.2 / dist; // 2x smaller particles for ultra-premium quality
    
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
    // Create solid circular particles
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    
    // Sharp circular mask - solid inside, transparent outside
    float mask = step(r, 0.5);
    
    // Use the color as-is without any gradients or brightness modifications
    vec3 finalColor = vColor;
    
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
interface SceneProps {
    sectionOneRef: React.RefObject<HTMLDivElement | null>;
    sectionTwoRef: React.RefObject<HTMLDivElement | null>;
    insideTextRef: React.RefObject<HTMLDivElement | null>;
    sphereTitleRef: React.RefObject<HTMLHeadingElement | null>;
    sphereDescriptionRef: React.RefObject<HTMLParagraphElement | null>;
}

function Scene({ sectionOneRef, sectionTwoRef, insideTextRef, sphereTitleRef, sphereDescriptionRef }: SceneProps) {
    const group = useRef<THREE.Group>(null);
    const { camera } = useThree();

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Initial camera setup
        camera.position.set(0, 0, 6);
        camera.lookAt(0, 0, 0);

        if (!sectionOneRef.current || !sectionTwoRef.current || !group.current ||
            !insideTextRef.current || !sphereTitleRef.current || !sphereDescriptionRef.current) return;

        // 1) Sphere scale animation (Section 1 + half of Section 2 = 1.5 sections)
        gsap.fromTo(group.current.scale,
            { x: 0.4, y: 0.4, z: 0.4 },
            {
                x: 8, y: 8, z: 8,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionOneRef.current,
                    start: "top top",
                    end: () => `+=${sectionOneRef.current!.offsetHeight + sectionTwoRef.current!.offsetHeight * 0.5}`,
                    scrub: 1,
                }
            }
        );

        // 2) Camera zoom animation (Section 1 + half of Section 2 = 1.5 sections)
        gsap.fromTo(camera.position,
            { z: 6 },
            {
                z: 0.5,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionOneRef.current,
                    start: "top bottom",
                    end: () => `+=${sectionOneRef.current!.offsetHeight + sectionTwoRef.current!.offsetHeight * 0.5}`,
                    scrub: 1,
                }
            }
        );

        // 3) Text container show (last half of Section 2)
        gsap.fromTo(insideTextRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionTwoRef.current,
                    start: "40% bottom",
                    end: "45% bottom",
                    scrub: 1,
                }
            }
        );

        // 4) Title animation (last half of Section 2)
        gsap.fromTo(sphereTitleRef.current,
            { opacity: 0, y: 32, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionTwoRef.current,
                    start: "45% bottom",
                    end: "50% bottom",
                    scrub: 1,
                }
            }
        );

        // 5) Description animation (last half of Section 2)
        gsap.fromTo(sphereDescriptionRef.current,
            { opacity: 0, y: 24, filter: "blur(4px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionTwoRef.current,
                    start: "50% bottom",
                    end: "55% bottom",
                    scrub: 1,
                }
            }
        );


        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [camera, sectionOneRef, sectionTwoRef, insideTextRef, sphereTitleRef, sphereDescriptionRef]);

    return (
        <group ref={group} scale={[0.4, 0.4, 0.4]}>
            <ParticleSphere count={28000} baseRadius={1} />
        </group>
    );
}

// ---------- Page Scaffolding  
export default function ParticleSphereScroll() {
    // Refs for scroll sections
    const sectionOneRef = useRef<HTMLDivElement>(null);
    const sectionTwoRef = useRef<HTMLDivElement>(null);

    // Refs for text elements
    const insideTextRef = useRef<HTMLDivElement>(null);
    const sphereTitleRef = useRef<HTMLHeadingElement>(null);
    const sphereDescriptionRef = useRef<HTMLParagraphElement>(null);

    return (
        <div className="relative w-full bg-black text-white">
            {/* Scroll stage pinned during the animation */}
            <section ref={sectionOneRef} className="bg-green-500 sticky top-0 h-screen w-full">
                <Canvas camera={{ fov: 60, near: 0.1, far: 100 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
                    <color attach="background" args={[0x000000]} />
                    <fog attach="fog" args={[0x000000, 5, 50]} />

                    <Scene
                        sectionOneRef={sectionOneRef}
                        sectionTwoRef={sectionTwoRef}
                        insideTextRef={insideTextRef}
                        sphereTitleRef={sphereTitleRef}
                        sphereDescriptionRef={sphereDescriptionRef}
                    />
                </Canvas>

                {/* Inside-sphere CTA/Text */}
                <div ref={insideTextRef} className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
                    <div className="mx-auto max-w-2xl text-center px-6">
                        <h2 ref={sphereTitleRef} className="text-3xl md:text-5xl font-light tracking-tight opacity-0 translate-y-8 scale-95">
                            Bring ML to your trading
                        </h2>
                        <p ref={sphereDescriptionRef} className="mt-4 text-white/70 opacity-0 translate-y-6 blur-sm">
                            Our Machine Learning models are trained on thousands of trades to boost algorithm performance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Hidden scroll sections for tracking scroll progress */}
            <div ref={sectionTwoRef} className="h-screen bg-red-500"></div>
        </div>
    );
}
