<template>
  <div id="app">
    <el-container>
      <el-header>
        <div class="header">
          <h1>MIPYAO 产品询价系统</h1>
          <div class="user-info">
            <el-button type="text">登录</el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #409eff;
  color: white;
}

.header h1 {
  margin: 0;
  font-size: 20px;
}

.user-info {
  color: white;
}
</style>
