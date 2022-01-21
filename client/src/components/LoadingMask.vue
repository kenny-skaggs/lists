<template>
  <b-loading :is-full-page='true' v-model='showIsLoading' :can-cancel='false'></b-loading>
</template>

<script>
export default {
  props: ['isLoading'],
  data() {
    return {
      showIsLoading: false,
      loadDisplayTimeout: null,
    };
  },
  watch: {
    isLoading() {
      this.cancelTimer();
      if (this.isLoading) {
        this.loadDisplayTimeout = setTimeout(() => {
          this.showIsLoading = true;
          this.loadDisplayTimeout = null;
        }, 200);
      } else {
        this.showIsLoading = false;
      }
    },
  },
  methods: {
    cancelTimer() {
      if (this.loadDisplayTimeout !== null) {
        clearTimeout(this.loadDisplayTimeout);
      }
    },
  },
};
</script>
