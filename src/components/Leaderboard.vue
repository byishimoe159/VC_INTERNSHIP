<template>
  <div class="leaderboard">
    <h3>🏆 Top Players (Axios API)</h3>
    <button @click="loadScores" class="refresh-btn">🔄 Refresh Scores</button>
    
    <div v-if="loading" class="loading-text">Loading scores from backend...</div>
    
    <ul v-else>
      <li v-for="(user, index) in scores" :key="user.id" class="score-item">
        <span class="rank">#{{ index + 1 }}</span>
        <span class="name">{{ user.name }}</span>
        <span class="points">{{ user.score }} pts</span>
      </li>
    </ul>
  </div>
</template>

<script>
import gameService from '@/services/gameService';

export default {
  data() {
    return {
      scores: [],
      loading: false
    };
  },
  mounted() {
    this.loadScores();
  },
  methods: {
    async loadScores() {
      this.loading = true;
      try {
        this.scores = await gameService.fetchHighScores();
      } catch (error) {
        console.error("Failed loading scores.");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.leaderboard h3 {
  margin-top: 0;
  color: #e94560;
}

.refresh-btn {
  background: #e94560;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 15px;
  transition: 0.2s;
}

.refresh-btn:hover {
  background: #ff6b81;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #1a1a2e;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #16213e;
}

.rank {
  color: #e94560;
  font-weight: bold;
}

.name {
  flex-grow: 1;
  margin-left: 15px;
  color: #ddd;
}

.points {
  color: #4e9f3d;
  font-weight: bold;
}

.loading-text {
  color: #888;
  font-style: italic;
}
</style>
