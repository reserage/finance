import axios from 'axios';
import useCalendarConfig from './useCalendarConfig';
import api from '@/utils/api.js';

export default function useCalendarButtonFunction(eventForm, dialog) {
  //* 因為line通知原故不能這樣做-------------------------------
  //! 行事曆事件的前端處理邏輯：
  //! 前端在建立新事件時，事件的 id 會先使用時間戳記產生字串。
  //! 為避免與後端資料庫自動生成的 id 發生衝突，
  //! 前端建立事件時僅更新行事曆元件 (不立即呼叫 API)。
  //! 當 calendar 頁面卸載時，才會一次性將所有事件透過 API 寫入資料庫。
  //* ------------------------------------------------------

  //! 每次呼叫 create Event API 時都刷新一次畫面

  async function submitEvent() {
    const calendarConfig = useCalendarConfig();
    const { calInstance, dayCalInstance } =
      calendarConfig.getCalendarInstances();

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
        isAllday: eventForm.value.isAllday,
        category: eventForm.value.isAllday ? 'allday' : 'time',
      },
    ];

    console.log('newEvent: ', newEvent);

    if (
      newEvent[0].title === '' ||
      newEvent[0].start === '' ||
      newEvent[0].end === '' ||
      newEvent[0].calendarId === null
    ) {
      window.alert('請填寫所有必填欄位');
      return;
    }

    calInstance.createEvents(newEvent);
    dayCalInstance.createEvents(newEvent);

    try {
      await api.post(
        `/calendar`,
        {
          title: newEvent[0].title,
          calendarId: newEvent[0].calendarId,
          start: new Date(newEvent[0].start).toISOString(),
          end: new Date(newEvent[0].end).toISOString(),
          isAllday: newEvent[0].isAllday,
          category: newEvent[0].category,
        },
        { withCredentials: true }
      );
      dialog.value = false;
      await calendarConfig.refreshCalendarEvents();
    } catch (error) {
      // 這裡錯誤已經被攔截器處理過了，所以通常不用再彈窗
      console.warn('submitEvent 捕捉到錯誤:', error.message);
    }
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

  async function compeleteEvent(id, data) {
    const { calInstance, dayCalInstance } =
      useCalendarConfig().getCalendarInstances();

    await axios.patch(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/calendar/${id}`,
      { isDone: true },
      { withCredentials: true }
    );

    console.log(calInstance, dayCalInstance);
    console.log('data', data);

    calInstance.updateEvent(data.id, data.calendarId, {
      backgroundColor: '#E0E0E0',
    });

    dayCalInstance.updateEvent(data.id, data.calendarId, {
      backgroundColor: '#E0E0E0',
    });

    dialog.value = false;
  }

  return { submitEvent, deleteEvent, updateEvent, compeleteEvent };
}
