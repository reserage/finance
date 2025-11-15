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
      <div style="height: 100%; display: flex; flex-direction: column">
        <v-sheet style="flex: 0 0 auto"
          ><v-btn-group
            ><v-btn
              ><v-icon size="32" @click.stop="closeDayCalendar"
                >mdi-chevron-left</v-icon
              ></v-btn
            >
            <v-btn
              @click="dayCurrentDateText = goPrev(dayCal)"
              prepend-icon="mdi-chevron-left"
              >Prev</v-btn
            >
            <v-btn @click="dayCurrentDateText = goToday(dayCal)">Today</v-btn>
            <v-btn
              @click="dayCurrentDateText = goNext(dayCal)"
              append-icon="mdi-chevron-right"
              >Next</v-btn
            >
          </v-btn-group>
          <span
            style="
              font-weight: bold;
              display: flex;
              justify-content: space-evenly;
            "
            ><span style="display: flex; align-items: center">{{
              dayCurrentDateText
            }}</span
            ><span
              ><v-btn
                variant="text"
                @click="dialog = true"
                style="font-weight: bold"
                >新增事件</v-btn
              ></span
            ></span
          ></v-sheet
        >
        <v-sheet style="flex: 1 1 auto; overflow: hidden"
          ><div ref="dayCalendar" style="height: 100%"></div
        ></v-sheet>
      </div>
    </v-navigation-drawer>

    <!-- 控制列 -->
    <div
      v-if="sm || md || lg || xl"
      style="display: flex; align-items: center; margin-bottom: 10px"
    >
      <!-- 這是電腦版 -->
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
          { title: '日', value: 'day' },
        ]"
        item-title="title"
        item-value="value"
        variant="underlined"
        hide-details=""
        style="margin-top: 0.1rem"
      ></v-select>
    </div>
    <v-container v-else fluid class="pa-0">
      <!-- 這是手機板 -->
      <v-row class="mb-2">
        <!-- 日期和選擇器：手機上佔滿整行，桌面上靠右 -->
        <v-col
          cols="12"
          md=""
          class="d-flex align-center justify-space-between justify-md-end pb-0"
        >
          <span class="text-h6 font-weight-bold">
            {{ currentDateText }}
          </span>
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
            hide-details
            style="max-width: 120px; margin-top: 0.1rem"
            class="ml-4"
          ></v-select>
        </v-col>

        <v-col cols="12" md="auto" class="d-flex align-center pt-0">
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
        </v-col>
      </v-row>
    </v-container>

    <!-- 日曆 -->
    <div ref="calendar" style="height: 800px"></div>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">{{ vDialogTitleText }}</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <!-- 標題 -->
            <v-text-field
              v-model="eventForm.title"
              label="標題"
              :rules="[(v) => !!v || '請輸入標題']"
              required
            ></v-text-field>

            <!-- 所屬行事曆 -->
            <v-select
              v-model="eventForm.calendarId"
              :items="calCategories"
              item-title="name"
              item-value="id"
              label="行事曆分類"
              required
            ></v-select>

            <!-- 整天事件切換 -->
            <v-switch v-model="eventForm.isAllday" label="整天事件"></v-switch>

            <!-- 開始時間 -->
            <v-text-field
              v-model="eventForm.start"
              label="開始時間"
              type="datetime-local"
              v-if="!eventForm.isAllday"
              required
            ></v-text-field>
            <v-text-field
              v-model="eventForm.start"
              label="開始日期"
              type="date"
              v-else
              required
            ></v-text-field>

            <!-- 結束時間 -->
            <v-text-field
              v-model="eventForm.end"
              label="結束時間"
              type="datetime-local"
              v-if="!eventForm.isAllday"
              required
            ></v-text-field>
            <v-text-field
              v-model="eventForm.end"
              label="結束日期"
              type="date"
              v-else
              required
            ></v-text-field>

            <!-- 地點 -->
            <v-text-field
              v-model="eventForm.location"
              label="地點"
            ></v-text-field>

            <!-- 描述 -->
            <v-textarea
              v-model="eventForm.body"
              label="描述"
              rows="3"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">取消</v-btn>
          <v-btn v-if="isAddingEvent" color="primary" @click="submitEvent"
            >新增</v-btn
          >
          <v-btn
            v-if="!isAddingEvent"
            color="primary"
            @click="updateEvent(eventForm.id, eventForm)"
            >修改</v-btn
          >
          <v-btn
            v-if="!isAddingEvent"
            color="success"
            @click="compeleteEvent(eventForm.id, eventForm)"
            >完成</v-btn
          >
          <v-btn v-if="!isAddingEvent" color="red" @click="deleteEvent"
            >刪除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Calendar from '@toast-ui/calendar';
