<template>
  <div id="main">
    <div id="preview">
     <detector-plot v-bind:plan="plan"></detector-plot>
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
      component.$emit(eventName, ...args);
      component = component.$parent;
    } while (component);
  };
});

function nextUnusedCompanionId(companions) {
  let ids = companions.map((value) => value.id);
  let id = 0;
  while (ids.includes(id)){
    id++;
  }
  return id;
}

function companionIdToIndex(companionId, companions) {
  return Array.from(companions).findIndex((companion) => companion.id == companionId);
}


export default {
  components: {
    Controls,
    DetectorPlot
  },
  methods: {
    applyPreset: function (presetData) {
      this.patchPlan(this.plan, presetData)
    },
    appendCompanion: function () {
      this.plan.companions.push({id: nextUnusedCompanionId(this.plan.companions), separation: 1, pa: 0});
    },
    removeCompanion: function (companionId) {
      let index = companionIdToIndex(companionId, this.plan.companions);
      if (index > -1) {
        this.plan.companions.splice(index, 1);
      } else {
        console.error("Missing companion?");
      }
    },
    updateFromHash: function () {
      if (window.location.hash.length > 1) {
        let injectPlan = JSON.parse(decodeURIComponent(window.location.hash.slice(1)));
        this.patchPlan(this.plan, injectPlan);
      }
    },
    patchPlan: function patchPlan(plan, planPatch) {
      for (var key in planPatch) {
        this.$set(this.plan, key, planPatch[key]);
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
    let currentDateStamp = DateTime.local().toISODate();
    return {
      "plan": {
        "observatory": {
          "latitude": -29.0146,
          "longitude": -70.6926,
          "timeZone": "America/Santiago"
        },
        "observation": {
          "date": currentDateStamp,
          "coronagraph": {
            "name": "gvAPP 180",
            "iwa_lambdaOverD": 2,
            "owa_lambdaOverD": 7,
            "centerWavelength_um": 3.9,
            "offset_lambdaOverD": 1.793212
          }
        },
        "target": {
          "identifier": "51 Eri",
          "ra": 69.40055129919459,
          "dec": -1.526450325851111
        },
        "companions": [
          {
            "id": 0,
            "separation": 0.449,
            "pa": 170
          }
        ]
      }
    };
  }
}
</script>