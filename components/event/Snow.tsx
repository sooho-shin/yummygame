"use client";

import { useSprings, animated } from "react-spring";

const Snowfall = () => {
  const snowflakes = Array.from({ length: 100 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -10,
    size: Math.random() * 8 + 2, // 랜덤 크기 (2px ~ 10px)
    delay: Math.random() * 5000,
  }));

  const springs = useSprings(
    snowflakes.length,
    snowflakes.map(snowflake => ({
      from: { transform: `translate(${snowflake.x}px, ${snowflake.y}px)` },
      to: { transform: `translate(${snowflake.x}px, ${window.innerHeight}px)` },
      config: { duration: Math.random() * 5000 + 5000 },
      delay: snowflake.delay,
      reset: true,
      loop: true,
    })),
  );

  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {springs.map((props, i) => (
        <animated.div
          key={i}
          style={{
            ...props,
            position: "absolute",
            width: `${snowflakes[i].size}px`, // 랜덤 크기 적용
            height: `${snowflakes[i].size}px`,
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: Math.random() * 0.5 + 0.5, // 랜덤 불투명도 (0.5 ~ 1)
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
