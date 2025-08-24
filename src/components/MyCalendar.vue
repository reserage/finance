<template>
  <div>
    <v-sheet class="d-flex" height="54" tile>
      <v-select
        v-model="type"
        :items="types"
        class="ma-2"
        density="compact"
        label="View Mode"
        variant="outlined"
        hide-details
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        class="ma-2"
        density="compact"
        label="Weekdays"
        variant="outlined"
        hide-details
      ></v-select>
    </v-sheet>

    <v-sheet>
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
      ></v-calendar>
    </v-sheet>
  </div>
</template>
<script setup>
import { VCalendar } from 'vuetify/labs/VCalendar';
import { ref } from 'vue';

// View mode
const type = ref('month');
const types = ['month', 'week', 'day'];

// Weekdays selection
const weekday = ref([0, 1, 2, 3, 4, 5, 6]);
const weekdays = [
  { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
  { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
];

// Calendar value and events
const value = ref([new Date()]);
const events = ref([]);
</script>
