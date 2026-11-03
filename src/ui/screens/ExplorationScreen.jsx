import { useEffect, useRef } from "react";
import "./ExplorationScreen.css";

const TILE = 32;
const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;
const SPEED = 110;

// tamanho do personagem no mapa
const DRAW_HEIGHT = 36;

// velocidade da animação
const WALK_FPS = 8;

const spriteFiles = import.meta.glob(
  "../assets/characters/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function analyzeSprite(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);

  const width = canvas.width;
  const height = canvas.height;
  const { data } = ctx.getImageData(0, 0, width, height);

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];

      if (alpha > 8) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX === -1) {
    return {
      sx: 0,
      sy: 0,
      sw: image.naturalWidth,
      sh: image.naturalHeight,
      footX: image.naturalWidth / 2,
      footY: image.naturalHeight,
    };
  }

  return {
    sx: minX,
    sy: minY,
    sw: maxX - minX + 1,
    sh: maxY - minY + 1,
    footX: (minX + maxX + 1) / 2,
    footY: maxY + 1,
  };
}

function loadSprites(character) {
  const directions = {
    down: [],
    up: [],
    left: [],
    right: [],
  };

  const files = Object.entries(spriteFiles)
    .filter(([path]) =>
      path.toLowerCase().includes(`/characters/${character.toLowerCase()}/`)
    )
    .sort(([a], [b]) => a.localeCompare(b, "pt-BR", { numeric: true }));

  for (const [path, url] of files) {
    const name = path.toLowerCase();

    let direction = null;

    if (name.includes("/frente/") || name.includes("front")) {
      direction = "down";
    } else if (name.includes("/costas/") || name.includes("back")) {
      direction = "up";
    } else if (name.includes("/esquerda/") || name.includes("left")) {
      direction = "left";
    } else if (name.includes("/direita/") || name.includes("right")) {
      direction = "right";
    }

    if (direction) {
      const image = new Image();

      image.onload = () => {
        image.meta = analyzeSprite(image);
      };

      image.src = url;
      directions[direction].push(image);
    }
  }

  return directions;
}

function getTile(x, y) {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
    return "wall";
  }

  if (x >= 24 && x <= 30 && y >= 6 && y <= 12) {
    return "water";
  }

  if (x >= 15 && x <= 20 && y >= 17 && y <= 21) {
    return "house";
  }

  if (
    (x >= 4 && x <= 35 && y >= 8 && y <= 10) ||
    (x >= 8 && x <= 10 && y >= 4 && y <= 27)
  ) {
    return "path";
  }

  if ((x * 13 + y * 29) % 17 === 0) {
    return "tree";
  }

  return "grass";
}

function canWalk(x, y) {
  const points = [
    [x - 7, y - 5],
    [x + 7, y - 5],
    [x - 7, y + 5],
    [x + 7, y + 5],
  ];

  return points.every(([px, py]) => {
    const type = getTile(Math.floor(px / TILE), Math.floor(py / TILE));
    return type === "grass" || type === "path";
  });
}

function drawTile(ctx, type, x, y) {
  ctx.fillStyle = "#689c61";
  ctx.fillRect(x, y, TILE, TILE);

  if (type === "path") {
    ctx.fillStyle = "#cfa46f";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "#b58b59";
    ctx.fillRect(x + 7, y + 9, 4, 3);
    ctx.fillRect(x + 18, y + 20, 3, 2);
  }

  if (type === "water") {
    ctx.fillStyle = "#487fa5";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "#72b5cb";
    ctx.fillRect(x + 7, y + 13, 12, 3);
    ctx.fillRect(x + 18, y + 7, 8, 2);
  }

  if (type === "tree") {
    ctx.fillStyle = "#654a32";
    ctx.fillRect(x + 13, y + 19, 8, 13);
    ctx.fillStyle = "#244f38";
    ctx.fillRect(x + 3, y + 5, 26, 20);
    ctx.fillStyle = "#39784a";
    ctx.fillRect(x + 7, y + 3, 18, 15);
  }

  if (type === "house") {
    ctx.fillStyle = "#d4ba8a";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "#7e4c32";
    ctx.fillRect(x, y, TILE, 13);
  }

  if (type === "wall") {
    ctx.fillStyle = "#244f38";
    ctx.fillRect(x, y, TILE, TILE);
  }
}

