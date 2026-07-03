<script setup>
import BadgeRow from './BadgeRow.vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    required: true,
  },
  badges: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="card">
    <h3 v-if="title">{{ title }}</h3>
    <BadgeRow v-if="badges.length" :items="badges" />
    <ul>
      <li v-for="item in items" :key="item" v-html="item" />
    </ul>
  </section>
</template>
