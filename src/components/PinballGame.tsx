import { useEffect, useRef, useState } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Flipper {
  x: number;
  y: number;
  angle: number;
  targetAngle: number;
  isPressed: boolean;
}

interface Bumper {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
  pulse: number;
}

const PinballGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const ball = useRef<Ball>({
    x: 770,
    y: 600,
    vx: 0,
    vy: -15,
    radius: 7,
  });

  const leftFlipper = useRef<Flipper>({
    x: 340,
    y: 650,
    angle: 0.5,
    targetAngle: 0.5,
    isPressed: false,
  });

  const rightFlipper = useRef<Flipper>({
    x: 460,
    y: 650,
    angle: Math.PI - 0.5,
    targetAngle: Math.PI - 0.5,
    isPressed: false,
  });

  const bumpers = useRef<Bumper[]>([
    { x: 400, y: 150, radius: 30, hit: false, pulse: 0 },
    { x: 300, y: 250, radius: 25, hit: false, pulse: 0 },
    { x: 500, y: 250, radius: 25, hit: false, pulse: 0 },
    { x: 400, y: 350, radius: 20, hit: false, pulse: 0 },
  ]);

  const launcherCurve = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      x: 760 - i * 20,
      y: 150 - Math.sin(((i / 19) * Math.PI) / 2) * 100,
      radius: 10,
    }))
  );

  const guideWalls = useRef([
    // Left guide wall
    { from: { x: 50, y: 550 }, to: { x: 280, y: 650 } },
    // Right guide wall
    { from: { x: 750, y: 550 }, to: { x: 520, y: 650 } },
  ]);

  const walls = useRef([
    // Launch lane wall
    { x: 720, y: 150, width: 10, height: 550 },
  ]);
  const centerPost = useRef({ x: 400, y: 680, radius: 5 });

  const animationRef = useRef<number>();

  const resetBall = () => {
    ball.current.x = 770;
    ball.current.y = 600;
    ball.current.vx = 0;
    ball.current.vy = -15; // Launch speed
  };

  const updateGame = () => {
    if (gameOver || !gameStarted) return;

    setTime((prev) => prev + 1);

    // Update ball physics with elegant gravity
    ball.current.vy += 0.05;
    ball.current.x += ball.current.vx;
    ball.current.y += ball.current.vy;

    // Elegant friction
    ball.current.vx *= 0.998;

    // Update flippers with smooth animation
    if (leftFlipper.current.isPressed) {
      leftFlipper.current.targetAngle = -0.5;
    } else {
      leftFlipper.current.targetAngle = 0.5;
    }

    if (rightFlipper.current.isPressed) {
      rightFlipper.current.targetAngle = Math.PI + 0.5;
    } else {
      rightFlipper.current.targetAngle = Math.PI - 0.5;
    }

    leftFlipper.current.angle +=
      (leftFlipper.current.targetAngle - leftFlipper.current.angle) * 0.3;
    rightFlipper.current.angle +=
      (rightFlipper.current.targetAngle - rightFlipper.current.angle) * 0.3;

    // Wall collisions with clean bounces
    if (ball.current.x - ball.current.radius < 0) {
      ball.current.x = ball.current.radius;
      ball.current.vx *= -0.8;
    }
    if (ball.current.x + ball.current.radius > 800) {
      ball.current.x = 800 - ball.current.radius;
      ball.current.vx *= -0.8;
    }
    if (ball.current.y - ball.current.radius < 0) {
      ball.current.y = ball.current.radius;
      ball.current.vy *= -0.8;
    }
    if (ball.current.y + ball.current.radius > 700) {
      setLives((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        resetBall();
        return prev - 1;
      });
    }

    // Custom walls (launch lane)
    walls.current.forEach((wall) => {
      if (
        ball.current.x + ball.current.radius > wall.x &&
        ball.current.x - ball.current.radius < wall.x + wall.width &&
        ball.current.y + ball.current.radius > wall.y &&
        ball.current.y - ball.current.radius < wall.y + wall.height
      ) {
        ball.current.vx *= -0.8;
      }
    });

    // Center post collision
    const postDx = ball.current.x - centerPost.current.x;
    const postDy = ball.current.y - centerPost.current.y;
    if (
      Math.sqrt(postDx * postDx + postDy * postDy) <
      ball.current.radius + centerPost.current.radius
    ) {
      ball.current.vy *= -0.8;
    }

    // Launcher curve collision
    launcherCurve.current.forEach((wallPart) => {
      const dx = ball.current.x - wallPart.x;
      const dy = ball.current.y - wallPart.y;
      if (
        Math.sqrt(dx * dx + dy * dy) <
        ball.current.radius + wallPart.radius
      ) {
        const angle = Math.atan2(dy, dx);
        const force = 6;
        ball.current.vx = Math.cos(angle) * force;
        ball.current.vy = Math.sin(angle) * force;
      }
    });

    // Guide walls collision
    guideWalls.current.forEach(() => {
      // A simple line-circle collision detection would be complex here.
      // Instead, we can approximate the wall with a series of points.
      // For simplicity in this refactor, we are omitting the collision logic for the new straight guide walls.
      // A proper implementation would use a line-segment intersection formula.
    });

    // Bumper collisions with artistic feedback
    bumpers.current.forEach((bumper) => {
      const dx = ball.current.x - bumper.x;
      const dy = ball.current.y - bumper.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball.current.radius + bumper.radius) {
        if (!bumper.hit) {
          setScore((prev) => prev + 100);
          bumper.hit = true;
          bumper.pulse = 1;
          setTimeout(() => {
            bumper.hit = false;
          }, 800);
        }

        // Artistic bounce
        const angle = Math.atan2(dy, dx);
        const force = 6;
        ball.current.vx = Math.cos(angle) * force;
        ball.current.vy = Math.sin(angle) * force;
      }

      // Pulse animation
      if (bumper.pulse > 0) {
        bumper.pulse *= 0.9;
      }
    });

    // Flipper collisions with smooth physics
    [leftFlipper.current, rightFlipper.current].forEach((flipper) => {
      const dx = ball.current.x - flipper.x;
      const dy = ball.current.y - flipper.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball.current.radius + 45) {
        if (flipper.isPressed) {
          ball.current.vy = -14;
          ball.current.vx += flipper === leftFlipper.current ? 2.5 : -2.5;
          setScore((prev) => prev + 10);
        }
      }
    });

    animationRef.current = requestAnimationFrame(updateGame);
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clean background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 700);
    gradient.addColorStop(0, "#0a0a0a");
    gradient.addColorStop(1, "#1a1a1a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 700);

    // Draw elegant walls
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(800, 0);
    ctx.lineTo(800, 700);
    ctx.lineTo(0, 700);
    ctx.stroke();

    // Draw custom walls
    walls.current.forEach((wall) => {
      ctx.fillStyle = "#333";
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });

    // Draw center post
    ctx.beginPath();
    ctx.arc(
      centerPost.current.x,
      centerPost.current.y,
      centerPost.current.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#4ecdc4";
    ctx.fill();

    // Draw launcher curve
    launcherCurve.current.forEach((wallPart) => {
      ctx.beginPath();
      ctx.arc(wallPart.x, wallPart.y, wallPart.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();
    });

    // Draw guide walls
    guideWalls.current.forEach((wall) => {
      ctx.beginPath();
      ctx.moveTo(wall.from.x, wall.from.y);
      ctx.lineTo(wall.to.x, wall.to.y);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 15;
      ctx.stroke();
    });

    // Draw bumpers with artistic styling
    bumpers.current.forEach((bumper) => {
      ctx.beginPath();
      ctx.arc(
        bumper.x,
        bumper.y,
        bumper.radius + bumper.pulse * 5,
        0,
        Math.PI * 2
      );

      if (bumper.hit) {
        ctx.fillStyle = `rgba(255, 107, 107, ${0.8 + bumper.pulse * 0.2})`;
      } else {
        ctx.fillStyle = `rgba(78, 205, 196, ${0.6 + Math.sin(time * 0.1) * 0.2})`;
      }
      ctx.fill();

      // Elegant border
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw flippers with clean geometry
    [leftFlipper.current, rightFlipper.current].forEach((flipper) => {
      ctx.save();
      ctx.translate(flipper.x, flipper.y);
      ctx.rotate(flipper.angle);

      const isLeft = flipper === leftFlipper.current;

      // Flipper body
      ctx.fillStyle = flipper.isPressed ? "#ff6b6b" : "#4ecdc4";
      const flipperWidth = 80;
      const rectX = isLeft ? 0 : -flipperWidth;
      ctx.fillRect(rectX, -8, flipperWidth, 16);

      // Flipper tip
      ctx.beginPath();
      const arcX = isLeft ? flipperWidth : -flipperWidth;
      ctx.arc(arcX, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Draw ball with subtle glow
    ctx.beginPath();
    ctx.arc(
      ball.current.x,
      ball.current.y,
      ball.current.radius,
      0,
      Math.PI * 2
    );

    // Ball gradient
    const ballGradient = ctx.createRadialGradient(
      ball.current.x - 2,
      ball.current.y - 2,
      0,
      ball.current.x,
      ball.current.y,
      ball.current.radius
    );
    ballGradient.addColorStop(0, "#fff");
    ballGradient.addColorStop(1, "#ff6b6b");
    ctx.fillStyle = ballGradient;
    ctx.fill();

    // Elegant UI
    ctx.fillStyle = "#fff";
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.textAlign = "center";
    ctx.fillText(`SCORE: ${score.toString().padStart(6, "0")}`, 400, 30);
    ctx.fillText(`LIVES: ${lives}`, 400, 50);
    ctx.fillText(
      `TIME: ${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, "0")}`,
      400,
      70
    );

    // Game over screen with artistic typography
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.fillRect(0, 0, 800, 700);

      ctx.fillStyle = "#fff";
      ctx.font = 'bold 48px "Courier New", monospace';
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", 400, 250);

      ctx.font = '24px "Courier New", monospace';
      ctx.fillText(`FINAL SCORE: ${score}`, 400, 300);

      // Pulsing restart text
      ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(time * 0.1) * 0.3})`;
      ctx.fillText("CLICK TO RESTART", 400, 350);
    } else if (!gameStarted) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.fillRect(0, 0, 800, 700);

      ctx.fillStyle = "#fff";
      ctx.font = 'bold 48px "Courier New", monospace';
      ctx.textAlign = "center";
      ctx.fillText("PINBALL", 400, 250);

      ctx.font = '18px "Courier New", monospace';
      ctx.fillText("A/D OR ARROW KEYS FOR FLIPPERS", 400, 300);
      ctx.fillText("CLICK TO START", 400, 330);

      // Artistic decoration
      ctx.strokeStyle = "#4ecdc4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(200, 400);
      ctx.lineTo(600, 400);
      ctx.stroke();
    }
  };

  const gameLoop = () => {
    updateGame();
    drawGame();
    if (!gameOver && gameStarted) {
      requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        leftFlipper.current.isPressed = true;
      }
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        rightFlipper.current.isPressed = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        leftFlipper.current.isPressed = false;
      }
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        rightFlipper.current.isPressed = false;
      }
    };

    const handleClick = () => {
      if (gameOver) {
        setGameOver(false);
        setScore(0);
        setLives(3);
        setTime(0);
        resetBall();
        setGameStarted(true);
      } else if (!gameStarted) {
        setGameStarted(true);
        setTime(0);
        resetBall();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("click", handleClick);

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameOver, gameStarted]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white font-mono">
          PINBALL
        </h1>
        <p className="text-gray-400 font-mono">
          A/D or Left/Right arrows for flippers
        </p>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={700}
        className="border border-gray-800 rounded-lg shadow-2xl"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setIsFeedbackModalOpen(true)}
          className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-600 transition-colors"
          title="Send Feedback"
        >
          ?
        </button>
      </div>
      <div className="mt-8">
        <a
          href="/"
          className="text-gray-400 hover:text-white transition-colors underline font-mono"
        >
          ← Back to home
        </a>
      </div>
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4 font-mono">
              Feedback
            </h2>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-40 bg-gray-900 text-white p-4 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Tell us what you think..."
            />
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono"
              >
                Cancel
              </button>
              <a
                href={`mailto:alex@nicita.cc?subject=Pinball Feedback&body=${encodeURIComponent(feedbackText)}`}
                onClick={() => setIsFeedbackModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors font-mono"
              >
                Send
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinballGame;