function drawPlayer(ctx, sprite, player) {
  if (!sprite?.complete || sprite.naturalWidth <= 0 || !sprite.meta) {
    ctx.fillStyle = "#422b27";
    ctx.fillRect(player.x - 8, player.y - 27, 16, 9);
    ctx.fillStyle = "#e1b68c";
    ctx.fillRect(player.x - 6, player.y - 19, 12, 9);
    ctx.fillStyle = "#8d3945";
    ctx.fillRect(player.x - 8, player.y - 10, 16, 13);
    ctx.fillStyle = "#292c43";
    ctx.fillRect(player.x - 7, player.y + 3, 5, 5);
    ctx.fillRect(player.x + 2, player.y + 3, 5, 5);
    return;
  }

  const { sx, sy, sw, sh, footX, footY } = sprite.meta;

  const scale = DRAW_HEIGHT / sh;
  const drawWidth = Math.round(sw * scale);
  const drawHeight = Math.round(sh * scale);

  const drawX = Math.round(player.x - (footX - sx) * scale);
  const drawY = Math.round(player.y - (footY - sy) * scale);

  ctx.imageSmoothingEnabled = false;

  // sombra
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(
    Math.round(player.x),
    Math.round(player.y + 2),
    Math.max(4, Math.round(drawWidth * 0.22)),
    Math.max(2, Math.round(drawHeight * 0.07)),
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.drawImage(
    sprite,
    sx,
    sy,
    sw,
    sh,
    drawX,
    drawY,
    drawWidth,
    drawHeight
  );
}

function chooseAnimationFrame(frames, walkingTime, moved) {
  if (!frames || frames.length === 0) return null;

  // sequência mais segura para evitar “3 pernas”
  const safeSequence12 = [0, 2, 4, 6, 8, 10, 8, 6, 4, 2];
  const safeSequence8 = [0, 1, 2, 3, 4, 5, 4, 3];
  const safeSequence4 = [0, 1, 2, 1];

  if (!moved) return frames[0];

  if (frames.length >= 11) {
    const seqIndex =
      Math.floor(walkingTime * WALK_FPS) % safeSequence12.length;
    return frames[safeSequence12[seqIndex]];
  }

  if (frames.length >= 7) {
    const seqIndex = Math.floor(walkingTime * WALK_FPS) % safeSequence8.length;
    return frames[safeSequence8[seqIndex]];
  }

  if (frames.length >= 3) {
    const seqIndex = Math.floor(walkingTime * WALK_FPS) % safeSequence4.length;
    return frames[safeSequence4[seqIndex]];
  }

  return frames[0];
}

export default function ExplorationScreen() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const sprites = loadSprites("GVS");
    const keys = new Set();

    const player = {
      x: 8.5 * TILE,
      y: 9.5 * TILE,
      direction: "down",
      walkingTime: 0,
    };

    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        event.preventDefault();
        keys.add(key);
      }
    };

    const onKeyUp = (event) => {
      keys.delete(event.key.toLowerCase());
    };

    const onBlur = () => keys.clear();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    let animationId;
    let lastTime = 0;

    function frame(time) {
      const dt = Math.min((time - (lastTime || time)) / 1000, 0.05);
      lastTime = time;

      const horizontal =
        Number(keys.has("d") || keys.has("arrowright")) -
        Number(keys.has("a") || keys.has("arrowleft"));

      const vertical =
        Number(keys.has("s") || keys.has("arrowdown")) -
        Number(keys.has("w") || keys.has("arrowup"));

      const moving = horizontal !== 0 || vertical !== 0;
      let moved = false;

      if (moving) {
        const length = Math.hypot(horizontal, vertical);
        const dx = (horizontal / length) * SPEED * dt;
        const dy = (vertical / length) * SPEED * dt;

        if (canWalk(player.x + dx, player.y)) {
          player.x += dx;
          moved = true;
        }

        if (canWalk(player.x, player.y + dy)) {
          player.y += dy;
          moved = true;
        }

        player.direction =
          Math.abs(horizontal) > Math.abs(vertical)
            ? horizontal > 0
              ? "right"
              : "left"
            : vertical > 0
            ? "down"
            : "up";

        if (moved) {
          player.walkingTime += dt;
        } else {
          player.walkingTime = 0;
        }
      } else {
        player.walkingTime = 0;
      }

      const cameraX = Math.max(
        0,
        Math.min(MAP_WIDTH * TILE - canvas.width, player.x - canvas.width / 2)
      );

      const cameraY = Math.max(
        0,
        Math.min(
          MAP_HEIGHT * TILE - canvas.height,
          player.y - canvas.height / 2
        )
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-Math.floor(cameraX), -Math.floor(cameraY));

      const startX = Math.max(0, Math.floor(cameraX / TILE));
      const startY = Math.max(0, Math.floor(cameraY / TILE));
      const endX = Math.min(
        MAP_WIDTH,
        Math.ceil((cameraX + canvas.width) / TILE) + 1
      );
      const endY = Math.min(
        MAP_HEIGHT,
        Math.ceil((cameraY + canvas.height) / TILE) + 1
      );

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          drawTile(ctx, getTile(x, y), x * TILE, y * TILE);
        }
      }

      const frames = sprites[player.direction] || [];
      const sprite = chooseAnimationFrame(frames, player.walkingTime, moved);
      drawPlayer(ctx, sprite, player);

      ctx.restore();
      animationId = requestAnimationFrame(frame);
    }

    animationId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <main className="exploration">
      <h1>ARVERTES</h1>

      <div className="game-frame">
        <canvas ref={canvasRef} width={640} height={360} />
      </div>

      <div className="help-box">
        <p><strong>Personagem:</strong> GVS</p>
        <p><strong>Controles:</strong> WASD ou setas</p>
      </div>
    </main>
  );
}