import axios from 'axios';
import useCalendarConfig from './useCalendarConfig';
// import { ref } from 'vue';
// let calInstance;
// let dayCalInstance;

export default function useCalendarButtonFunction(eventForm, dialog) {
  async function submitEvent() {
    const { calInstance, dayCalInstance } =
      useCalendarConfig().getCalendarInstances();

    // const instances = useCalendarConfig().getCalendarInstances();
    // calInstance = instances.calInstance;
    // dayCalInstance = instances.dayCalInstance;

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

    await axios.post(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/calendar`,
      {
        title: newEvent[0].title,
        calendarId: newEvent[0].calendarId,
        start: newEvent[0].start,
        end: newEvent[0].end,
        isAllday: newEvent[0].isAllDay,
        category: newEvent[0].category,
      },
      { withCredentials: true }
    );
    dialog.value = false;
  }

  async function deleteEvent() {
    const { calInstance, dayCalInstance } =
      useCalendarConfig().getCalendarInstances();

    await axios.delete(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/calendar/${eventForm.value.id}`,
      {
        withCredentials: true,
      }
    );

    calInstance.deleteEvent(eventForm.value.id, eventForm.value.calendarId);
    dayCalInstance.deleteEvent(eventForm.value.id, eventForm.value.calendarId);

    dialog.value = false;
  }

  async function updateEvent(id, data) {
    const { calInstance, dayCalInstance } =
      useCalendarConfig().getCalendarInstances();

    await axios.patch(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/calendar/${id}`,
      { ...data },
      { withCredentials: true }
    );

    calInstance.updateEvent(data.id, data.calendarId, data);

    dayCalInstance.updateEvent(data.id, data.calendarId, data);

    dialog.value = false;
  }
  return { submitEvent, deleteEvent, updateEvent };
}
