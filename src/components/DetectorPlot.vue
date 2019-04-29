<template>
  <div id="plot"></div>
</template>
<style>
</style>
<script>
import Plotly from "plotly.js-dist";
import * as tf from '@tensorflow/tfjs';


var MAGELLAN_PRIMARY_MIRROR_DIAMETER = 6502.4;
var MAGELLAN_PRIMARY_STOP_DIAMETER = 6478.4;
var MAGELLAN_SECONDARY_AREA_FRACTION = 0.074;
var MAGELLAN_SECONDARY_DIAMETER = 2 * Math.sqrt(((MAGELLAN_PRIMARY_STOP_DIAMETER / 2)**2) * MAGELLAN_SECONDARY_AREA_FRACTION);
var MAGELLAN_SPIDERS_OFFSET = 0.34;
// Morzinski 2015 ApJ Table 18
var CLIO2_PIXEL_SCALE = 15.846e-3; // arcsec / px
// HAWAII-H1RG (http://www.teledyne-si.com/products/Documents/H1RG%20Brochure%20-%20September%202017.pdf)
var CLIO2_PIXEL_PITCH = 18; // um
var VAPP_PSF_ROTATION_DEG = -26;
var VAPP_PSF_OFFSET_LAMBDA_OVER_D = 35 / 2;
var VAPP_IWA_LAMD = 2, VAPP_OWA_LAMD = 7;
var VAPP_LEAKAGE_RATIO = 0.00636;
// offset of inner edge of dark hole from center of PSF, chosen more
// or less by eye from 3.9um simulated PSFs
var VAPP_OFFSET_LAMD = 1.793212;


export default {
  props: ["plan"],
  methods: {
    pointsForDarkHoleOutline: function (parity, wavelength, pixelscale, rotation, diameter) {
      var cutOnAngle = Math.asin(VAPP_OFFSET_LAMD / (VAPP_OWA_LAMD + VAPP_OFFSET_LAMD));

    }
  },
  mounted: function() {
    let TESTER = this.$el;
    var trace1 = {
      x: [2, 1, 8, 8],
      y: [0.25, 9, 2, 6],
      text: [
        "filled triangle",
        "filled Polygon",
        "Quadratic Bezier Curves",
        "Cubic Bezier Curves"
      ],
      mode: "text"
    };

    var layout = {
      title: "Basic Arbitrary SVG Paths",
      xaxis: {
        range: [0, 9],
        zeroline: false
      },
      yaxis: {
        range: [0, 11],
        showgrid: false
      },
      shapes: [
        //Quadratic Bezier Curves
        {
          type: "path",
          path: "M 4,4 Q 6,0 8,4",
          line: {
            color: "rgb(93, 164, 214)"
          }
        },
        //Cubic Bezier Curves
        {
          type: "path",
          path: "M 1,4 C 2,8 6,4 8,8",
          line: {
            color: "rgb(207, 114, 255)"
          }
        },
        //Filled Triangle
        {
          type: "path",
          path: "M 1 1 L 1 3 L 4 1 Z",
          fillcolor: "rgba(44, 160, 101, 0.5)",
          line: {
            color: "rgb(44, 160, 101)"
          }
        },
        //Filled Polygon
        {
          type: "path",
          path: " M 3,7 L2,8 L2,9 L3,10, L4,10 L5,9 L5,8 L4,7 Z",
          fillcolor: "rgba(255, 140, 184, 0.5)",
          line: {
            color: "rgb(255, 140, 184)"
          }
        }
      ]
    };

    var data = [trace1];

    Plotly.plot(TESTER, data, layout, { responsive: true });
  }
};
</script>
