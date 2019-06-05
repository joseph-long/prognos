<template>
<span>
  <span v-if="showNormalizedForm">{{ prefix }}{{ value }}{{ suffix }}</span>
  <span class="input-wrapper" :class="valid ? 'valid' : 'invalid'">
    {{ prefix }}
    <input
      @input="update($event)"
      v-bind:value="inputText"
      :size="characterLength">
    {{ suffix }}
  </span>
</span>
</template>
<style scoped>
.input-wrapper.invalid::after {
  content: "\1F612";
}
.input-wrapper.invalid input {
  border-bottom: 1px solid red;
}
.input-wrapper.valid::after {
  content: "\2705";
}
.input-wrapper.valid input {
  border-bottom: 1px solid blue;
}
input {
  border: none;
}
</style>

<script>
export default {
  props: {
    "value": [String, Number],
    "normalizer": Function,
    "prefix": String,
    "showNormalizedForm": {
      type: Boolean,
      default: false
    },
    "suffix": String
  },
  methods: {
      update: function($event) {
          this.inputText = $event.target.value;
          try {
            let value = this.normalizer($event.target.value);
            this.$emit('input', value);
            this.valid = true;
          } catch (e) {
            this.valid = false;
          }
      }
  },
  computed: {
    characterLength: function () {
      return Math.max(this.inputText.toString().length, 1);
    }
  },
  watch: {
      value: function (newValue) {
          this.inputText = newValue;
      }
  },
  data: function () {
      return {
          inputText: this.value,
          valid: true
      }
  }
}
</script>
