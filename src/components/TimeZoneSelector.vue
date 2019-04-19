<template>
    <div>
        <div>{{ value }}</div>
        <div>
            <input @input="update" v-bind:value="timezoneInput">
            <span>{{ validity ? "&#x2705" : "&#x1F6AB;"}}</span>
        </div>
    </div>
</template>
<script>
import { DateTime } from 'luxon';

function validateTimezone(timezone) {
    let tempDate = DateTime.local().setZone(timezone);
    return !(tempDate.invalidReason === "unsupported zone");
}

export default {
    props: ["value"],
    methods: {
        update: function ($event) {
            this.timezoneInput = $event.target.value;
            if (validateTimezone($event.target.value)) {
                this.$emit('input', this.timezoneInput)
            }
        }
    },
    computed: {
        validity: function () { return validateTimezone(this.timezoneInput); }
    },
    watch: {
        value: function (newValue) {
            this.timezoneInput = newValue;
        }
    },
    data: function () {
        return { timezoneInput: this.value };
    }
}
</script>
