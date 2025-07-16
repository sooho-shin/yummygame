"use client";

import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import limboAtlasJson from "./limbo.json";
import styles from "./styles/limbo.module.scss";
import EventEmitter from "events";

const LimboGraphic = ({
  endCallback,
  eventEmitter,
  onLoad,
}: {
  endCallback: () => void;
  eventEmitter: EventEmitter;
  onLoad: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const gameContainer = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [limboSize, setLimboSize] = useState<number[]>([0, 0]);

  const resizeGame = () => {
    if (gameContainer.current) {
      const { clientWidth, clientHeight } = gameContainer.current;
      if (limboSize[0] !== clientWidth || limboSize[1] !== clientHeight) {
        setLimboSize([clientWidth, clientHeight]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeGame);
    resizeGame();

    return () => {
      window.removeEventListener("resize", resizeGame);
    };
  }, []);

  useEffect(() => {
    if (limboSize[0] === 0 || limboSize[1] === 0) return;

    let rocket: Phaser.GameObjects.Sprite | null = null;
    let smoke: Phaser.GameObjects.Sprite | null = null;
    let bomb: Phaser.GameObjects.Sprite | null = null;
    let text: Phaser.GameObjects.Text | null = null;

    let endDelta = 0;
    let startAnimation = false;
    let centerX = 0;
    let centerY = 0;
    let rocketY = 0;
    let smokeY = 0;
    let winYn = "";
    let preResultNumber = 1.98;
    let resultNumber = preResultNumber;

    let rocketElapsedTime = 0;
    const rocketMoveDuration = 300;
    const resetTime = 300;

    const evtListener = (win: string, num: number) => {
      startAnimation = true;
      winYn = win;
      resultNumber = num;

      text?.setColor(winYn === "Y" ? "#e2577a" : "#249bab");
    };
    eventEmitter.on("rocketAni", evtListener);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1100 * 0.7,
      height: 1100,
      parent: gameContainer.current as HTMLDivElement,
      transparent: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    gameRef.current = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      this.load.atlas("atlas", "/images/game/limbo/limbo.png", limboAtlasJson);
    }

    function create(this: Phaser.Scene) {
      const newFontFace = new FontFace(
        "Poppins",
        "url(/font/Poppins-Bold.woff2)",
      );
      document.fonts.add(newFontFace);
      newFontFace.load().then(() => {
        centerX = this.scale.width / 2;
        centerY = this.scale.height / 2;

        this.anims.create({
          key: "smokeAnim",
          frames: this.anims.generateFrameNames("atlas", {
            prefix: "smoke/smoke_",
            start: 1,
            end: 9,
            zeroPad: 2,
            suffix: ".webp",
          }),
          frameRate: 20,
          repeat: -1,
        });

        smoke = this.add.sprite(centerX, 0, "atlas").play("smokeAnim");
        rocket = this.add.sprite(centerX, 0, "atlas", "rocket/rocket-01.webp");

        smoke?.setScale(0.6, 0.6);
        smoke.setPosition(centerX, this.scale.height - smoke.displayHeight / 2);
        rocket.setPosition(
          centerX,
          smoke?.getBounds().top - rocket.displayHeight / 2.5,
        );

        rocketY = rocket?.y;
        smokeY = smoke?.y;

        this.anims.create({
          key: "bombAnimation",
          frames: this.anims.generateFrameNames("atlas", {
            prefix: "bomb/bomb_",
            start: 1,
            end: 10,
            zeroPad: 2,
            suffix: ".webp",
          }),
          frameRate: 30,
          repeat: 0,
        });

        bomb = this.add.sprite(centerX, 0, "atlas", "bomb/bomb_01.webp");
        bomb.setScale(2.5, 2.5);
        bomb.setVisible(false);
        bomb.y = bomb.displayHeight / 6;

        bomb.on("animationcomplete-bombAnimation", () => {
          bomb?.setVisible(false);
        });

        text = this.add.text(centerX, 0, " ", {
          color: "#fff",
          font: "700 180px Poppins",
        });
        text.setOrigin(0.5, 0);
        text.setPosition(centerX, 0);
        text.text = resultNumber.toString() + "x";
      });
      onLoad(true);
    }

    function update(this: Phaser.Scene, time: number, delta: number) {
      if (endDelta === 0 && rocket && smoke && text && startAnimation) {
        rocketElapsedTime += delta;

        if (rocketElapsedTime <= rocketMoveDuration) {
          const t = rocketElapsedTime / rocketMoveDuration;
          const easedT = Phaser.Math.Easing.Cubic.In(t);

          const y = Phaser.Math.Interpolation.Linear(
            [rocketY, 0 - rocket?.displayHeight / 2],
            easedT,
          );

          const multiply = Phaser.Math.Interpolation.Linear(
            [preResultNumber, resultNumber],
            easedT,
          );

          text.text = multiply.toFixed(2) + "x";
          rocket.y = y;
          smoke.y = y + (smokeY - rocketY);
        } else {
          bomb?.setVisible(true);
          bomb?.play("bombAnimation");

          rocket?.setVisible(false);
          smoke?.setVisible(false);
          rocketElapsedTime = 0;
          preResultNumber = resultNumber;
          endDelta = 1;
          text.text = resultNumber.toString() + "x";
        }
      }

      if (endDelta > 0) {
        endDelta += delta;

        if (endDelta > resetTime && rocket && smoke) {
          endDelta = 0;
          startAnimation = false;

          rocket.y = rocketY;
          smoke.y = smokeY;

          rocket.setVisible(true);
          smoke.setVisible(true);

          endCallback();
        }
      }
    }

    return () => {
      if (gameRef.current) gameRef.current.destroy(true);
      eventEmitter.off("rocketAni", evtListener);
    };
  }, [limboSize]);

  return <div className={styles["phaser-wrapper"]} ref={gameContainer} />;
};

export default LimboGraphic;
