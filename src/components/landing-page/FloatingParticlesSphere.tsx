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
    const starts = new Float32Array(count * 3); // per-particle start position (assembly)
    const assembleSpeed = new Float32Array(count); // per-particle assembly speed factor
    const assembleDelay = new Float32Array(count); // per-particle assembly delay

    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        const y = ((i * offset) - 1) + (offset / 2);
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;

        const x = Math.cos(phi) * r;
        const z = Math.sin(phi) * r;

        // Set target positions on sphere SURFACE (clean final sphere)
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

        // Assembly animation: initialize start positions biased toward camera side (positive Z)
        // Spread X/Y to appear as if coming from viewer side edges
        const jitterX = (Math.random() * 2 - 1) * 2.5;
        const jitterY = (Math.random() * 2 - 1) * 2.5;
        const forwardZ = 8 + Math.random() * 2; // in front of the sphere toward camera

        starts[i * 3 + 0] = x * 3 + jitterX;
        starts[i * 3 + 1] = y * 3 + jitterY;
        starts[i * 3 + 2] = z + forwardZ;

        // Individual assembly speeds and delays
        assembleSpeed[i] = 0.6 + Math.random() * 1.0; // 0.6..1.6
        assembleDelay[i] = Math.random() * 0.4; // 0..0.4 of progress offset
    }

    return { pts, speeds, axes, colors, starts, assembleSpeed, assembleDelay };
}

