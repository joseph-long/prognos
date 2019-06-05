<template>
  <div id="plot">
    <Plotly :data="plotlyData" :layout="plotlyLayout" :display-mode-bar="false" :responsive="true"></Plotly>
  </div>
</template>
<style scoped>
#plot {
  width: 50vw;
  height: 50vw;
}
#plot .js-plotly-plot {
  width: 100%;
  height: 100%;
}
</style>
<script>
// import Plotly from "plotly.js-dist";
import { Plotly } from "vue-plotly";
import * as tf from "@tensorflow/tfjs";

const curvePointsCount = 50;

var MAGELLAN_PRIMARY_MIRROR_DIAMETER = 6502.4;
var MAGELLAN_PRIMARY_STOP_DIAMETER = 6478.4;
var MAGELLAN_SECONDARY_AREA_FRACTION = 0.074;
var MAGELLAN_SECONDARY_DIAMETER =
  2 *
  Math.sqrt(
    (MAGELLAN_PRIMARY_STOP_DIAMETER / 2) ** 2 * MAGELLAN_SECONDARY_AREA_FRACTION
  );
var MAGELLAN_SPIDERS_OFFSET = 0.34;
// Morzinski 2015 ApJ Table 18
var CLIO2_PIXEL_SCALE = 15.846e-3; // arcsec / px
// HAWAII-H1RG (http://www.teledyne-si.com/products/Documents/H1RG%20Brochure%20-%20September%202017.pdf)
var CLIO2_PIXEL_PITCH = 18; // um
var VAPP_PSF_ROTATION_DEG = -26;
var VAPP_PSF_OFFSET_LAMBDA_OVER_D = 35 / 2;
var VAPP_IWA_LAMD = 2,
  VAPP_OWA_LAMD = 7;
var VAPP_LEAKAGE_RATIO = 0.00636;
// offset of inner edge of dark hole from center of PSF, chosen more
// or less by eye from 3.9um simulated PSFs
var VAPP_OFFSET_LAMD = 1.793212;

export default {
  props: ["plan"],
  methods: {
    pointsForDarkHoleOutline: function(parity) {
      // parity, wavelength, pixelscale, rotation, diameter
      // const parity = 1;
      const rotation_deg = 55;
      const rotation = rotation_deg / 180 * Math.PI;
      const coron = this.plan.observation.coronagraph;
      const iwa = coron.iwa_lambdaOverD,
        owa = coron.owa_lambdaOverD;
      const cutOnAngle = Math.asin(iwa / owa);
      const theta = tf
        .linspace(0 + cutOnAngle, Math.PI - cutOnAngle, curvePointsCount)
        .add(Math.PI / 2 + parity * rotation);
      const xx = tf
          .cos(theta)
          .mul(parity * owa).arraySync(),
        yy = tf
          .sin(theta)
          .mul(owa).arraySync();
      const points = [];
      for (let i = 0; i < xx.length; i++) {
        points.push([xx[i], yy[i]]);
      }
      return points;
    },
    darkHoleOutlinePath: function(parity) {
      const points = this.pointsForDarkHoleOutline(parity);
      let pathString = `M ${points[0][0]} ${points[0][1]}`;
      for (let i = 1; i < points.length; i++) {
        pathString += `L ${points[i][0]} ${points[i][1]}`;
      }
      pathString += "Z";
      return pathString;
    }
  },
  data: function() {
    return {
      padding_lambdaOverD: 2
    };
  },
  components: {
    Plotly
  },
  computed: {
    owaBound: function() {
      return (
        this.plan.observation.coronagraph.owa_lambdaOverD +
        this.padding_lambdaOverD
      );
    },
    plotlyData: function() {
      return [
        {
          x: [0],
          y: [0],
          type: "scatter"
        },
        {
          xaxis: "x2",
          yaxis: "y2",
          x: [1, 2, 3, 4],
          y: [10, 15, 13, 17],
          type: "scatter"
        }
      ];
    },
    plotlyLayout: function() {
      const iwa = this.plan.observation.coronagraph.iwa_lambdaOverD,
        owa = this.plan.observation.coronagraph.owa_lambdaOverD;
      return {
        grid: {rows: 2, columns: 1, pattern: 'independent'},
        xaxis: {
          range: [-this.owaBound, this.owaBound],
          title: "X offset from star (λ / D)"
        },
        yaxis: {
          range: [-this.owaBound, this.owaBound],
          title: "Y offset from star (λ / D)",
          scaleanchor: "x",
          scaleratio: 1.0
        },
        shapes: [
          {
            type: "circle",
            x0: -iwa, x1: iwa,
            y0: -iwa, y1: iwa
          },
          {
            type: "circle",
            x0: -owa, x1: owa,
            y0: -owa, y1: owa
          },
          {
            type: "path",
            path: this.darkHoleOutlinePath(-1),
            fillcolor: "rgba(44, 160, 101, 0.5)",
            line: {
              color: "rgb(44, 160, 101)"
            }
          },
          {
            type: "path",
            path: this.darkHoleOutlinePath(1),
            fillcolor: "rgba(44, 160, 101, 0.5)",
            line: {
              color: "rgb(44, 160, 101)"
            }
          }
        ]
      };
    }
  }
};
</script>
