<template>
  <div class="column">
    <div class="buttons">
      <b-button class="costco" :class='{filterOn: this.filters.includes("costco")}'
          @click='toggleFilter("costco")'>
        Costco
      </b-button>
      <b-button class="kroger" :class='{filterOn: this.filters.includes("kroger")}'
          @click='toggleFilter("kroger")'>
        Kroger
      </b-button>
      <b-button class="whole_foods" :class='{filterOn: this.filters.includes("whole_foods")}'
          @click='toggleFilter("whole_foods")'>
        Whole Foods
      </b-button>
    </div>
    <div class="footer">
      <b-autocomplete rounded placeholder="Search for item to add"
            v-model='searchText' dropdown-position='top'
            :data='searchResults' field='text'
            :clear-on-select='true' keep-first @select='itemSelected'>
        <template #empty>
          "{{ searchText }}" not found
        </template>
        <template #footer>
          <a @click='clickedAddNewItem'><span> Add new... </span></a>
        </template>
      </b-autocomplete>
    </div>

    <div class="item-row" v-for='item in displayedItems' :key='item.id'>
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
        <b-button @click='editItem(item)'>Edit</b-button>
      </div>
    </div>

    <EditItemModal v-model='isAddModalActive' :currentItem='this.editingItem'
                   @submit='saveItemUpdates'/>
  </div>
</template>

<script>
import EditItemModal from '@/components/EditListItem.vue';

export default {
  name: 'CreateGroceryList',
  components: { EditItemModal },
  data() {
    return {
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
      filters: [
        'costco',
        'kroger',
        'whole_foods',
      ],
      items: [
        {
          id: 1, text: 'one', isNeeded: false, locations: [], notes: '',
        },
        {
          id: 2, text: 'two', isNeeded: true, locations: [], notes: '',
        },
        {
          id: 3, text: 'three', isNeeded: false, locations: [], notes: '',
        },
        {
          id: 4, text: 'four', isNeeded: false, locations: [], notes: '',
        },
        {
          id: 5, text: 'five', isNeeded: false, locations: [], notes: '',
        },
      ],
    };
  },
  computed: {
    searchResults() {
      const lowerSearch = this.searchText.toLowerCase();
      return this.items.filter((item) => item.text.toLowerCase().includes(lowerSearch));
    },
    displayedItems() {
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
    itemSelected(item) {
      item.isNeeded = true;
    },
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
        this.items.push(updatedItem);
      } else {
        Object.assign(itemToUpdate, updatedItem);
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

.location.tag
  &.costco
    background: $turquoise
    color: $grey-darker
  &.kroger
    background: $purple
  &.whole_foods
    background: $green
    color: $grey-darker

.button.filterOn
  &.costco
    background-color: $turquoise
    color: $grey-darker
  &.kroger
    background-color: $purple
  &.whole_foods
    background-color: $green
    color: $grey-darker
</style>
