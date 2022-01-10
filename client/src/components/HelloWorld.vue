<template>
  <div class="list">
    <b-field v-for='(item, index) in items' :key='index'>
      <b-checkbox>
        {{ item }}
      </b-checkbox>
    </b-field>
    <button class="button is-primary">Primary</button>
    <button class="button is-info">Info</button>
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      items: [
        'one',
        'two',
        'three',
        'four',
        'five',
      ],
    };
  },
};
</script>