import { useDisplay } from 'vuetify';
import {
  updateCurrentDate,
  goPrev,
  goNext,
  goToday,
} from '@/utils/toastCalendarBaseAPI';
import useCalendarConfig from '@/composables/MyCalendar/useCalendarConfig';
import useCalendarButtonFunction from '@/composables/MyCalendar/useCalendarButtonFunction';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

//* 排版用處
const { sm, md, lg, xl } = useDisplay();

const calendar = ref(null);
const dayCalendar = ref(null);
let cal = null;
let dayCal = null;

const currentDateText = ref('');
const dayCurrentDateText = ref('');
const calendarView = ref('月');
const dialog = ref(false);
const vDialogTitleText = ref('新增事件');
let isAddingEvent = true;
const navModel = ref(false);

const {
  eventForm,
  calEvents,
  calCategories,
  formatDateForInput,
  setCalendarsInstances,
  resetEventForm,
} = useCalendarConfig();
const { submitEvent, deleteEvent, updateEvent, compeleteEvent } =
  useCalendarButtonFunction(eventForm, dialog);

//todo 把button的動作做出來並放到獨立的檔案裡

//info main calendar
onMounted(async () => {
  cal = new Calendar(calendar.value, {
    defaultView: 'month',
    useFormPopup: false,
    useDetailPopup: false,
    usageStatistics: false,
    month: {
      scheduleView: true,
      showTime: false,
    },
    week: {},
    template: {
      time(schedule) {
        return schedule.title;
      },
    },
    calendars: calCategories,
  });

  // 加一些事件
  cal.createEvents(calEvents);

  cal.on('selectDateTime', (event) => {
    navModel.value = true;
    dayCal.setDate(event.start);

    dayCurrentDateText.value = updateCurrentDate(dayCal);
  });
  // //! 在填寫表單時，如果設定為全天，沒設定時間，會導致錯誤

  cal.on('beforeUpdateEvent', async (updateData) => {
    const { event, changes } = updateData;

    console.log('原本事件:', event);
    console.log('更動內容:', changes);

    let updatedEvent = { ...event };
    updatedEvent.start = formatDateForInput(changes.start, event.isAllday);
    updatedEvent.end = formatDateForInput(changes.end, event.isAllday);

    updateEvent(updatedEvent.id, updatedEvent);
  });

  // 初始化日期顯示
  currentDateText.value = updateCurrentDate(cal);
});

//info day calendar
onMounted(() => {
  dayCal = new Calendar(dayCalendar.value, {
    defaultView: 'day',
    useFormPopup: false,
    useDetailPopup: false,
    week: {},
    calendars: calCategories,
  });

  // 加一些事件
  dayCal.createEvents(calEvents);

  dayCal.on('selectDateTime', (event) => {
    console.log('使用者點了日期格子:', event);
  });

  dayCal.on('clickEvent', (info) => {
    console.log('使用者點了事件:', info);
    const event = info.event;

    Object.assign(eventForm.value, {
      id: event.id,
      title: event.title,
      calendarId: event.calendarId,
      start: formatDateForInput(event.start, event.isAllday),
      end: formatDateForInput(event.end, event.isAllday),
      isAllday: event.isAllday,
      location: event.location,
      body: event.body,
    });

    isAddingEvent = false;
    dialog.value = true;
  });

  dayCal.on('beforeUpdateEvent', (updateData) => {
    console.log(updateData);

    const { event, changes } = updateData;

    console.log('原本事件:', event);
    console.log('更動內容:', changes);

    // 例如把更新傳回後端

    let updatedEvent = { ...event };
    updatedEvent.start = formatDateForInput(
      changes.start == undefined ? event.start : changes.start,
      event.isAllday
    );
    updatedEvent.end = formatDateForInput(
      changes.end == undefined ? event.end : changes.end,
      event.isAllday
    );

    updateEvent(updatedEvent.id, updatedEvent);
  });

  dayCurrentDateText.value = updateCurrentDate(dayCal);
  setCalendarsInstances(cal, dayCal);
});

watch(calendarView, (newValue) => {
  console.log('切換到檢視模式:', newValue);
  cal.changeView(newValue);
});

watch(navModel, (newValue) => {
  if (!newValue) {
    cal.clearGridSelections();
  }
});

watch(dialog, (newValue) => {
  if (newValue === false) {
    isAddingEvent = true;
    vDialogTitleText.value = '新增事件';
    resetEventForm();
  }
});

function closeDayCalendar() {
  navModel.value = false;
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

.toastui-calendar-week-view {
  display: flex;
  flex-direction: column;
}

.toastui-calendar-time {
  flex: 1;
}

.toastui-calendar-weekday-events .toastui-calendar-weekday-event-block {
  pointer-events: none;
}
</style>
