import { createStore } from 'vuex';

export default createStore({
  state: {
    gameScore: 0,
    difficultyLevel: 1
  },
  getters: {
    currentScore(state) {
      return state.gameScore;
    }
  },
  mutations: {
    INCREMENT_SCORE(state) {
      state.gameScore++;
    },
    SET_DIFFICULTY(state, level) {
      state.difficultyLevel = level;
    },
    RESET_SCORE(state) {
      state.gameScore = 0;
    }
  },
  actions: {
    addScore({ commit }) {
      commit('INCREMENT_SCORE');
    },
    changeDifficulty({ commit }, level) {
      commit('SET_DIFFICULTY', level);
    },
    resetGame({ commit }) {
      commit('RESET_SCORE');
    }
  }
});
