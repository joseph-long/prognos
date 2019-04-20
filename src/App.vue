<template>
  <div id="main">
    <div id="preview">
     <detector-plot></detector-plot>
    </div>
    <div id="controls">
      <controls
        v-bind:plan="plan"
        @apply-preset="applyPreset"
        @append-companion="appendCompanion"
        @remove-companion="removeCompanion"></controls>
      <pre>{{ plan }}</pre>
      <a :href="'#' + planStateURL">state</a>
    </div>
  </div>
</template>
<style lang="css">
html, body {
  padding: 0;
  margin: 0;
  font-family: sans-serif;
}
#preview, #controls {
  padding: 1rem;
}

#preview {
  flex: 1;
  background-color: gray;
}

#controls {
  min-width: 15rem;
  overflow: scroll;
  font-size: 90%;
}
#main {
  display: flex;
  width: 100vw;
  height: 100vh;
}

input {
  font-size: inherit;
}
ul { padding: 0}
li {
  display: flex;
}
li > * {
  width: 50%;
}
</style>

<script>
import Controls from "./components/Controls.vue";
import DetectorPlot from "./components/DetectorPlot.vue";
import { DateTime } from 'luxon';
import Vue from 'vue';

Vue.use((Vue) => {
  Vue.prototype.$bubble = function $bubble(eventName, ...args) {
    // Emit the event on all parent components
    let component = this;
    do {
      console.log(args);
      component.$emit(eventName, ...args);
      component = component.$parent;
    } while (component);
  };
});


export default {
  components: {
    Controls,
    DetectorPlot
  },
  methods: {
    applyPreset: function (presetData) {
      patchPlan(this.plan, presetData)
    },
    appendCompanion: function () {
      console.log("Add companion...");
      this.plan.companions.push({separation: 1, pa: 0});
    },
    removeCompanion: function (index) {
      console.log("Remove companion at...", index);
      this.plan.companions.splice(index, 1);
    },
    updateFromHash: function () {
      if (window.location.hash.length > 1) {
        let injectplan = JSON.parse(decodeURIComponent(window.location.hash.slice(1)));
        console.log(injectplan);
        patchPlan(this.plan, injectplan);
        console.log(this.plan);
      }
    }
  },
  created: function () {
    this.updateFromHash();
    window.addEventListener('hashchange', this.updateFromHash);
  },
  computed: {
    planStateURL: function () {
      return encodeURIComponent(JSON.stringify(this.plan));
    }
  },
  data: function () {
    return {
      plan: {
        observatory: {
          latitude: 0,
          longitude: 0,
          timeZone: 'America/Santiago'
        },
        observation: {
          date: {year: 2019, month: 1, day: 1},
          coronagraph: {
            name: "gvAPP 180",
            iwa: 2,
            owa: 7,
            offset: 1.793212
          }
        },
        target: {
          identifier: "",
          ra: 0,
          dec: 0
        },
        companions: []
      }
    }
  }
}
</script>