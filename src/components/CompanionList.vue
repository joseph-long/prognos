<template>
    <ul>
        <li v-for="(companion, index) in companions">
            {{ index }}
            <input v-model.number="companion.separation"> &Prime;, PA:
            <input v-model.number="companion.pa">&deg; E of N <button @click="$bubble('remove-companion', index)">x</button>
        </li>
        <li><button @click="$bubble('append-companion')">+ add</button></li>
    </ul>
</template>
<script>
export default {
    props: ["companions"]
}
</script>
