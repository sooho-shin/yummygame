"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function Holdem() {
  const gameContainer = useRef<HTMLDivElement>(null);

  // Boot Scene
  const createBootScene = () => {
    return {
      key: "Boot",
      preload(this: Phaser.Scene) {
        this.load.pack("pack", "/images/game/holdem/preload-asset-pack.json");
      },
      create(this: Phaser.Scene) {
        this.scene.start("Preload");
      },
    };
  };

  // Preload Scene
  const createPreloadScene = () => {
    return {
      key: "Preload",
      preload(this: Phaser.Scene) {
        this.load.image("table", "/images/game/holdem/table.webp");
      },
      create(this: Phaser.Scene) {
        this.scene.start("Level");
      },
    };
  };

  // Level Scene
  const createLevelScene = () => {
    return {
      key: "Level",
      preload(this: Phaser.Scene) {
        // 추가적인 preload 로직이 필요하다면 여기에 작성
      },
      update(this: Phaser.Scene, time: number, delta: number) {},
      create(this: Phaser.Scene) {
        function editorCreate(this: Phaser.Scene) {
          // 배경 이미지
          // const bg = this.add.image(642, 355, "bg");
          // bg.scaleX = 0.652907618981633;
          // bg.scaleY = 0.5041338715678481;
          // 칩 이미지
          // this.add.image(287, 355, "chip");
          // this.events.emit("scene-awake");

          // image_1
          const image_1 = this.add.image(572, 331, "table");
          image_1.scaleX = 0.5;
          image_1.scaleY = 0.5;

          this.events.emit("scene-awake");
        }

        editorCreate.call(this);
      },
    };
  };

  useEffect(() => {
    if (gameContainer.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        // backgroundColor: "#2f2f2f",
        transparent: true,
        width: 1144,
        height: 662,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [createBootScene(), createPreloadScene(), createLevelScene()],
        parent: gameContainer.current,
      };

      const game = new Phaser.Game(config);

      game.scene.start("Boot");

      return () => {
        game.destroy(true);
      };
    }
  }, [gameContainer.current?.clientWidth]);

  return <div ref={gameContainer} />;
}
