"use client";

import React, { useEffect, useRef, useState } from "react";

type FitMode = "cover" | "contain";

interface DitherPortraitProps {
  className?: string;

  /** Image to dither (recommended: serve from /public to avoid CORS issues) */
  imageSrc?: string;

  /** Canvas background color */
  backgroundColor?: string;

  /** Dot grid spacing in CSS pixels */
  dotSpacing?: number;

  /** Base dot radius in CSS pixels */
  dotRadius?: number;

  /** Minimum intensity to draw a dot (0..1) */
  intensityThreshold?: number;

  /** Adds deterministic grain/noise to feel more organic (0..1) */
  noiseAmount?: number;

  /** Increase/decrease contrast (1 = unchanged) */
  contrast?: number;

  /** Shift brightness (-1..1, small values like -0.05..0.05 are typical) */
  brightnessShift?: number;

  /** Edge fade from center (higher = sharper fade) */
  horizontalFadePower?: number;
  verticalFadePower?: number;

  /** How the image fits in the canvas */
  fit?: FitMode;

  /** Deterministic seed for noise */
  seed?: number;

  /** If true, invert (dark becomes bright dots) */
  invert?: boolean;
}

/**
 * Dot-dither portrait renderer (Buffett by default).
 * - Uses deterministic noise (stable render, no shimmer)
 * - Uses an offscreen sampling canvas for performance
 */
