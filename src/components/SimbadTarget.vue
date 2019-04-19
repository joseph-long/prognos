<template>
  <div>
    <input @input="update" v-model="identifierInput">
    <button @click="lookup">SIMBAD lookup</button>
    RA=<input @input="update" v-model.number="raInput">, Dec=<input @input="update" v-model.number="decInput">
  </div>
</template>
<script>
import axios from 'axios';

export default {
  props: ["id", "value"],
  methods: {
    lookup: function () {
      let that = this;
      axios.get(`http://simbad.u-strasbg.fr/simbad/sim-id?Ident=${encodeURIComponent(this.value.identifier)}&output.format=ascii`).then(function (response) {
        let stringParts = response.data.match(/Coordinates\(ICRS,ep=J2000,eq=2000\): (\d+) (\d+) ([\d\.]+)\s+([+-\d]+) (\d+) ([\d.]+)/);
        console.log(stringParts);
        if (stringParts !== null) {
          let parts = stringParts.slice(1).map(Number);
          let decimalRA = (parts[0] / 24) * 360 + (parts[1] / (24 * 60)) * 360 + (parts[2] / (24 * 60 * 60)) * 360;
          let decimalDec = parts[3] + (parts[4] / 60) + (parts[5] / (60 * 60));
          console.log(`RA=${decimalRA}, Dec=${decimalDec}`);
          let value = {identifier: that.value.identifier, ra: decimalRA, dec: decimalDec};
          that.$emit('input', value);
        }
      })
    },
    update: function ($event) {
      this.$emit('input', {identifier: this.identifierInput, ra: this.raInput, dec: this.decInput});
    }
  },
  watch: {
    value: function (newValue) {
        this.identifierInput = newValue.identifier;
        this.raInput = newValue.ra;
        this.decInput = newValue.dec;
    }
  },
  data: function () {
    return {
      raInput: this.value.ra,
      decInput: this.value.dec,
      identifierInput: this.value.identifier
    };
  }
}
</script>