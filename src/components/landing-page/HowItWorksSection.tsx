"use client"


import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedContainer from "./AnimatedContainer";
import StepProgressDot from "./StepProgressDot";
import { useTranslations } from "next-intl";

type Props = {
    className?: string;
    style?: React.CSSProperties;
};

const HowItWorksSection: React.FC<Props> = ({ className = "", style }) => {
    const t = useTranslations("howItWorks");

    const sectionOne = useRef<HTMLDivElement>(null);
    const sectionTwo = useRef<HTMLDivElement>(null);
    const sectionThree = useRef<HTMLDivElement>(null);
    const sectionFour = useRef<HTMLDivElement>(null);
    const containerOne = useRef<HTMLDivElement>(null);
    const containerTwo = useRef<HTMLDivElement>(null);
    const containerThree = useRef<HTMLDivElement>(null);
    const containerFour = useRef<HTMLDivElement>(null);
    const step1Ring = useRef<HTMLDivElement | null>(null);
    const line1 = useRef<HTMLDivElement>(null);
    const line2 = useRef<HTMLDivElement>(null);
    const line3 = useRef<HTMLDivElement>(null);

    // State for managing visual effects
    const [containerEffects, setContainerEffects] = useState({
        container1: { showAnimatedClone: false, showLightSweeps: false },
        container2: { showAnimatedClone: false, showLightSweeps: false },
        container3: { showAnimatedClone: false, showLightSweeps: false },
        container4: { showAnimatedClone: false, showLightSweeps: false },
    });

    // Track which step is currently active in the viewport
    const [activeStep, setActiveStep] = useState<number>(1);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Active step highlight triggers
        if (sectionOne.current) {
            ScrollTrigger.create({
                trigger: sectionOne.current,
                start: "top top",
                end: "bottom top",
                onEnter: () => setActiveStep(1),
                onEnterBack: () => setActiveStep(1),
            });
        }
        if (sectionTwo.current) {
            ScrollTrigger.create({
                trigger: sectionTwo.current,
                start: "top top",
                end: "bottom top",
                onEnter: () => setActiveStep(2),
                onEnterBack: () => setActiveStep(2),
            });
        }
        if (sectionThree.current) {
            ScrollTrigger.create({
                trigger: sectionThree.current,
                start: "top top",
                end: "bottom top",
                onEnter: () => setActiveStep(3),
                onEnterBack: () => setActiveStep(3),
            });
        }
        if (sectionFour.current) {
            ScrollTrigger.create({
                trigger: sectionFour.current,
                start: "top top",
                end: "bottom top",
                onEnter: () => setActiveStep(4),
                onEnterBack: () => setActiveStep(4),
            });
        }

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
                        onUpdate: (self) => {
                            // Turn on effects when animation is 90% complete
                            if (self.progress >= 0.9) {
                                setContainerEffects(prev => {
                                    if (!prev.container1.showAnimatedClone) {
                                        return {
                                            ...prev,
                                            container1: { showAnimatedClone: true, showLightSweeps: true }
                                        };
                                    }
                                    return prev;
                                });
                            } else if (self.progress < 0.9) {
                                // Reset effects when scrolling back
                                setContainerEffects(prev => {
                                    if (prev.container1.showAnimatedClone) {
                                        return {
                                            ...prev,
                                            container1: { showAnimatedClone: false, showLightSweeps: false }
                                        };
                                    }
                                    return prev;
                                });
                            }
                        },
                    },
                }
            );
        }

        // Step 1 ring animation tied to sectionOne scroll progress
        if (sectionOne.current && step1Ring.current) {
            ScrollTrigger.create({
                trigger: sectionOne.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    const cycles = 3; // number of pulses across the section
                    const t = (self.progress * cycles) % 1; // 0..1 within a cycle
                    const scale = 1 + 0.7 * t; // grow ring
                    const opacity = 0.6 * (1 - t); // fade as it grows
                    gsap.set(step1Ring.current, { scale, opacity, transformOrigin: "50% 50%" });
                },
            });
        }

        // Line animations - appear after their respective container animations finish
        if (line1.current) {
            gsap.set(line1.current, { scaleY: 0, transformOrigin: "top" });
            ScrollTrigger.create({
                trigger: sectionOne.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    // Line appears instantly when container one animation finishes (90% progress)
                    if (self.progress >= 0.9) {
                        gsap.set(line1.current, { scaleY: 1 });
                    } else {
                        gsap.set(line1.current, { scaleY: 0 });
                    }
                },
            });
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
                        onUpdate: (self) => {
                            // Turn off effects for container 1, turn on for container 2 when 90% complete
                            if (self.progress >= 0.9) {
                                setContainerEffects(prev => {
                                    if (!prev.container2.showAnimatedClone) {
                                        return {
                                            ...prev,
                                            container1: { showAnimatedClone: false, showLightSweeps: false },
                                            container2: { showAnimatedClone: true, showLightSweeps: true }
                                        };
                                    }
                                    return prev;
                                });
                            } else if (self.progress < 0.9) {
                                // Reset to previous state when scrolling back
                                setContainerEffects(prev => {
                                    if (prev.container2.showAnimatedClone) {
                                        return {
                                            ...prev,
                                            container1: { showAnimatedClone: true, showLightSweeps: true },
                                            container2: { showAnimatedClone: false, showLightSweeps: false }
                                        };
                                    }
                                    return prev;
                                });
                            }
                        },
                    },
                }
            );
        }

        // Line 2 animation - appears after container two animation finishes
        if (line2.current) {
            gsap.set(line2.current, { scaleY: 0, transformOrigin: "top" });
            ScrollTrigger.create({
                trigger: sectionTwo.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    // Line appears instantly when container two animation finishes (90% progress)
                    if (self.progress >= 0.9) {
                        gsap.set(line2.current, { scaleY: 1 });
                    } else {
                        gsap.set(line2.current, { scaleY: 0 });
                    }
                },
            });
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
                        onUpdate: (self) => {
                            // Turn off effects for container 2, turn on for container 3 when 90% complete
                            if (self.progress >= 0.9) {
                                setContainerEffects(prev => {
                                    if (!prev.container3.showAnimatedClone) {
                                        return {
                                            ...prev,
                                            container2: { showAnimatedClone: false, showLightSweeps: false },
                                            container3: { showAnimatedClone: true, showLightSweeps: true }
                                        };
                                    }
                                    return prev;
                                });
                            } else if (self.progress < 0.9) {
                                // Reset to previous state when scrolling back
                                setContainerEffects(prev => {
                                    if (prev.container3.showAnimatedClone) {
                                        return {
                                            ...prev,
                                            container2: { showAnimatedClone: true, showLightSweeps: true },
                                            container3: { showAnimatedClone: false, showLightSweeps: false }
                                        };
                                    }
                                    return prev;
                                });
                            }
                        },
                    },
                }
            );
        }

        // Line 3 animation - appears after container three animation finishes
        if (line3.current) {
            gsap.set(line3.current, { scaleY: 0, transformOrigin: "top" });
            ScrollTrigger.create({
                trigger: sectionThree.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    // Line appears instantly when container three animation finishes (90% progress)
                    if (self.progress >= 0.9) {
                        gsap.set(line3.current, { scaleY: 1 });
                    } else {
                        gsap.set(line3.current, { scaleY: 0 });
                    }
                },
            });
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
                        end: "bottom-=300px top",
                        scrub: 1,
                        onUpdate: (self) => {
                            // Turn off effects for container 3, turn on for container 4 when 90% complete
                            if (self.progress >= 0.9) {
                                setContainerEffects(prev => {
                                    if (!prev.container4.showAnimatedClone) {
                                        return {
                                            ...prev,
                                            container3: { showAnimatedClone: false, showLightSweeps: false },
                                            container4: { showAnimatedClone: true, showLightSweeps: true }
                                        };
                                    }
                                    return prev;
                                });
                            } else if (self.progress < 0.9) {
                                // Reset to previous state when scrolling back
                                setContainerEffects(prev => {
                                    if (prev.container4.showAnimatedClone) {
                                        return {
                                            ...prev,
                                            container3: { showAnimatedClone: true, showLightSweeps: true },
                                            container4: { showAnimatedClone: false, showLightSweeps: false }
                                        };
                                    }
                                    return prev;
                                });
                            }
                        },
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
            <div ref={sectionOne} className="w-full h-screen sticky top-0 z-30 overflow-hidden" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
                <div className="h-screen flex flex-col gap-4 justify-center pl-24 w-1/3">
                    <h2 className='text-3xl text-white font-title pb-8'>{t("title")} <span className='text-highlight'>{t("titleHighlight")}</span></h2>

                    <ul className="space-y-8 text-secondary text-lg">

                        <li className="flex items-center gap-4 relative">
                            <StepProgressDot triggerRef={sectionOne} label={1} size={28} />
                            <div ref={line1} className="w-[1px] h-28 bg-highlight absolute left-4 top-14"></div>
                            <div className="flex flex-col gap-2">

                                <h2 className={`${activeStep === 1 ? "text-white" : "text-secondary"} transition-colors`}>{t("step1.title")}</h2>
                                <p className="text-secondary">
                                    {t("step1.description")}
                                </p>
                            </div>
                        </li>
                        <li className="flex items-center gap-4 relative">
                            <StepProgressDot triggerRef={sectionTwo} label={2} size={28} />
                            <div ref={line2} className="w-[1px] h-28 bg-highlight absolute left-4 top-14"></div>

                            <div className="flex flex-col gap-2">

                                <h2 className={`${activeStep === 2 ? "text-white" : "text-secondary"} transition-colors`}>{t("step2.title")}</h2>
                                <p className="text-secondary">
                                    {t("step2.description")}
                                </p>
                            </div>
                        </li>
                        <li className="flex items-center gap-4 relative">
                            <StepProgressDot triggerRef={sectionThree} label={3} size={28} />
                            <div ref={line3} className="w-[1px] h-28 bg-highlight absolute left-4 top-14"></div>

                            <div className="flex flex-col gap-2">

                                <h2 className={`${activeStep === 3 ? "text-white" : "text-secondary"} transition-colors`}>{t("step3.title")}</h2>
                                <p className="text-secondary">
                                    {t("step3.description")}
                                </p>
                            </div>
                        </li>
                        <li className="flex items-center gap-4">
                            <StepProgressDot triggerRef={sectionFour} label={4} size={28} endOffset={200} />
                            <div className="flex flex-col gap-2">

                                <h2 className={`${activeStep === 4 ? "text-white" : "text-secondary"} transition-colors`}>{t("step4.title")}</h2>
                                <p className="text-secondary">
                                    {t("step4.description")}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <AnimatedContainer
                    ref={containerOne}
                    title={t("step1.containerTitle")}
                    className="absolute right-[250px] bottom-[200px]"
                    showAnimatedClone={containerEffects.container1.showAnimatedClone}
                    showLightSweeps={containerEffects.container1.showLightSweeps}
                />

                <AnimatedContainer
                    ref={containerTwo}
                    title={t("step2.containerTitle")}
                    className="absolute right-[245px] bottom-[220px]"
                    showAnimatedClone={containerEffects.container2.showAnimatedClone}
                    showLightSweeps={containerEffects.container2.showLightSweeps}
                />

                <AnimatedContainer
                    ref={containerThree}
                    title={t("step3.containerTitle")}
                    className="absolute right-[240px] bottom-[240px]"
                    showAnimatedClone={containerEffects.container3.showAnimatedClone}
                    showLightSweeps={containerEffects.container3.showLightSweeps}
                />

                <AnimatedContainer
                    ref={containerFour}
                    title={t("step4.containerTitle")}
                    className="absolute right-[235px] bottom-[260px]"
                    showAnimatedClone={containerEffects.container4.showAnimatedClone}
                    showLightSweeps={containerEffects.container4.showLightSweeps}
                />

            </div>
            <div ref={sectionTwo} className="h-screen "></div>
            <div ref={sectionThree} className="h-screen"></div>
            <div ref={sectionFour} className="h-screen"></div>

        </div>
    );
};

export default HowItWorksSection;