// ---------- Shaders (Points for maximum perf)
const vertexShader = `
  uniform float uTime;
  uniform float uAssemble; // 0..1 assembly progress, driven by scroll
  attribute float aSpeed;
  attribute vec3 aAxis;
  attribute vec3 aColor;
  attribute vec3 aStart;
  attribute float aAssembleSpeed;
  attribute float aAssembleDelay;
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
    // Target position on sphere
    vec3 target = position;
    
    // Per-particle assembly progress with delay and speed, eased
    float pr = clamp((uAssemble - aAssembleDelay) / max(1e-4, (1.0 - aAssembleDelay)), 0.0, 1.0);
    // Map aAssembleSpeed (0.6..1.6) to an exponent (1.6..0.6): higher speed -> lower exponent -> faster to 1
    float exponent = 2.2 - clamp(aAssembleSpeed, 0.0, 2.2);
    float k = pow(pr, exponent);
    k = k * k * (3.0 - 2.0 * k); // additional ease
    
    // Interpolate from start (camera side) to target
    vec3 p = mix(aStart, target, k);
    
    // Global sphere rotation only after assembly complete
    float globalRotation = uTime * 0.1 * step(0.999, k); // rotate once k ~ 1
    mat3 globalRot = rotation3d(vec3(0.0, 1.0, 0.0), globalRotation);
    p = globalRot * p;
    
    // Disable individual drift until assembled
    float angle = uTime * aSpeed * 0.05 * step(0.999, k); // drift only when done
    p = rotation3d(aAxis, angle) * p;

    // perspective-correct size with slightly larger particles
    float dist = length((modelViewMatrix * vec4(p, 1.0)).xyz);
    float size = 0.25 / dist;
    
    // Enhanced distance-based alpha with better falloff, fade in with assembly
    float baseAlpha = clamp(3.5 / dist, 0.1, 1.0);
    // Keep fully hidden until animation actually starts; then fade in quickly
    vAlpha = baseAlpha * (uAssemble <= 0.0 ? 0.0 : smoothstep(0.0, 0.3, uAssemble));
    
    // Pass color to fragment shader
    vColor = aColor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    // Grow size from 0 to full during assembly to avoid popping in from nowhere
    float baseSize = max(size * 36.0, 0.9);
    float sizeEase = smoothstep(0.0, 0.35, k);
    gl_PointSize = baseSize * sizeEase;
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
function ParticleSphere({ count = 5000, baseRadius = 1, assembleProgressRef }: { count?: number; baseRadius?: number; assembleProgressRef?: React.MutableRefObject<number> }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { pts, speeds, axes, colors, starts, assembleSpeed, assembleDelay } = useMemo(() => fibonacciSpherePoints(count, baseRadius), [count, baseRadius]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
        geo.setAttribute("aAxis", new THREE.BufferAttribute(axes, 3));
        geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
        geo.setAttribute("aStart", new THREE.BufferAttribute(starts, 3));
        geo.setAttribute("aAssembleSpeed", new THREE.BufferAttribute(assembleSpeed, 1));
        geo.setAttribute("aAssembleDelay", new THREE.BufferAttribute(assembleDelay, 1));
        return geo;
    }, [pts, speeds, axes, colors, starts, assembleSpeed, assembleDelay]);

    const uniforms = useMemo(() => ({ uTime: { value: 0 }, uAssemble: { value: 0 } }), []);

    useFrame((_, dt) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += dt;
            if (assembleProgressRef) {
                materialRef.current.uniforms.uAssemble.value = assembleProgressRef.current;
            }
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
    sectionThreeRef: React.RefObject<HTMLDivElement | null>;
    insideTextRef: React.RefObject<HTMLDivElement | null>;
    sphereTitleRef: React.RefObject<HTMLHeadingElement | null>;
    sphereDescriptionRef: React.RefObject<HTMLParagraphElement | null>;
}

function Scene({ sectionOneRef, sectionTwoRef, sectionThreeRef, insideTextRef, sphereTitleRef, sphereDescriptionRef }: SceneProps) {
    const group = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const assembleProgress = useRef(0);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Initial camera setup
        camera.position.set(0, 0, 6);
        camera.lookAt(0, 0, 0);

        if (!sectionOneRef.current || !sectionTwoRef.current || !sectionThreeRef.current || !group.current ||
            !insideTextRef.current || !sphereTitleRef.current || !sphereDescriptionRef.current) return;

        // 1) Sphere scale animation (only during Section 1)
        gsap.fromTo(group.current.scale,
            { x: 0.8, y: 0.8, z: 0.8 },
            {
                x: 8, y: 8, z: 8,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionTwoRef.current,
                    start: "top top",
                    end: () => `+=${sectionTwoRef.current!.offsetHeight + sectionThreeRef.current!.offsetHeight * 0.5}`,
                    scrub: 1,
                }
            }
        );

        // 2) Camera zoom animation (start on Section 2, extend into half of Section 3)
        gsap.fromTo(camera.position,
            { z: 6 },
            {
                z: 0.5,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionTwoRef.current,
                    start: "top bottom",
                    end: () => `+=${sectionTwoRef.current!.offsetHeight + sectionThreeRef.current!.offsetHeight * 0.5}`,
                    scrub: 1,
                }
            }
        );

        // 3) Assembly trigger: when half of section enters viewport, animate uAssemble 0->1
        gsap.fromTo(assembleProgress, { current: 0 }, {
            current: 1,
            ease: "power2.out",
            duration: 3.5,
            scrollTrigger: {
                trigger: sectionOneRef.current,
                start: "50% bottom",
                once: true,
            }
        });

        // 4) Text container show (last half of Section 2)
        gsap.fromTo(insideTextRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionThreeRef.current,
                    start: "40% bottom",
                    end: "45% bottom",
                    scrub: 1,
                }
            }
        );

        // 5) Title animation (last half of Section 2)
        gsap.fromTo(sphereTitleRef.current,
            { opacity: 0, y: 32, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionThreeRef.current,
                    start: "45% bottom",
                    end: "50% bottom",
                    scrub: 1,
                }
            }
        );

        // 6) Description animation (last half of Section 2)
        gsap.fromTo(sphereDescriptionRef.current,
            { opacity: 0, y: 24, filter: "blur(4px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionThreeRef.current,
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
        <group ref={group} scale={[0.8, 0.8, 0.8]}>
            <ParticleSphere count={35000} baseRadius={1} assembleProgressRef={assembleProgress} />
        </group>
    );
}

// ---------- Page Scaffolding  
export default function ParticleSphereScroll() {
    // Refs for scroll sections
    const sectionOneRef = useRef<HTMLDivElement>(null);
    const sectionTwoRef = useRef<HTMLDivElement>(null);
    const sectionThreeRef = useRef<HTMLDivElement>(null);

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

                    <Scene sectionOneRef={sectionOneRef} sectionTwoRef={sectionTwoRef} sectionThreeRef={sectionThreeRef} insideTextRef={insideTextRef} sphereTitleRef={sphereTitleRef} sphereDescriptionRef={sphereDescriptionRef} />
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
            <div ref={sectionThreeRef} className="h-screen bg-blue-500"></div>
        </div>
    );
}
