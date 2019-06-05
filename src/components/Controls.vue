<template>
  <div>
    <div id="observatory">
      <h1>Observatory</h1>
      <div>
        <button
          v-for="preset in presets"
          @click="$emit('apply-preset', preset.payload)"
          v-bind:key="preset.name"
        >{{ preset.name }}</button>
      </div>
      <ul>
        <li>
          <label>Latitude</label>
          <input v-model.number="plan.observatory.latitude">
        </li>
        <li>
          <label>Longitude</label>
          <input v-model.number="plan.observatory.longitude">
        </li>
        <li>
          <label>Time zone (IANA)</label>
          <time-zone-selector v-model="plan.observatory.timeZone"></time-zone-selector>
        </li>
        <li>
          <label>Local date at nightfall</label>
          <date-entry v-model="plan.observation.date" v-bind:timezone="plan.observatory.timeZone"></date-entry>
        </li>
        <li>
          <label>Julian date (at noon)</label>
          {{ julianDate }}
        </li>
        <li>Sunset</li>
        <li>Sunrise</li>
      </ul>
    </div>
    <div id="observation">
      <h1>Observation</h1>
      <ul>
        <li>
          <label>Coronagraph style</label>
          <select>
            <option>gvAPP 180</option>
            <option>gvAPP 360</option>
          </select>
        </li>
        <li>
          <label>Inner working angle</label>
          <normalized-input
            :normalizer="makeNumericNormalizer(1, plan.observation.coronagraph.owa_lambdaOverD)"
            v-model="plan.observation.coronagraph.iwa_lambdaOverD"
            :show-normalized-form="true"
            suffix=" λ / D"
          ></normalized-input>
        </li>
        <li>
          <label>Outer working angle</label>
          <normalized-input
            :normalizer="makeNumericNormalizer(plan.observation.coronagraph.iwa_lambdaOverD, 18)"
            v-model="plan.observation.coronagraph.owa_lambdaOverD"
            :show-normalized-form="true"
            suffix=" λ / D"
          ></normalized-input>
        </li>
        <li>
          <label>Center wavelength</label>
          <normalized-input
            :normalizer="makeNumericNormalizer(1, 10)"
            v-model="plan.observation.coronagraph.centerWavelength_um"
            :show-normalized-form="true"
            suffix=" µm"
          ></normalized-input>
        </li>
      </ul>
    </div>
    <div id="target">
      <h1>Target</h1>
      <simbad-target v-model="plan.target"></simbad-target>
    </div>
    <div id="companions">
      <h1>Companions</h1>
      <companion-list v-bind:companions="plan.companions"></companion-list>
    </div>
  </div>
</template>
<script>
import DateEntry from "./DateEntry.vue";
import TimeZoneSelector from "./TimeZoneSelector.vue";
import SimbadTarget from "./SimbadTarget.vue";
import CompanionList from "./CompanionList.vue";
import NormalizedInput from "./NormalizedInput.vue";
import { toJulianDate } from "@/astroCalc.js";
import { DateTime } from 'luxon';
// import SunCalc from 'suncalc';
import * as AA from 'astronomical-algorithms';

export default {
  toJulianDate,
  components: {
    DateEntry,
    TimeZoneSelector,
    SimbadTarget,
    CompanionList,
    NormalizedInput
  },
  props: ["plan"],
  computed: {
    julianDate: function() {
      console.log(AA.transits.getRiseSetTransitTimes);
      let date = this.plan.observation.date;
      // let currentDate = DateTime.fromObject({day: 22, hour: 12, zone: 'America/Los_Angeles'});
      let currentDate = DateTime.local();
      let jd = AA.julianday.getJulianDay(currentDate.toJSDate());
      let oldJd = toJulianDate(date.year, date.month, date.day);
      console.log('jd', jd, 'oldJd', oldJd);
      return oldJd;
    }
  },
  methods: {
    makeNumericNormalizer: function(min, max) {
      return function(value) {
        let numericValue = Number(value);
        if (!isNaN(numericValue) && isFinite(numericValue)) {
          if (min != undefined && numericValue >= min) {
            if (max != undefined && numericValue <= max) {
              return numericValue;
            }
          }
        }
        throw new Error(`${numericValue} not in bounds [${min}, ${max}]`);
      };
    }
  },
  data: function() {
    return {
      presets: [
        {
          name: "Magellan",
          payload: {
            observatory: {
              latitude: -29.0146,
              longitude: -70.6926,
              timeZone: "America/Santiago"
            }
          }
        },
        {
          name: "Subaru",
          payload: {
            observatory: {
              latitude: 19.825556,
              longitude: -155.476111,
              timeZone: "Pacific/Honolulu"
            }
          }
        },
        {
          name: "LBT",
          payload: {
            observatory: {
              latitude: 32.7016,
              longitude: -109.8719,
              timeZone: "America/Phoenix"
            }
          }
        }
      ]
    };
  }
};
</script>
