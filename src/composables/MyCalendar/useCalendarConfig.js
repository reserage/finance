import axios from 'axios';
import { onMounted, ref } from 'vue';

let calInstance = null;
let dayCalInstance = null;


//! event的 id 屬性是來自 DB 的 _id
export default function useCalendar() {
  //! calendarId 這個屬性是指 事件的分類(私人、工作...)
  const eventForm = ref({
    id: null, // 簡單用 timestamp 當 id
    calendarId: null,
    title: '',
    start: '',
    end: '',
    isAllDay: false,
    category: 'time',
    location: '',
    body: '',
  });

  let calEvents = [
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
      id: 'even1',
      calendarId: '2',
      title: '測試',
      start: '2025-08-30',
      end: '2025-08-30',
      isAllDay: true,
      category: 'allday',
    },
    {
      id: 'event2',
      calendarId: '2',
      title: 'Conference',
      start: '2025-08-26T11:00:00',
      end: '2025-08-27T12:00:00',
    },
  ];

  onMounted(async () => {
    const response = await axios.get(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/calendar`,
      { withCredentials: true }
    );

    const events = response.data.data.events.map((event) => {
      return { id: event._id, ...event };
    });

    calEvents = events;
    calInstance.clear();
    calInstance.createEvents(calEvents);
    dayCalInstance.clear();
    dayCalInstance.createEvents(calEvents);
    // calInstance.render();
    // calInstance.deleteEvent('1', 'cal1');
  });

  //todo 是否要改成從後端撈?
  const calCategories = [
    {
      id: '1',
      name: '私人',
      backgroundColor: '#9e5fff',
    },
    {
      id: '2',
      name: '工作',
      backgroundColor: '#00a9ff',
    },
  ];

  // async function submitEvent() {
  //   const newEvent = [
  //     {
  //       id: String(Date.now()),
  //       calendarId: eventForm.value.calendarId,
  //       title: eventForm.value.title,
  //       start: eventForm.value.start,
  //       end: eventForm.value.end, // 結束時間等於開始時間
  //       isAllDay: eventForm.value.isAllDay,
  //       category: eventForm.value.isAllDay ? 'allday' : 'time',
  //     },
  //   ];
  //   calInstance.createEvents(newEvent);
  //   dayCalInstance.createEvents(newEvent);

  //   await axios.post(
  //     `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/calendar`,
  //     {
  //       title: newEvent[0].title,
  //       calendarId: newEvent[0].calendarId,
  //       start: newEvent[0].start,
  //       end: newEvent[0].end,
  //       isAllday: newEvent[0].isAllDay,
  //       category: newEvent[0].category,
  //     },
  //     { withCredentials: true }
  //   );
  //   dialog.value = false;
  // }

  function formatDateForInput(date, isAllDay) {
    const jsDate = date.d; // 取出內部的原生 Date
    if (!jsDate) return '';

    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, '0');
    const day = String(jsDate.getDate()).padStart(2, '0');

    if (isAllDay) {
      return `${year}-${month}-${day}`; // date input 格式
    }

    const hours = String(jsDate.getHours()).padStart(2, '0');
    const minutes = String(jsDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`; // datetime-local 格式
  }

  function resetEventForm() {
    eventForm.value = {
      id: String(Date.now()), // 簡單用 timestamp 當 id
      calendarId: null,
      title: '',
      start: '',
      end: '',
      isAllDay: false,
      category: 'time',
      location: '',
      body: '',
    };
  }

  function setCalendarsInstances(calendar, dayCalendar) {
    calInstance = calendar;
    dayCalInstance = dayCalendar;
  }

  function getCalendarInstances() {
    return { calInstance, dayCalInstance };
  }

  return {
    eventForm,
    calEvents,
    calCategories,
    formatDateForInput,
    setCalendarsInstances,
    resetEventForm,
    getCalendarInstances,
  };
}
