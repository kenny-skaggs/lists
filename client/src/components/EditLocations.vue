<template>
  <div>
    <div>
      <b-field grouped v-for='location in mutableLocations' :key='location.id'>
        <b-input v-model='location.name' />
        <b-colorpicker v-model='location.color' />
      </b-field>
    </div>
    <br>
    <div class="buttons">
      <b-button type="is-success" @click='save'>Save</b-button>
      <b-button @click='cancel'>Cancel</b-button>
    </div>
  </div>
</template>

<script>
import Color from 'color';

export default {
  name: 'EditLocations',
  props: ['locationList'],
  data() {
    return {
      mutableLocations: [],
    };
  },
  mounted() {
    this.mutableLocations = this.locationList.map((location) => ({
      id: location.id,
      name: location.name,
      color: location.color,
    }));
  },
  methods: {
    save() {
      this.$emit('save', this.mutableLocations.map((location) => {
        let colorStr = location.color;
        if (typeof colorStr === 'object') {
          colorStr = Color(
            { r: location.color.red, g: location.color.green, b: location.color.blue },
          ).hex();
        }

        return {
          id: location.id,
          name: location.name,
          color: colorStr,
        };
      }));
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
