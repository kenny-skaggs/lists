<template>
  <div class="column">
    <LoadingMask :isLoading='isLoading' />

    <div class="buttons">
      <b-button :class='{filterOn: filters.includes(location_name), [location_name]: true}'
                @click='toggleFilter(location_name)'
                v-for='location_name in locations' :key='location_name'>
        {{ location_name }}
      </b-button>
    </div>
    <div class="footer">
      <b-autocomplete rounded placeholder="Search for item to add"
            v-model='searchText' dropdown-position='top'
            :data='searchResults' field='text'
            :clear-on-select='true' keep-first @select='toggleItem'>
        <template #empty>
          "{{ searchText }}" not found
        </template>
        <template #footer>
          <a @click='clickedAddNewItem'><span> Add new... </span></a>
        </template>
      </b-autocomplete>
    </div>

    <div class="item-row" v-for='item in displayedItems' :key='item.id' @click='toggleItem(item)'>
      <div class="column is-2">
        {{ item.text }}
      </div>
      <b-taglist>
        <b-tag type="is-primary" :class='location' class="location"
               v-for='location in item.locations' :key='location'>
          {{ location }}
        </b-tag>
      </b-taglist>
      <span class="column"></span>
      <div class="column is-narrow buttons">
        <b-button @click.stop='editItem(item)'>Edit</b-button>
      </div>
    </div>

    <EditItemModal v-model='isAddModalActive' :currentItem='editingItem'
                   @submit='saveItemUpdates' :locations='locations'/>
  </div>
</template>

<script>
import EditItemModal from '@/components/EditListItem.vue';
import LoadingMask from '@/components/LoadingMask.vue';

export default {
  name: 'CreateGroceryList',
  components: { EditItemModal, LoadingMask },
  mounted() {
    this.isLoadingItems = true;
    this.isLoadingLocations = true;
    this.$socket.emit('load_items', (items) => {
      this.isLoadingItems = false;
      this.items = items;
    });
    this.$socket.emit('load_locations', (locations) => {
      this.isLoadingLocations = false;
      this.locations = locations;
      this.filters = [...locations];
    });
  },
  data() {
    return {
      isLoadingItems: false,
      isLoadingLocations: false,
      isUpdatingItem: false,
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
    };
  },
  computed: {
    isLoading() {
      return this.isLoadingItems || this.isLoadingLocations || this.isUpdatingItem;
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
    toggleItem(displayedItem) {
      if (displayedItem === null) {
        // The autocomplete clears the selection occasionally
        return;
      }

      const concreteItem = this.items.find((possibleItem) => possibleItem.id === displayedItem.id);
      const copyOfItem = { ...displayedItem };

      copyOfItem.isNeeded = !copyOfItem.isNeeded;
      const updateCommand = copyOfItem.isNeeded ? 'need_item' : 'do_not_need_item';

      this.isUpdatingItem = true;
      this.$socket.emit(updateCommand, concreteItem.id, () => {
        this.isUpdatingItem = false;
        concreteItem.isNeeded = copyOfItem.isNeeded;
      });
    },
    upsertItem(item, callback) {
      this.isUpdatingItem = true;
      this.$socket.emit('upsert_item', item, () => {
        this.isUpdatingItem = false;
        callback();
      });
    },
  },
};
</script>

<style lang="sass">
@import "~bulmaswatch/darkly/_variables.scss"

.item-row
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
    background-color: $turquoise
    color: $grey-darker
  &.kroger
    background-color: $purple
  &.whole_foods
    background-color: $green
    color: $grey-darker
  &.k_s
    background-color: $yellow
    color: $grey-darker
  &.pet_store
    background-color: $red
    color: $grey-darker
</style>
