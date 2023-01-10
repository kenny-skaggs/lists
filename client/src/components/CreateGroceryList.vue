<template>
  <div class="column footer-container">
    <LoadingMask :isLoading='isLoading' />

    <div class="buttons">
      <b-button :class='{ filterOn: filters.includes(location.name), [location.name]: true }'
        @click='toggleFilter(location.name)' v-for='location in locations' :key='location.id' :style='{
          "background-color": location.color,
          "color": getTextColor(location.color)
        }'>
        {{ location.name }}
      </b-button>
      <a class="under-link" @click='showLocationListModal = true'>Edit Locations</a>
    </div>
    <div class="footer">
      <b-autocomplete rounded placeholder="Search for item to add" v-model='searchText' dropdown-position='top'
        :data='searchResults' field='text' :clear-on-select='true' keep-first @select='toggleItem'>
        <template #empty>
          "{{ searchText }}" not found
        </template>
        <template #footer>
          <a @click='clickedAddNewItem'><span> Add new... </span></a>
        </template>
      </b-autocomplete>
    </div>

    <transition-group name="item-list">
      <div class="item-row" v-for='item in displayedItems' :key='item.id' @click='toggleItem(item, false)'>
        <div class="column is-2">
          {{ item.text }}
        </div>
        <b-taglist>
          <b-tag type="is-primary" class="location" v-for='locationName in item.locations' :key='locationName'
            style="font-size: 0.6em" :style='{ "background-color": locationColorMap[locationName] }'>
            {{ locationName }}
          </b-tag>
        </b-taglist>
        <span class="column"></span>
        <div class="column is-narrow buttons">
          <b-button @click.stop='editItem(item)'>Edit</b-button>
        </div>
      </div>
    </transition-group>

    <EditItemModal v-model='isAddModalActive' :currentItem='editingItem' @submit='saveItemUpdates'
      :locations='locations' />

    <b-modal v-model='showLocationListModal'>
      <EditLocations :location-list='locations' @save='saveLocations' @cancel='cancelLocations' />
    </b-modal>
  </div>
</template>

<script>
import Color from 'color';

import EditItemModal from '@/components/EditListItem.vue';
import LoadingMask from '@/components/LoadingMask.vue';
import EditLocations from './EditLocations.vue';

