<template>
    <div>
      <div id="observatory">
      <h1>
        Observatory
      </h1>
      <div>
        <button v-for="preset in presets" @click="$emit('apply-preset', preset.payload)" v-bind:key="preset.name">{{ preset.name }}</button>
      </div>
      <ul>
        <li><label>Latitude</label><input v-model.number="plan.observatory.latitude"></li>
        <li><label>Longitude</label><input v-model.number="plan.observatory.longitude"></li>
        <li><label>Time zone (IANA)</label><time-zone-selector v-model="plan.observatory.timeZone"></time-zone-selector></li>
        <li><label>Local date at nightfall</label><date-entry v-model="plan.observation.date" v-bind:timezone="plan.observatory.timeZone"></date-entry></li>
        <li><label>Julian date (at noon)</label>{{ julianDate }}</li>
        <li>Sunset</li>
        <li>Sunrise</li>
      </ul>
      </div>
      <div id="observation">
      <h1>
        Observation
      </h1>
      <ul>
        <li><label>Coronagraph style</label><select><option>gvAPP 180</option><option>gvAPP 360</option></select></li>
        <li><label>Inner working angle</label><div><input v-model.number="plan.observation.coronagraph.iwa_lambdaOverD"> &lambda; / D</div></li>
        <li><label>Outer working angle</label><div><input v-model.number="plan.observation.coronagraph.owa_lambdaOverD"> &lambda; / D</div></li>
        <li><label>Center wavelength</label><div><input v-model.number="plan.observation.coronagraph.centerWavelength_um"> &mu;m</div></li>
      </ul>
      </div>
  <div id="target">
    <h1>
    Target
    </h1>
    <simbad-target v-model="plan.target"></simbad-target>
  </div>
  <div id="companions">
    <h1>
    Companions
    </h1>
    <companion-list v-bind:companions="plan.companions"></companion-list>
  </div>
    </div>
</template>
<script>
import DateEntry from './DateEntry.vue';
import TimeZoneSelector from './TimeZoneSelector.vue';
import SimbadTarget from './SimbadTarget.vue';
import CompanionList from './CompanionList.vue';
import { toJulianDate } from '@/astroCalc.js';
// import SunCalc from 'suncalc';

export default {
  toJulianDate,
  components: {
    DateEntry,
    TimeZoneSelector,
    SimbadTarget,
    CompanionList
  },
  props: ["plan"],
  computed: {
    julianDate: function () {
      let date = this.plan.observation.date;
      return toJulianDate(date.year, date.month, date.day);
    }
  },
  data: function () {
    return {
      presets: [
        {name: "Magellan", payload: {observatory: {latitude: -29.0146, longitude: -70.6926, timeZone: "America/Santiago"}}},
        {name: "Subaru", payload: {observatory: {latitude: 19.825556, longitude: -155.476111, timeZone: "Pacific/Honolulu"}}},
        {name: "LBT", payload: {observatory: {latitude: 32.7016, longitude: -109.8719, timeZone: "America/Phoenix"}}}
      ]
    }
  }
}
</script>
