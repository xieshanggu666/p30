<template>
  <div class="gomoku-container">
    <h2>五子棋游戏</h2>
    <div class="status">{{ statusText }}</div>
    <canvas ref="boardCanvas" @click="handleCanvasClick"></canvas>
    <button @click="resetGame" class="reset-btn">重新开始</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const boardSize = 15; // 15x15棋盘
const cellSize = 30;  // 每个格子大小
const boardCanvas = ref(null);
let ctx = null;
let currentPlayer = 1; // 1: 黑棋, 2: 白棋
let gameBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
let gameOver = false;

// 初始化棋盘
const initBoard = () => {
  ctx.strokeStyle = '#333';
  ctx.fillStyle = '#f0d9a7';
  ctx.fillRect(0, 0, boardCanvas.value.width, boardCanvas.value.height);
  
  // 绘制棋盘线
  for (let i = 0; i < boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize + cellSize/2, cellSize/2);
    ctx.lineTo(i * cellSize + cellSize/2, boardCanvas.value.height - cellSize/2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cellSize/2, i * cellSize + cellSize/2);
    ctx.lineTo(boardCanvas.value.width - cellSize/2, i * cellSize + cellSize/2);
    ctx.stroke();
  }
};

// 绘制棋子
const drawPiece = (x, y, player) => {
  ctx.beginPath();
  ctx.arc(
    x * cellSize + cellSize/2,
    y * cellSize + cellSize/2,
    cellSize/2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = player === 1 ? '#000' : '#fff';
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.stroke();
};

// 检查胜利条件
const checkWin = (x, y) => {
  const directions = [
    [1, 0],  // 水平
    [0, 1],  // 垂直
    [1, 1],  // 右下
    [1, -1]  // 右上
  ];

  for (let [dx, dy] of directions) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize) break;
      if (gameBoard[ny][nx] !== currentPlayer) break;
      count++;
    }
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i;
      const ny = y - dy * i;
      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize) break;
      if (gameBoard[ny][nx] !== currentPlayer) break;
      count++;
    }
    if (count >= 5) return true;
  }
  return false;
};

const handleCanvasClick = (event) => {
  if (gameOver) return;

  const rect = boardCanvas.value.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / cellSize);
  const y = Math.floor((event.clientY - rect.top) / cellSize);

  if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && gameBoard[y][x] === 0) {
    gameBoard[y][x] = currentPlayer;
    drawPiece(x, y, currentPlayer);
    
    if (checkWin(x, y)) {
      gameOver = true;
    } else {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
  }
};

const resetGame = () => {
  gameBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
  currentPlayer = 1;
  gameOver = false;
  initBoard();
};

const statusText = ref('黑棋回合');

onMounted(() => {
  boardCanvas.value.width = boardSize * cellSize;
  boardCanvas.value.height = boardSize * cellSize;
  ctx = boardCanvas.value.getContext('2d');
  initBoard();
});
</script>

<style scoped>
.gomoku-container {
  text-align: center;
  padding: 20px;
}

.status {
  font-size: 24px;
  margin: 10px 0;
  color: #333;
}

canvas {
  border: 2px solid #666;
  background: #f0d9a7;
  margin: 10px auto;
}

.reset-btn {
  padding: 10px 20px;
  font-size: 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
