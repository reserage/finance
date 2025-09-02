import axios from 'axios';
import { onMounted, ref } from 'vue';

let calInstance = null;
let dayCalInstance = null;

export default function useCalendar() {
  //! calendarId 這個屬性是指 事件的分類(私人、工作...)
  const eventForm = ref({
    id: String(Date.now()), // 簡單用 timestamp 當 id
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

    calEvents = response.data.data.events;
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

  function submitEvent() {
    const newEvent = [
      {
        id: String(Date.now()),
        calendarId: eventForm.value.calendarId,
        title: eventForm.value.title,
        start: eventForm.value.start,
        end: eventForm.value.end, // 結束時間等於開始時間
        isAllDay: eventForm.value.isAllDay,
        category: eventForm.value.isAllDay ? 'allday' : 'time',
      },
    ];
    calInstance.createEvents(newEvent);
    dayCalInstance.createEvents(newEvent);
  }

  function setCalendarsInstances(calendar, dayCalendar) {
    calInstance = calendar;
    dayCalInstance = dayCalendar;
  }

  return {
    eventForm,
    calEvents,
    calCategories,
    submitEvent,
    setCalendarsInstances,
  };
}
