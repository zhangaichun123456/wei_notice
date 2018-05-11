import Vue from 'vue'
import Router from 'vue-router'
// import notice from '@/components/notice'
// import detail from '@/components/detail'
// import sendnotice from '@/components/sendnotice'
// import sendsteptwo from '@/components/sendsteptwo'
// import sendrange from '@/components/sendrange'
// import readnum from '@/components/readnum'
const notice = () => import('@/components/notice.vue')
const detail = () => import('@/components/detail.vue')
const sendnotice = () => import('@/components/sendnotice.vue')
const sendsteptwo = () => import('@/components/sendsteptwo.vue')
const sendrange = () => import('@/components/sendrange.vue')
const readnum = () => import('@/components/readnum.vue')

Vue.use(Router)

export default new Router({
  routes: [
	    {
	      path: '/',
	      redirect:'/notice',
	    },
	    {
	      path: '/notice',
	      name: 'notice',
	      component: notice
	    },
      {
        path: '/detail',
        name: 'detail',
        component: detail
      },
      {
        path: '/sendnotice',
        name: 'sendnotice',
        component: sendnotice
      },
      {
        path: '/sendsteptwo',
        name: 'sendsteptwo',
        component: sendsteptwo
      },
      {
        path: '/sendrange',
        name: 'sendrange',
        component: sendrange
      },
      {
        path: '/readnum',
        name: 'readnum',
        component: readnum
      }
  ],

  // 返回时保持之前页面滚动位置
  scrollBehavior (to, from, savedPosition) {
       if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
  }
})
