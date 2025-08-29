<template>
  <div>
    <v-navigation-drawer
      color="surface-variant"
      :width="400"
      v-model="navModel"
      location="right"
      temporary
      style=""
    >
      <div style="height: 100%">
        <v-sheet style="height: 10%"
          ><v-btn-group
            ><v-btn
              ><v-icon size="32" @click.stop="navModel = false"
                >mdi-chevron-left</v-icon
              ></v-btn
            ></v-btn-group
          >
          {{ currentDateText }}</v-sheet
        >
        <v-sheet style="height: 90%"
          ><div ref="dayCalendar" style="height: 100%"></div
        ></v-sheet>
      </div>
    </v-navigation-drawer>

    <!-- 控制列 -->
    <div style="display: flex; align-items: center; margin-bottom: 10px">
      <v-btn-group>
        <v-btn
          @click="currentDateText = goPrev(cal)"
          prepend-icon="mdi-chevron-left"
          >Prev</v-btn
        >
        <v-btn @click="currentDateText = goToday(cal)">Today</v-btn>
        <v-btn
          @click="currentDateText = goNext(cal)"
          append-icon="mdi-chevron-right"
          >Next</v-btn
        >
      </v-btn-group>
      <span style="margin-left: 16px; font-weight: bold; font-size: 18px">
        {{ currentDateText }}
      </span>
      <v-spacer></v-spacer>

      <v-select
        v-model="calendarView"
        label="模式"
        :items="[
          { title: '月', value: 'month' },
          { title: '週', value: 'week' },
          { title: '日', value: 'day' },
        ]"
        item-title="title"
        item-value="value"
        variant="underlined"
        hide-details=""
        style="margin-top: 0.1rem"
      ></v-select>
    </div>

    <!-- 日曆 -->
    <div ref="calendar" style="height: 800px"></div>

    <v-dialog v-model="dialog" max-width="600px"
      ><v-card prepend-icon="mdi-account" title="User Profile">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4" sm="6">
              <v-text-field label="First name*" required></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                hint="example of helper text only on focus"
                label="Middle name"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                hint="example of persistent helper text"
                label="Last name*"
                persistent-hint
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field label="Email*" required></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Password*"
                type="password"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Confirm Password*"
                type="password"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                :items="['0-17', '18-29', '30-54', '54+']"
                label="Age*"
                required
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="[
                  'Skiing',
                  'Ice hockey',
                  'Soccer',
                  'Basketball',
                  'Hockey',
                  'Reading',
                  'Writing',
                  'Coding',
                  'Basejump',
                ]"
                label="Interests"
                auto-select-first
                multiple
              ></v-autocomplete>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis"
            >*indicates required field</small
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="dialog = false"
          ></v-btn>
        </v-card-actions> </v-card
    ></v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Calendar from '@toast-ui/calendar';
import {
  updateCurrentDate,
  goPrev,
  goNext,
  goToday,
} from '@/utils/baseCalendarFunction';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

const calendar = ref(null);
const dayCalendar = ref(null);
let cal = null;
let dayCal = null;

const currentDateText = ref('');
const calendarView = ref('月');
const dialog = ref(false);
const navModel = ref(false);

onMounted(() => {
  cal = new Calendar(calendar.value, {
    defaultView: 'month',
    useFormPopup: false,
    useDetailPopup: true,
    week: {},
    calendars: [
      {
        id: '1',
        name: 'Personal',
        backgroundColor: '#9e5fff',
      },
      {
        id: '2',
        name: 'Work',
        backgroundColor: '#00a9ff',
      },
    ],
  });

  // 加一些事件
  cal.createEvents([
    {
      id: 'event1',
      calendarId: '1',
      title: 'Meeting',
      start: '2025-08-26T09:00:00',
      end: '2025-08-26T10:00:00',
    },
    {
      id: 'event1',
      calendarId: '1',
      title: 'Meeting',
      start: '2025-08-26T09:00:00',
      end: '2025-08-26T10:00:00',
    },
    {
      id: 'event1',
      calendarId: '1',
      title: 'Meeting',
      start: '2025-08-26T09:00:00',
      end: '2025-08-26T10:00:00',
    },
    {
      id: 'event1',
      calendarId: '1',
      title: 'Meeting',
      start: '2025-08-26T09:00:00',
      end: '2025-08-26T10:00:00',
    },
    {
      id: 'event2',
      calendarId: '2',
      title: 'Conference',
      start: '2025-08-26T11:00:00',
      end: '2025-08-27T12:00:00',
    },
  ]);

  cal.on('selectDateTime', (event) => {
    console.log('使用者點了日期格子:', event);
    navModel.value = true;
  });

  // 初始化日期顯示
  currentDateText.value = updateCurrentDate(cal);
});

onMounted(() => {
  dayCal = new Calendar(dayCalendar.value, {
    defaultView: 'day',
    useFormPopup: true,
    useDetailPopup: true,
    week: {},
    calendars: [
      {
        id: '1',
        name: 'Personal',
        backgroundColor: '#9e5fff',
      },
      {
        id: '2',
        name: 'Work',
        backgroundColor: '#00a9ff',
      },
    ],
  });

  // 加一些事件
  dayCal.createEvents([
    {
      id: 'event1',
      calendarId: '1',
      title: 'Meeting',
      start: '2025-08-26T09:00:00',
      end: '2025-08-26T10:00:00',
    },
    {
      id: 'event1',
      calendarId: '1',
      title: 'Meeting',
      start: '2025-08-26T09:00:00',
      end: '2025-08-26T10:00:00',
    },
    {
      id: 'event1',
      calendarId: '1',
      title: 'Meeting',
      start: '2025-08-26T09:00:00',
      end: '2025-08-26T10:00:00',
    },
    {
      id: 'event1',
      calendarId: '1',
      title: 'Meeting',
      start: '2025-08-26T09:00:00',
      end: '2025-08-26T10:00:00',
    },
    {
      id: 'event2',
      calendarId: '2',
      title: 'Conference',
      start: '2025-08-26T11:00:00',
      end: '2025-08-27T12:00:00',
    },
  ]);
});

watch(calendarView, (newValue) => {
  console.log('切換到模式:', newValue);
  cal.changeView(newValue);
});
</script>
<style>
.toastui-calendar-daygrid-cell {
  cursor: pointer;
}

.toastui-calendar-milestone {
  display: none;
}
.toastui-calendar-task {
  display: none;
}

.toastui-calendar-day-view {
  display: flex;
  flex-direction: column;
}

.toastui-calendar-week-view {
  display: flex;
  flex-direction: column;
}

.toastui-calendar-time {
  flex: 1;
}
</style>
