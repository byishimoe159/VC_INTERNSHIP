<template>
  <div class="game-container">
    <h2>Dino Jump Game (Activity 5-9)</h2>
    <p class="score-display">Current Score (Vuex): <span>{{ currentScore }}</span></p>
    
    <!-- Game Over Screen -->
    <div v-if="gameOver" class="game-over-screen">
      <div class="game-over-box">
        <h3>GAME OVER!</h3>
        <p>You scored {{ currentScore }} points!</p>
        <button @click="saveAndReset" class="submit-btn">Submit Score & Restart</button>
      </div>
    </div>

    <!-- Game Play Area -->
    <div class="game-area">
      <!-- Player Character -->
      <div class="player" :class="{ 'jumping': isJumping }"></div>
      <!-- Obstacle -->
      <div class="obstacle" :style="{ left: obstacleX + 'px' }"></div>
      <!-- Ground Line -->
      <div class="ground"></div>
    </div>
    
    <p class="instruction">Press <strong>SPACEBAR</strong> to Jump!</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import gameService from '@/services/gameService';

export default {
  data() {
    return {
      gameOver: false,
      isJumping: false,
      obstacleX: 500,
      animationFrameId: null,
      // Audio Objects
      jumpSound: null,
      scoreSound: null,
      bgMusic: null
    };
  },
  computed: {
    ...mapGetters(['currentScore'])
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
    ...mapActions(['addScore', 'resetGame']),
    
    initAudio() {
      // Gukoresha links z'amajwi ya internet kugira ngo bidateza error
      this.jumpSound = new Audio('https://mixkit.co');
      this.scoreSound = new Audio('https://mixkit.co');
      this.bgMusic = new Audio('https://soundhelix.com');
      
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.1; // Umuziki utaza urunguruka cyane
      
      // Kunyura kuri autoplay block ya browser
      document.addEventListener('click', () => {
        this.bgMusic.play().catch(e => console.log("Audio play blocked"));
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
      this.resetGame();
      this.gameOver = false;
      this.obstacleX = 500;
      this.gameLoop();
    },

    gameLoop() {
      if (this.gameOver) return;

      // Kugenda kw'urubari rutuku (Obstacle) - Umuvuduko ni 6
      this.obstacleX -= 6;

      // Iyo runyuze inyuma ya screen, rurasubira inyuma hanyuma ukanahabwa inota
      if (this.obstacleX < -30) {
        this.obstacleX = 500;
        this.addScore();
        this.playSound('score');
      }

      this.checkCollision();

      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    },

    handleKeyDown(e) {
      if (e.code === 'Space') {
        e.preventDefault(); // Kubuza page kumanuka hasi iyo ukanze space
        this.jump();
      }
    },

    jump() {
      if (this.isJumping || this.gameOver) return;
      this.isJumping = true;
      this.playSound('jump');
      
      // Igihe cyo kumara mu kirere (500ms)
      setTimeout(() => {
        this.isJumping = false;
      }, 500);
    },

    checkCollision() {
      // Kugenzura niba umukinnyi n'urubari bigonganye
      // Umukinnyi ari kuri x: 50. Niba urubari ruri hagati ya x: 20 na x: 80, kandi umukinnyi adasambutse -> Umukino urahagarara
      if (this.obstacleX > 20 && this.obstacleX < 80 && !this.isJumping) {
        this.gameOver = true;
        cancelAnimationFrame(this.animationFrameId);
      }
    },

    async saveAndReset() {
      const name = prompt("Enter your name for the Leaderboard:");
      if (name) {
        try {
          await gameService.submitHighScore(name, this.currentScore);
          alert("Your score has been sent successfully to the API!");
          this.$emit('scoreSubmitted');
        } catch (error) {
          alert("Failed to send score, but restarting game!");
        }
      }
      this.startGame();
    }
  }
};
</script>

<style scoped>
.game-container {
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-top: 20px;
}
.score-display {
  font-size: 1.2rem;
  font-weight: bold;
}
.score-display span {
  color: #42b983;
}
.game-area {
  width: 500px;
  height: 200px;
  border: 3px solid #333;
  border-radius: 8px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.player {
  width: 40px;
  height: 40px;
  background: #35495e;
  border-radius: 4px;
  position: absolute;
  bottom: 10px;
  left: 50px;
  transition: bottom 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.player.jumping {
  bottom: 90px;
  background: #42b983;
}
.obstacle {
  width: 25px;
  height: 35px;
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
  color: white;
}
.game-over-box {
  background: #222;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ff4a4a;
}
.submit-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #339966;
}
.instruction {
  color: #777;
  margin-top: 10px;
}
</style>