export default {
  name: 'CreateGroceryList',
  components: { EditItemModal, LoadingMask, EditLocations },
  mounted() {
    this.isLoadingItems = true;
    this.isLoadingLocations = true;
    this.$socket.client.emit('load_items', (items) => {
      this.isLoadingItems = false;
      this.items = items;
    });
    this.$socket.client.emit('load_locations', (locationList) => {
      this.isLoadingLocations = false;
      this.locations = locationList;
      this.filters = locationList.map((location) => location.name);

      this.locationColorMap = {};
      locationList.forEach((location) => {
        this.locationColorMap[location.name] = location.color;
      });
    });
  },
  data() {
    return {
      isLoadingItems: false,
      isLoadingLocations: false,
      isUpdatingItem: false,
      isUpdatingLocations: false,
      searchText: '',
      newItemName: '',
      isAddModalActive: false,
      editingItem: {},
      itemTemplate: {
        id: -1,
        text: '',
        isNeeded: true,
        locations: [],
        notes: '',
      },
      filters: [],
      locations: [],
      items: null,
      showLocationListModal: false,
      locationColorMap: {},
    };
  },
  computed: {
    isLoading() {
      return (
        this.isLoadingItems
        || this.isLoadingLocations
        || this.isUpdatingItem
        || this.isUpdatingLocations
      );
    },
    searchResults() {
      if (this.items === null) {
        return [];
      }

      const lowerSearch = this.searchText.toLowerCase();
      return this.items.filter((item) => item.text.toLowerCase().includes(lowerSearch));
    },
    displayedItems() {
      if (this.items === null) {
        return [];
      }

      return this.items.filter((item) => item.isNeeded)
        .filter((item) => item.locations.some((location) => this.filters.includes(location)))
        .sort((one, two) => {
          const textA = one.text.toLowerCase();
          const textB = two.text.toLowerCase();
          if (textA < textB) {
            return -1;
          }
          if (textA > textB) {
            return 1;
          }
          return 0;
        });
    },
  },
  methods: {
    editItem(item) {
      this.editingItem = { ...item };
      this.isAddModalActive = true;
    },
    clickedAddNewItem() {
      this.editingItem = { ...this.itemTemplate };
      this.editingItem.text = this.searchText;
      this.isAddModalActive = true;
    },
    findNextItemId() {
      const ids = this.items.map((item) => item.id);
      return Math.max(...ids) + 1;
    },
    saveItemUpdates(updatedItem) {
      const itemToUpdate = this.items.find((item) => item.id === this.editingItem.id);
      if (itemToUpdate === undefined) {
        updatedItem.id = this.findNextItemId();
        this.upsertItem(updatedItem, () => this.items.push(updatedItem));
      } else {
        this.upsertItem(updatedItem, () => Object.assign(itemToUpdate, updatedItem));
      }
    },
    toggleFilter(filter) {
      const filterIndex = this.filters.indexOf(filter);
      if (filterIndex > -1) {
        this.filters.splice(filterIndex, 1);
      } else {
        this.filters.push(filter);
      }
      document.activeElement.blur();
    },
    toggleItem(item, shouldAdd = true) {
      if (item === null) {
        // The autocomplete clears the selection occasionally
        return;
      }

      const concreteItem = this.items.find((possibleItem) => possibleItem.id === item.id);

      if (shouldAdd && concreteItem.isNeeded) {
        this.$buefy.toast.open({
          message: `Already have ${concreteItem.text} listed`,
          position: 'is-bottom',
        });
      } else {
        const updateCommand = shouldAdd ? 'need_item' : 'do_not_need_item';

        this.isUpdatingItem = true;
        this.$socket.client.emit(updateCommand, concreteItem.id, () => {
          this.isUpdatingItem = false;
          this.listToggleItem(concreteItem.id, shouldAdd);
        });
      }
    },
    listToggleItem(itemId, shouldAdd) {
      const item = this.items.find((possibleItem) => possibleItem.id === itemId);
      item.isNeeded = shouldAdd;
      this.toastItemUpdate(item.text, shouldAdd);
    },
    toastItemUpdate(itemName, isAdded) {
      let toastMessage = '';
      if (isAdded) {
        toastMessage = `Added ${itemName}`;
      } else {
        toastMessage = `Removed ${itemName}`;
      }
      this.$buefy.toast.open({
        message: toastMessage,
        position: 'is-bottom',
        type: 'is-success',
      });
    },
    upsertItem(item, callback) {
      this.isUpdatingItem = true;
      this.$socket.client.emit('upsert_item', item, () => {
        this.isUpdatingItem = false;
        callback();
      });
    },
    getTextColor(colorStr) {
      const white = Color('white');
      const black = Color('black');
      const color = Color(colorStr);

      if (white.contrast(color) > black.contrast(color)) {
        return 'white';
      }

      return 'black';
    },
    saveLocations(locations) {
      this.showLocationListModal = false;
      this.isUpdatingLocations = true;
      this.$socket.client.emit('save_locations', locations, () => {
        this.isUpdatingLocations = false;
      });
    },
    cancelLocations() {
      this.showLocationListModal = false;
    },
  },
  sockets: {
    addItem(itemId) {
      this.listToggleItem(itemId, true);
    },
    removeItem(itemId) {
      this.listToggleItem(itemId, false);
    },
  },
  watch: {
    isAddModalActive() {
      if (this.isAddModalActive === false) {
        this.searchText = '';
      }
    },
  },
};
</script>

<style lang="sass">
@import "~bulmaswatch/darkly/_variables.scss"

.item-row
  transition: all 0.5s
  display: flex
  background: $grey-dark
  border-radius: 0.5em
  align-items: center
  padding-left: 1em
  margin-bottom: 1em

  .tags
    margin-bottom: 0

  &:hover
    cursor: pointer

.button.filterOn, .location.tag
  &.costco
    color: $grey-darker
  &.whole_foods
    color: $grey-darker
  &.k_s
    color: $grey-darker
  &.pet_store
    color: $grey-darker

.item-list-enter-active
  transition: none

.item-list-enter, .item-list-leave-to
  opacity: 0

.under-link
  text-decoration: underline

</style>
