<template>
  <CreateList />
</template>

<script>
// @ is an alias to /src
import CreateList from '@/components/CreateGroceryList.vue';

export default {
  name: 'Home',
  components: {
    CreateList,
  },
};
</script>
