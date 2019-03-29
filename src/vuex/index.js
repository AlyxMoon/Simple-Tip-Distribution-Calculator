import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'

Vue.use(Vuex)
const state = {
  employees: [],
  bills: [
    { type: 1, count: 0 },
    { type: 2, count: 0 },
    { type: 5, count: 0 },
    { type: 10, count: 0 },
    { type: 20, count: 0 },
    { type: 50, count: 0 },
    { type: 100, count: 0 }
  ],
  change: 0,
  change2: 0,
  page: 0,
  saving: false
}

export default new Vuex.Store({
  modules: { app: { state, actions, getters, mutations } },
  strict: process.env.NODE_ENV !== 'production'
})
