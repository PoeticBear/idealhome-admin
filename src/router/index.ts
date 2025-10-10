import { createRouter, createWebHistory } from 'vue-router';
import routerEach from './routerEach';

export const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/houseList/houseList',
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/login',
    name: 'login',
    // eslint-disable-next-line import/no-unresolved
    component: () => import('@/views/login/login.vue'),
    meta: {
      hideInMenu: true,
      icon: 'icon-tiktok-color',
      title: '登录'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/layout/index.vue'),
    redirect: '/home/index',
    meta: {
      icon: 'icon-command',
      title: '首页',
      hideInMenu: true
    },
    children: [
      {
        path: 'index',
        name: 'homeIndex',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/houseList',
    name: 'houseList',
    component: () => import('@/layout/index.vue'),
    redirect: '/houseList/houseList',
    meta: {
      icon: 'icon-home',
      title: '房屋列表'
    },
    children: [
      {
        path: 'houseList',
        name: 'houseListChild',
        component: () => import('@/views/house/houseList.vue'),
        meta: {
          title: '房屋列表'
        }
      }
    ]
  },
  {
    path: '/tenantsList',
    name: 'tenantsList',
    component: () => import('@/layout/index.vue'),
    redirect: '/tenantsList/tenantsList',
    meta: {
      icon: 'icon-user-group',
      title: '租客管理'
    },
    children: [
      {
        path: 'tenantsList',
        name: 'tenantsListChild',
        component: () => import('@/views/tenants/tenantsList.vue'),
        meta: {
          title: '租客列表'
        }
      }
    ]
  },
  {
    path: '/comments',
    name: 'comments',
    component: () => import('@/layout/index.vue'),
    redirect: '/comments/list',
    meta: {
      icon: 'icon-message',
      title: '评论管理',
      hideInMenu: true
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/comments/comments.vue'),
        meta: {
          title: '评论列表'
        }
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/layout/index.vue'),
    redirect: '/settings/systemSettings',
    meta: {
      icon: 'icon-settings',
      title: '系统管理',
      hideInMenu: true
    },
    children: [
      {
        path: 'systemSettings',
        name: 'systemSettings',
        component: () => import('@/views/settings/systemSettings.vue'),
        meta: {
          title: '系统设置'
        }
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/not-found/index.vue'),
    meta: {
      hideInMenu: true
    }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
});
routerEach(router)
export default router;
