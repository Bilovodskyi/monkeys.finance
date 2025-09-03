"use client"


import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedContainer from "./AnimatedContainer";

type Props = {
    className?: string;
    style?: React.CSSProperties;
};

const HowItWorksSection: React.FC<Props> = ({ className = "", style }) => {
    const sectionOne = useRef<HTMLDivElement>(null);
    const sectionTwo = useRef<HTMLDivElement>(null);
    const sectionThree = useRef<HTMLDivElement>(null);
    const sectionFour = useRef<HTMLDivElement>(null);
    const containerOne = useRef<HTMLDivElement>(null);
    const containerTwo = useRef<HTMLDivElement>(null);
    const containerThree = useRef<HTMLDivElement>(null);
    const containerFour = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Container One: progress-based animation through sectionOne
        if (sectionOne.current && containerOne.current) {
            gsap.fromTo(containerOne.current,
                { y: -300, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionOne.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1, // smooth scrubbing with 1 second lag
                    },
                }
            );
        }

        // Container Two: progress-based animation through sectionTwo
        if (sectionTwo.current && containerTwo.current) {
            gsap.fromTo(containerTwo.current,
                { y: -300, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionTwo.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                }
            );
        }

        // Container Three: progress-based animation through sectionThree
        if (sectionThree.current && containerThree.current) {
            gsap.fromTo(containerThree.current,
                { y: -300, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionThree.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                }
            );
        }

        // Container Four: progress-based animation through sectionFour
        if (sectionFour.current && containerFour.current) {
            gsap.fromTo(containerFour.current,
                { y: -300, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionFour.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div style={{ width: "100vw", ...style }} className={`relative ${className}`}>
            <div ref={sectionOne} className="w-full h-screen sticky top-0 z-30" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>



                <div>
                    <h2>Machine Learning Step</h2>
                    <h2>Backtest Trained Model</h2>
                </div>
                <AnimatedContainer
                    ref={containerOne}
                    title="Machine Learning step"
                    className="absolute right-[250px] bottom-[150px]"
                    showAnimatedClone={true}
                    showLightSweeps={true}
                />

                <AnimatedContainer
                    ref={containerTwo}
                    title="Data Processing step"
                    className="absolute right-[245px] bottom-[165px]"
                    showLightSweeps={false}
                />

                <AnimatedContainer
                    ref={containerThree}
                    title="Backtesting step"
                    className="absolute right-[240px] bottom-[180px]"
                    showAnimatedClone={false}
                    showLightSweeps={true}
                />

                <AnimatedContainer
                    ref={containerFour}
                    title="Results Analysis"
                    className="absolute right-[235px] bottom-[195px]"
                    showLightSweeps={false}
                />

            </div>
            <div ref={sectionTwo} className="h-screen "></div>
            <div ref={sectionThree} className="h-screen"></div>
            <div ref={sectionFour} className="h-screen"></div>

        </div>
    );
};

export default HowItWorksSection;
