"use client"


import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
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

    // Track if we should show containers (desktop only)
    // Use lazy initializer to get correct value before first render
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return false;
    });

    // Check viewport size on mount and resize
    useEffect(() => {
        const checkViewport = () => {
            setIsDesktop(window.innerWidth >= 1024); // lg breakpoint (Tailwind)
        };
        
        checkViewport();
        window.addEventListener('resize', checkViewport);
        
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    // All animations - only run on desktop (lg breakpoint and above)
    useGSAP(() => {
        if (!isDesktop) {
            return;
        }
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

        // Step 1 ring animation
        if (sectionOne.current && step1Ring.current) {
            ScrollTrigger.create({
                trigger: sectionOne.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    const cycles = 3;
                    const t = (self.progress * cycles) % 1;
                    const scale = 1 + 0.7 * t;
                    const opacity = 0.6 * (1 - t);
                    gsap.set(step1Ring.current, { scale, opacity, transformOrigin: "50% 50%" });
                },
            });
        }

        // Line animations
        if (line1.current) {
            gsap.set(line1.current, { scaleY: 0, transformOrigin: "top" });
            ScrollTrigger.create({
                trigger: sectionOne.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    if (self.progress >= 0.9) {
                        gsap.set(line1.current, { scaleY: 1 });
                    } else {
                        gsap.set(line1.current, { scaleY: 0 });
                    }
                },
            });
        }

        if (line2.current) {
            gsap.set(line2.current, { scaleY: 0, transformOrigin: "top" });
            ScrollTrigger.create({
                trigger: sectionTwo.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    if (self.progress >= 0.9) {
                        gsap.set(line2.current, { scaleY: 1 });
                    } else {
                        gsap.set(line2.current, { scaleY: 0 });
                    }
                },
            });
        }

        if (line3.current) {
            gsap.set(line3.current, { scaleY: 0, transformOrigin: "top" });
            ScrollTrigger.create({
                trigger: sectionThree.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    if (self.progress >= 0.9) {
                        gsap.set(line3.current, { scaleY: 1 });
                    } else {
                        gsap.set(line3.current, { scaleY: 0 });
                    }
                },
            });
        }

        // Container One animation
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
                        scrub: 1,
                        onUpdate: (self) => {
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

        // Container Two animation
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

        // Container Three animation
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

        // Container Four animation
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

        // Cleanup function to kill all ScrollTriggers when component re-renders
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, { dependencies: [isDesktop] });

    return (
        <div style={{ width: "100vw", ...style }} className={`relative ${className}`}>
            <div ref={sectionOne} className="w-full lg:h-screen lg:sticky top-0 z-30 overflow-hidden" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
                <div className="lg:h-screen flex flex-col gap-4 justify-center px-6 lg:pl-16 2xl:pl-24 lg:pr-24 2xl:pr-0 lg:w-1/2 2xl:w-1/3">
                    <h2 className='text-2xl md:text-4xl text-white font-title pb-8'>{t("title")} <span className='text-highlight'>{t("titleHighlight")}</span></h2>

                    <ul className="space-y-0 text-secondary text-lg">

                        <li className="grid grid-cols-[auto_1fr] gap-4">
                            <div className="flex flex-col items-center">
                                <StepProgressDot triggerRef={sectionOne} label={1} size={28} />
                                <div ref={line1} className="w-[1px] flex-1 bg-highlight origin-top" style={{ transformOrigin: 'top' }}></div>
                            </div>
                            <div className="flex flex-col gap-2 pb-8">
                                <h2 className={`${!isDesktop || activeStep === 1 ? "text-white" : "text-secondary"} transition-colors`}>{t("step1.title")}</h2>
                                <p className="text-secondary">
                                    {t("step1.description")}
                                </p>
                            </div>
                        </li>

                        <li className="grid grid-cols-[auto_1fr] gap-4">
                            <div className="flex flex-col items-center">
                                <StepProgressDot triggerRef={sectionTwo} label={2} size={28} />
                                <div ref={line2} className="w-[1px] flex-1 bg-highlight origin-top" style={{ transformOrigin: 'top' }}></div>
                            </div>
                            <div className="flex flex-col gap-2 pb-8">
                                <h2 className={`${!isDesktop || activeStep === 2 ? "text-white" : "text-secondary"} transition-colors`}>{t("step2.title")}</h2>
                                <p className="text-secondary">
                                    {t("step2.description")}
                                </p>
                            </div>
                        </li>

                        <li className="grid grid-cols-[auto_1fr] gap-4">
                            <div className="flex flex-col items-center">
                                <StepProgressDot triggerRef={sectionThree} label={3} size={28} />
                                <div ref={line3} className="w-[1px] flex-1 bg-highlight origin-top" style={{ transformOrigin: 'top' }}></div>
                            </div>
                            <div className="flex flex-col gap-2 pb-8">
                                <h2 className={`${!isDesktop || activeStep === 3 ? "text-white" : "text-secondary"} transition-colors`}>{t("step3.title")}</h2>
                                <p className="text-secondary">
                                    {t("step3.description")}
                                </p>
                            </div>
                        </li>

                        <li className="grid grid-cols-[auto_1fr] gap-4">
                            <div className="flex flex-col items-center">
                                <StepProgressDot triggerRef={sectionFour} label={4} size={28} endOffset={200} />
                            </div>
                            <div className="flex flex-col gap-2 pb-8">
                                <h2 className={`${!isDesktop || activeStep === 4 ? "text-white" : "text-secondary"} transition-colors`}>{t("step4.title")}</h2>
                                <p className="text-secondary">
                                    {t("step4.description")}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                {isDesktop && (
                    <>
                        <AnimatedContainer
                            ref={containerOne}
                            title={t("step1.containerTitle")}
                            className="absolute lg:right-[130px] 2xl:right-[250px] lg:bottom-[120px] 2xl:bottom-[200px]"
                            showAnimatedClone={containerEffects.container1.showAnimatedClone}
                            showLightSweeps={containerEffects.container1.showLightSweeps}
                        />

                        <AnimatedContainer
                            ref={containerTwo}
                            title={t("step2.containerTitle")}
                            className="absolute lg:right-[125px] 2xl:right-[245px] lg:bottom-[140px] 2xl:bottom-[220px]"
                            showAnimatedClone={containerEffects.container2.showAnimatedClone}
                            showLightSweeps={containerEffects.container2.showLightSweeps}
                        />

                        <AnimatedContainer
                            ref={containerThree}
                            title={t("step3.containerTitle")}
                            className="absolute lg:right-[120px] 2xl:right-[240px] lg:bottom-[160px] 2xl:bottom-[240px]"
                            showAnimatedClone={containerEffects.container3.showAnimatedClone}
                            showLightSweeps={containerEffects.container3.showLightSweeps}
                        />

                        <AnimatedContainer
                            ref={containerFour}
                            title={t("step4.containerTitle")}
                            className="absolute lg:right-[115px] 2xl:right-[235px] lg:bottom-[180px] 2xl:bottom-[260px]"
                            showAnimatedClone={containerEffects.container4.showAnimatedClone}
                            showLightSweeps={containerEffects.container4.showLightSweeps}
                        />
                    </>
                )}

            </div>
            <div ref={sectionTwo} className="hidden lg:block h-screen"></div>
            <div ref={sectionThree} className="hidden lg:block h-screen"></div>
            <div ref={sectionFour} className="hidden lg:block h-screen"></div>
            <div className="hidden lg:block h-screen"></div>

        </div>
    );
};

export default HowItWorksSection;
