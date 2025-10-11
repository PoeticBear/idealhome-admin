import { defineStore } from 'pinia';
import router from '@/router/index';
import { getUserInfo } from '@/api/user';
import routerStore from './router';

interface userInfoType {
  id: string | number
  name: string | number
  remark: string | number
  phone: string | number
  status: number
  head_img: string
  created_at: string
  updated_at: string
}
interface userState {
  userInfo: userInfoType
}
export default defineStore('user', {
  state: (): userState => {
    return {
      userInfo: {
        id: '',
        name: '',
        remark: '',
        phone: '',
        status: 1,
        head_img: '',
        created_at: '',
        updated_at: ''
      }
    }
  },
  actions: {
    setUserInfo (data: userInfoType) {
      this.userInfo = data
    },
    logOut () {
      const rStore = routerStore()
      // 清除本地存储
      window.localStorage.removeItem('cacheRoutes')
      window.localStorage.removeItem('token')
      // 清除用户信息
      this.userInfo = {
        id: '',
        name: '',
        remark: '',
        phone: '',
        status: 1,
        head_img: '',
        created_at: '',
        updated_at: ''
      }
      // 清除路由历史
      rStore.removeHistoryRouter()
      // 跳转到登录页
      router.push('/login')
    },
    getUserInfo () {
      return getUserInfo().then(({
        status,
        data
      }) => {
        if (status === 1) {
          this.userInfo = data
        }
      })
    }
  }
})
