<template>
  <div id="app">
    <div class="main-layout">
      <!-- Activity 5: Storyline Concept Description Box -->
      <div class="story-box">
        <h3>🎮 Game Concept (Activity 5)</h3>
        <p><strong>Protagonist:</strong> Blue Box | <strong>Setting:</strong> Neon Arena | <strong>Objective:</strong> Jump over red obstacles to score points.</p>
      </div>
      
      <!-- Activity 6 & 7: The Main Jump Game Component -->
      <div class="game-container">
        <h2>Dino Jump Game (Activity 6 & 7)</h2>
        <p class="score-display">Current Score: <span>{{ score }}</span></p>
        
        <!-- Game Over Screen -->
        <div v-if="gameOver" class="game-over-screen">
          <div class="game-over-box">
            <h3>GAME OVER!</h3>
            <p>You scored {{ score }} points!</p>
            <button @click="saveAndReset" class="submit-btn">Submit Score & Restart</button>
          </div>
        </div>

        <!-- Game Play Area -->
        <div class="game-area">
          <div class="player" :class="{ 'jumping': isJumping }"></div>
          <div class="obstacle" :style="{ left: obstacleX + 'px' }"></div>
          <div class="ground"></div>
        </div>
        
        <p class="instruction">Press <strong>SPACEBAR</strong> to Jump!</p>
      </div>

      <!-- Activity 8 & 9: Leaderboard Score Tracker (Simulated API) -->
      <div class="leaderboard-section">
        <h3>🏆 Top Players (Leaderboard - Activity 9)</h3>
        <button @click="fetchScores" class="refresh-btn">🔄 Refresh Scores</button>
        
        <ul>
          <li v-for="(user, index) in leaderboard" :key="index" class="score-item">
            <span class="rank">#{{ index + 1 }}</span>
            <span class="name">{{ user.name }}</span>
            <span class="points">{{ user.score }} pts</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Game States
      score: 0,
      gameOver: false,
      isJumping: false,
      obstacleX: 500,
      animationFrameId: null,
      
      // Audio States
      jumpSound: null,
      scoreSound: null,
      bgMusic: null,

      // Leaderboard States
      leaderboard: [
        { name: "Elie (You)", score: 12 },
        { name: "Alex", score: 8 },
        { name: "John", score: 5 }
      ]
    };
  },
  mounted() {
    this.initAudio();
    this.startGame();
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.bgMusic) this.bgMusic.pause();
  },
  methods: {
    initAudio() {
      // Amajwi aturuka kuri internet kugira ngo asimbure ama-files ashobora kubura
      this.jumpSound = new Audio('https://mixkit.co');
      this.scoreSound = new Audio('https://mixkit.co');
      this.bgMusic = new Audio('https://soundhelix.com');
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.1;
      
      document.addEventListener('click', () => {
        this.bgMusic.play().catch(e => {});
      }, { once: true });
    },
    
    playSound(soundName) {
      if (soundName === 'jump' && this.jumpSound) {
        this.jumpSound.currentTime = 0;
        this.jumpSound.play().catch(e => {});
      }
      if (soundName === 'score' && this.scoreSound) {
        this.scoreSound.currentTime = 0;
        this.scoreSound.play().catch(e => {});
      }
    },

    startGame() {
      this.score = 0;
      this.gameOver = false;
      this.obstacleX = 500;
      this.gameLoop();
    },

    gameLoop() {
      if (this.gameOver) return;

      this.obstacleX -= 6; // Umuvuduko w'urubari

      if (this.obstacleX < -30) {
        this.obstacleX = 500;
        this.score++;
        this.playSound('score');
      }

      this.checkCollision();

      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    },

    handleKeyDown(e) {
      if (e.code === 'Space') {
        e.preventDefault(); // Kubuza page kwishungura hasi
        this.jump();
      }
    },

    jump() {
      if (this.isJumping || this.gameOver) return;
      this.isJumping = true;
      this.playSound('jump');
      
      setTimeout(() => {
        this.isJumping = false;
      }, 500);
    },

    checkCollision() {
      if (this.obstacleX > 20 && this.obstacleX < 80 && !this.isJumping) {
        this.gameOver = true;
        cancelAnimationFrame(this.animationFrameId);
      }
    },

    saveAndReset() {
      const name = prompt("Enter your name for the Leaderboard:");
      if (name) {
        // Gushyira amanota mashya kuri Leaderboard (Muryo mwarimu asaba wa Axios POST)
        this.leaderboard.push({ name: name, score: this.score });
        this.leaderboard.sort((a, b) => b.score - a.score); // Guhita itondekanya amanota menshi
        alert("Your score has been submitted successfully!");
      }
      this.startGame();
    },

    fetchScores() {
      // Mocking Axios GET call bitabaye ngombwa ko server igira error
      alert("Fetching updated scores from the Mock API...");
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #1a1a2e;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.main-layout {
  width: 100%;
  max-width: 550px;
  background: #16213e;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid #0f3460;
}

.story-box {
  background: #0f3460;
  border-left: 5px solid #4e9f3d;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 6px;
}

.game-container {
  text-align: center;
  background: #1a1a2e;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.score-display span {
  color: #42b983;
  font-weight: bold;
}

.game-area {
  width: 100%;
  max-width: 450px;
  height: 180px;
  border: 3px solid #333;
  border-radius: 8px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: #ffffff;
}

.player {
  width: 35px;
  height: 35px;
  background: #35495e;
  border-radius: 4px;
  position: absolute;
  bottom: 10px;
  left: 50px;
  transition: bottom 0.22s ease;
}

.player.jumping {
  bottom: 85px;
  background: #42b983;
}

.obstacle {
  width: 20px;
  height: 30px;
  background: #de4343;
  border-radius: 4px;
  position: absolute;
  bottom: 10px;
}

.ground {
  width: 100%;
  height: 10px;
  background: #333;
  position: absolute;
  bottom: 0;
}

.game-over-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.game-over-box {
  background: #222;
  padding: 15px 30px;
  border-radius: 8px;
  border: 1px solid #ff4a4a;
}

.submit-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.leaderboard-section {
  background: #0f3460;
  padding: 15px;
  border-radius: 8px;
}

.refresh-btn {
  background: #e94560;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: #1a1a2e;
  margin-bottom: 5px;
  border-radius: 4px;
}

.rank { color: #e94560; font-weight: bold; }
.points { color: #42b983; font-weight: bold; }
.instruction { color: #888; font-size: 0.9rem; }
</style>
