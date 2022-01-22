<template>
  <b-modal v-model='isModalActive' @after-enter='modalEntered'>
    <div class="modal-parent columns">
      <div class="column"></div>
      <div class="column card is-narrow">
        <b-field label="Name">
          <b-input ref="newItemName" v-model='currentItem.text'></b-input>
        </b-field>
        <b-field>
            <b-select multiple v-model='currentItem.locations'>
                <option v-for='location_name in locations' :key='location_name'
                        :value='location_name' >
                  {{ location_name }}
                </option>
            </b-select>
        </b-field>
        <div class="buttons">
          <b-button type="is-success" @click='submitItem'>Save</b-button>
          <b-button @click='closeModal'>Cancel</b-button>
        </div>
      </div>
      <div class="column"></div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'EditListItem',
  props: ['value', 'currentItem', 'locations'],
  computed: {
    isModalActive: {
      get() {
        return this.value;
      },
      set() {
        this.closeModal();
      },
    },
  },
  methods: {
    modalEntered() {
      this.$refs.newItemName.focus();
    },
    submitItem() {
      this.$emit('submit', this.currentItem);
      this.closeModal();
    },
    closeModal() {
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="sass">
.select
  display: inline
</style>
