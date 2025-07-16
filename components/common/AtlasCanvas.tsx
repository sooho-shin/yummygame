import React, { useEffect, useRef, useState } from "react";
import { preloadImage } from "@/utils/imagePreload";

interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

const AtlasCanvas = ({
  width,
  height,
  frameLength,
  imagePath,
  startState,
  endCallback,
}: {
  width: number;
  height: number;
  frameLength: number;
  imagePath: string;
  startState: boolean;
  endCallback: () => void;
}) => {
  useEffect(() => {
    preloadImage(imagePath);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function createFrames(
    width: number,
    height: number,
    frameLength: number,
  ): Frame[] {
    const frames: Frame[] = [];

    for (let i = 0; i < frameLength; i++) {
      frames.push({
        x: i * width,
        y: 0,
        width: width,
        height: height,
      });
    }

    return frames;
  }

  // useEffect(() => {
  //   if (bombAni) {
  //     requestAnimationFrame(draw);
  //   }
  // }, [bombAni]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spriteSheet = new Image();
    spriteSheet.src = imagePath; // 이 부분을 실제 이미지 경로로 변경하세요.

    const frames = createFrames(width, height, frameLength);
    let currentFrame = 0;
    let lastTime = 0;
    const frameDuration = 20; // 20ms per frame

    function draw(time: number) {
      if (!ctx) return;
      if (!canvas) return;

      if (currentFrame === frames.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        endCallback();
        return;
      }

      const deltaTime = time - lastTime;

      if (deltaTime >= frameDuration) {
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          spriteSheet,
          frames[currentFrame].x,
          frames[currentFrame].y,
          frames[currentFrame].width,
          frames[currentFrame].height,
          0,
          0, // Canvas에 그릴 위치 (예시로 고정)
          frames[currentFrame].width,
          frames[currentFrame].height,
        );
        currentFrame += 1;
      }

      requestAnimationFrame(draw);
    }

    if (startState) {
      requestAnimationFrame(draw);
    }
  }, [width, height, frameLength, imagePath, startState]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};

export default AtlasCanvas;
