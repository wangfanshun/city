<script setup>
import {initCity} from './enter'
import {onMounted} from 'vue'
onMounted(() => {
  initCity()
})
</script>

<template>
<canvas id="webgl">浏览器不支持canvas,请切换浏览器重试</canvas>
</template>

<style scoped>
</style>