export default function DitherPortrait({
  className = "",
  imageSrc = "/portrait/graham.png",
  backgroundColor = "rgb(18, 18, 18)",
  dotSpacing = 4,
  dotRadius = 1.5,
  intensityThreshold = 0.22,
  noiseAmount = 0.18,
  contrast = 1.15,
  brightnessShift = 0.0,
  horizontalFadePower = 1.35,
  verticalFadePower = 1.35,
  fit = "contain",
  seed = 7,
  invert = false,
}: DitherPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isImageReady, setIsImageReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderingContext = canvas.getContext("2d");
    if (!renderingContext) return;

    let resizeObserver: ResizeObserver | null = null;
    let isCancelled = false;

    const portraitImage = new Image();
    portraitImage.crossOrigin = "anonymous";
    portraitImage.src = imageSrc;

    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

    // Deterministic pseudo-random (stable noise per dot cell).
    const pseudoRandom01 = (x: number, y: number, randomSeed: number) => {
      const sineInput = x * 12.9898 + y * 78.233 + randomSeed * 37.719;
      const sineValue = Math.sin(sineInput) * 43758.5453;
      return sineValue - Math.floor(sineValue);
    };

    const draw = () => {
      if (isCancelled) return;

      const parentElement = canvas.parentElement;
      const parentBounds = parentElement?.getBoundingClientRect();
      const canvasCssWidth = Math.max(1, Math.floor(parentBounds?.width ?? window.innerWidth));
      const canvasCssHeight = Math.max(1, Math.floor(parentBounds?.height ?? window.innerHeight));

      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvasCssWidth * devicePixelRatio);
      canvas.height = Math.floor(canvasCssHeight * devicePixelRatio);

      // Draw in CSS pixel coordinates for easier reasoning
      renderingContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      // Background
      renderingContext.fillStyle = backgroundColor;
      renderingContext.fillRect(0, 0, canvasCssWidth, canvasCssHeight);

      if (!portraitImage.complete || portraitImage.naturalWidth === 0) return;

      // Offscreen sampling (keeps loops fast even on large canvases)
      const samplingWidth = Math.min(520, Math.max(220, Math.floor(canvasCssWidth * 0.65)));
      const samplingHeight = Math.floor((canvasCssHeight / canvasCssWidth) * samplingWidth);

      const samplingCanvas = document.createElement("canvas");
      samplingCanvas.width = samplingWidth;
      samplingCanvas.height = samplingHeight;

      const samplingContext = samplingCanvas.getContext("2d");
      if (!samplingContext) return;

      // Fit image into sampling canvas
      const sourceWidth = portraitImage.naturalWidth;
      const sourceHeight = portraitImage.naturalHeight;

      const sourceAspectRatio = sourceWidth / sourceHeight;
      const targetAspectRatio = samplingWidth / samplingHeight;

      let drawWidth = samplingWidth;
      let drawHeight = samplingHeight;
      let drawX = 0;
      let drawY = 0;

      if (fit === "cover") {
        if (sourceAspectRatio > targetAspectRatio) {
          drawHeight = samplingHeight;
          drawWidth = drawHeight * sourceAspectRatio;
          drawX = -(drawWidth - samplingWidth) / 2;
        } else {
          drawWidth = samplingWidth;
          drawHeight = drawWidth / sourceAspectRatio;
          drawY = -(drawHeight - samplingHeight) / 2;
        }
      } else {
        if (sourceAspectRatio > targetAspectRatio) {
          drawWidth = samplingWidth;
          drawHeight = drawWidth / sourceAspectRatio;
          drawY = (samplingHeight - drawHeight) / 2;
        } else {
          drawHeight = samplingHeight;
          drawWidth = drawHeight * sourceAspectRatio;
          drawX = (samplingWidth - drawWidth) / 2;
        }
      }

      samplingContext.clearRect(0, 0, samplingWidth, samplingHeight);
      samplingContext.drawImage(portraitImage, drawX, drawY, drawWidth, drawHeight);

      const sampledImageData = samplingContext.getImageData(0, 0, samplingWidth, samplingHeight);
      const sampledPixels = sampledImageData.data;

      const centerX = canvasCssWidth / 2;
      const centerY = canvasCssHeight / 2;

      for (let y = 0; y < canvasCssHeight; y += dotSpacing) {
        const sampleY = Math.min(
          samplingHeight - 1,
          Math.floor((y / canvasCssHeight) * samplingHeight)
        );

        const verticalDistanceFromCenter = Math.abs(y - centerY) / Math.max(1, centerY);
        const verticalFade = clamp01(1 - Math.pow(verticalDistanceFromCenter, verticalFadePower));

        for (let x = 0; x < canvasCssWidth; x += dotSpacing) {
          const sampleX = Math.min(
            samplingWidth - 1,
            Math.floor((x / canvasCssWidth) * samplingWidth)
          );

          const pixelIndex = (sampleY * samplingWidth + sampleX) * 4;
          const red = sampledPixels[pixelIndex] ?? 0;
          const green = sampledPixels[pixelIndex + 1] ?? 0;
          const blue = sampledPixels[pixelIndex + 2] ?? 0;
          const alpha = sampledPixels[pixelIndex + 3] ?? 0;

          // Skip transparent pixels (fixes border issue with PNGs)
          if (alpha < 128) continue;

          // Luma (perceptual grayscale)
          const grayscale01 = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

          let intensity = invert ? 1 - grayscale01 : grayscale01;

          // Contrast + brightness shift
          intensity = (intensity - 0.5) * contrast + 0.5 + brightnessShift;
          intensity = clamp01(intensity);

          // Deterministic organic grain
          const noise01 = pseudoRandom01(x, y, seed);
          const signedNoise = (noise01 - 0.5) * 2; // -1..1
          intensity = clamp01(intensity + signedNoise * noiseAmount);

          // Edge fade (like your horizontal fade vibe)
          const horizontalDistanceFromCenter = Math.abs(x - centerX) / Math.max(1, centerX);
          const horizontalFade = clamp01(
            1 - Math.pow(horizontalDistanceFromCenter, horizontalFadePower)
          );

          intensity *= horizontalFade * verticalFade;

          // Thresholded dot render
          if (intensity < intensityThreshold) continue;

          const dotBrightness = Math.floor(intensity * 255);
          const finalDotRadius = dotRadius * (0.45 + intensity * 0.85);

          renderingContext.fillStyle = `rgb(${dotBrightness}, ${dotBrightness}, ${dotBrightness})`;
          renderingContext.beginPath();
          renderingContext.arc(x, y, finalDotRadius, 0, Math.PI * 2);
          renderingContext.fill();
        }
      }
    };

    const handleResize = () => draw();

    portraitImage.onload = () => {
      if (isCancelled) return;
      setIsImageReady(true);
      draw();
    };

    portraitImage.onerror = () => {
      // Still render background even if image fails
      if (isCancelled) return;
      setIsImageReady(false);
      draw();
    };

    // Observe parent size changes (better than window.innerWidth/Height)
    if (canvas.parentElement && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener("resize", handleResize);
    }

    // Initial draw (background while image loads)
    draw();

    return () => {
      isCancelled = true;
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [
    imageSrc,
    backgroundColor,
    dotSpacing,
    dotRadius,
    intensityThreshold,
    noiseAmount,
    contrast,
    brightnessShift,
    horizontalFadePower,
    verticalFadePower,
    fit,
    seed,
    invert,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={isImageReady ? "Dither portrait" : "Dither background"}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
