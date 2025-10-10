<script setup lang="ts">
import appStore from '@/stores/index'
import routerStore from '@/stores/router'
import { ref } from 'vue';
import Navbar from '@/layout/components/Navbar.vue'
import houseList from '@/views/house/index.vue'

// 监听设备类型
const aStore = appStore()
const rStore = routerStore()
aStore.setIsMobile()
window.addEventListener('resize', () => {
  aStore.setIsMobile()
})
// 主题设置
const theme = ref('')
theme.value = localStorage.getItem('pageTheme') || ''
if (theme.value === 'dark') {
  // 设置黑色主题
  document.body.setAttribute('arco-theme', 'dark')
} else {
  // 设置亮色主题
  document.body.removeAttribute('arco-theme');
}
// 路由history设置
const historyList = window.localStorage.getItem('cacheRoutes') || '[]'
rStore.setHistoryRouter(JSON.parse(historyList))

</script>

<template>
  <!-- 直接显示房屋列表页面，不使用路由 -->
  <div style="height: 100vh; width: 100vw;">
    <div style="height: 100%; width: 100%;">
      <Navbar />
      <div style="padding-top: 60px; height: calc(100% - 60px); background-color: var(--color-fill-2);">
        <houseList />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
