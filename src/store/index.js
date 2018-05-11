import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'

Vue.use(Vuex)

const state = {
       entId:null,
       token:null,
       dptchecklist:[],
       empchecklist:[],
       noticetitle:'',
       noticewriter:'',
       noticecontent:'',
}

export default new Vuex.Store({
	state,
	mutations,
})
