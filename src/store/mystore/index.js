import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import mystore from './mystore'

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
