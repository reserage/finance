<template>
  <div>
    <!-- 控制列 -->
    <div style="display: flex; align-items: center; margin-bottom: 10px">
      <v-btn-group>
        <v-btn @click="goPrev" prepend-icon="mdi-chevron-left">Prev</v-btn>
        <v-btn @click="goToday">Today</v-btn>
        <v-btn @click="goNext" append-icon="mdi-chevron-right">Next</v-btn>
      </v-btn-group>
      <span style="margin-left: 16px; font-weight: bold; font-size: 18px">
        {{ currentDateText }}
      </span>
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
import { onMounted, ref } from 'vue';
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

const calendar = ref(null);
let cal = null;
const currentDateText = ref('');
const dialog = ref(true);

onMounted(() => {
  cal = new Calendar(calendar.value, {
    defaultView: 'month',
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
    console.log('開始時間:', event.start);
    console.log('結束時間:', event.end);
  });

  // 初始化日期顯示
  updateCurrentDate();
});

function updateCurrentDate() {
  if (cal) {
    const date = cal.getDate();
    // 格式化年月
    currentDateText.value = `${date.getFullYear()} - ${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;
    console.log('Current Date:', currentDateText.value);
  }
}

function goPrev() {
  cal.prev();
  updateCurrentDate();
}

function goNext() {
  cal.next();
  updateCurrentDate();
}

function goToday() {
  cal.today();
  updateCurrentDate();
}
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

.toastui-calendar-time {
  flex: 1;
}
</style>
