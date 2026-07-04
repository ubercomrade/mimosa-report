<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  dataId: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="card" :data-id="dataId || undefined">
    <h3 v-if="title">{{ title }}</h3>
    <p v-if="text">{{ text }}</p>
    <slot />
  </section>
</template>
