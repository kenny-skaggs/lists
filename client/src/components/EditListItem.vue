<template>
  <b-modal v-model='isModalActive' @after-enter='modalEntered'>
    <div class="modal-parent columns">
      <div class="column"></div>
      <ValidationObserver v-slot='{ handleSubmit }'>
        <form class="column card is-narrow" @submit.prevent='handleSubmit(submitItem)'>
          <b-field label="Name">
            <ValidationProvider name="name" rules="required" v-slot='{ errors }'>
              <b-input ref="newItemName" v-model='currentItem.text'></b-input>
              <span class="error-message">{{ errors[0] }}</span>
            </ValidationProvider>
          </b-field>
          <b-field>
            <ValidationProvider name="location" rules="oneOrMore" v-slot='{ errors }'>
              <b-select multiple v-model='currentItem.locations'>
                  <option v-for='location_name in locations' :key='location_name'
                          :value='location_name'>
                    {{ location_name }}
                  </option>
              </b-select>
              <span class="error-message">{{ errors[0] }}</span>
            </ValidationProvider>
          </b-field>
          <div class="buttons">
            <b-button type="is-success" native-type="submit">Save</b-button>
            <b-button @click='closeModal'>Cancel</b-button>
          </div>
        </form>
      </ValidationObserver>
      <div class="column"></div>
    </div>
  </b-modal>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

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
      // this.$emit('submit', this.currentItem);
      this.closeModal();
    },
    closeModal() {
      this.$emit('input', false);
    },
  },
  components: { ValidationProvider, ValidationObserver },
};
</script>

<style lang="sass">
.select
  display: inline

</style>
