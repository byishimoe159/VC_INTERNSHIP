import axios from 'axios';

const API_BASE_URL = 'https://typicode.com';

export default {
  async submitHighScore(playerName, score) {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, {
        title: playerName,
        body: `Score: ${score}`,
        userId: 1,
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting score:", error);
      throw error;
    }
  },

  async fetchHighScores() {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts?_limit=5`);
      return response.data.map((item, index) => ({
        id: item.id,
        name: item.title || `Player ${index + 1}`,
        score: Math.floor(Math.random() * 100) + 10
      }));
    } catch (error) {
      console.error("Error fetching scores:", error);
      throw error;
    }
  }
};