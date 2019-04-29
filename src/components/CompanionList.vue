<template>
  <ul>
    <li v-for="companion in companions" v-bind:key="companion.id">
      {{ companion.id }}
      <input v-model.number="companion.separation"> &Prime;, PA:
      <input v-model.number="companion.pa">&deg; E of N <button @click="$bubble('remove-companion', companion.id)">x</button>
    </li>
    <li><button @click="$bubble('append-companion')">+ add</button></li>
  </ul>
</template>
<script>
export default {
    props: ["companions"]
}
</script>
