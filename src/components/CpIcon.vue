<script lang="ts" setup>
defineProps<{
  name: string
}>()
</script>

<template>
  <svg class="cp-icon">
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<style lang="scss" scoped>
.cp-icon {
  width: 1em;
  height: 1em;
}
</style>
