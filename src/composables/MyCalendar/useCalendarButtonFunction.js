import axios from 'axios';
import useCalendar from './useCalendarConfig';
import api from '@/utils/api.js';

export default function useCalendarButtonFunction(eventForm, dialog, wrap) {
  //* 因為line通知原故不能這樣做-------------------------------
  //! 行事曆事件的前端處理邏輯：
  //! 前端在建立新事件時，事件的 id 會先使用時間戳記產生字串。
  //! 為避免與後端資料庫自動生成的 id 發生衝突，
  //! 前端建立事件時僅更新行事曆元件 (不立即呼叫 API)。
  //! 當 calendar 頁面卸載時，才會一次性將所有事件透過 API 寫入資料庫。
  //* ------------------------------------------------------

  //! 每次呼叫 create Event API 時都刷新一次畫面

  async function submitEvent() {
  await wrap(async () => {

    if (
      !eventForm.value.title ||
      !eventForm.value.start ||
      !eventForm.value.end ||
      eventForm.value.calendarId === null
    ) {
      window.alert('請填寫所有必填欄位');
      return;
    }

    try {
      // 先送到後端，得到真正的 _id
      const res = await api.post(
        `/calendar`,
        {
          title: eventForm.value.title,
          calendarId: eventForm.value.calendarId,
          start: new Date(eventForm.value.start).toISOString(),
          end: new Date(eventForm.value.end).toISOString(),
          isAllday: eventForm.value.isAllday,
          category: eventForm.value.isAllday ? 'allday' : 'time',
        },
        { withCredentials: true }
      );

      const created = res.data.data.event;

      // 用後端回傳的 _id 新增事件（不再使用 timestamp）
      const trueEvent = {
        id: created._id,            // ← 真正的ID！
        calendarId: created.calendarId,
        title: created.title,
        start: created.start,
        end: created.end,
        isAllday: created.isAllday,
        category: created.category,
        backgroundColor: created.isDone ? '#E0E0E0' : undefined,
      };

      const { calInstance, dayCalInstance } =
        useCalendar().getCalendarInstances();

      // 直接放到前端日曆（用真ID）
      calInstance.createEvents([trueEvent]);
      dayCalInstance.createEvents([trueEvent]);

      dialog.value = false;

    } catch (error) {
      console.warn('submitEvent 捕捉到錯誤:', error.message);
    }
  });
}

  async function deleteEvent() {
    wrap(async () => {
      const { calInstance, dayCalInstance } =
        useCalendar().getCalendarInstances();

      await axios.delete(
        `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/calendar/${eventForm.value.id}`,
        {
          withCredentials: true,
        }
      );

      calInstance.deleteEvent(eventForm.value.id, eventForm.value.calendarId);
      dayCalInstance.deleteEvent(
        eventForm.value.id,
        eventForm.value.calendarId
      );

      dialog.value = false;
    });
  }

  async function updateEvent(id, data) {
    wrap(async () => {
      const { calInstance, dayCalInstance } =
        useCalendar().getCalendarInstances();

      await axios.patch(
        `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/calendar/${id}`,
        { ...data },
        { withCredentials: true }
      );

      calInstance.updateEvent(data.id, data.calendarId, data);

      dayCalInstance.updateEvent(data.id, data.calendarId, data);

      dialog.value = false;
    });
  }

  async function compeleteEvent(id, data) {
    wrap(async () => {
      const { calInstance, dayCalInstance } =
        useCalendar().getCalendarInstances();

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
    });
  }

  return { submitEvent, deleteEvent, updateEvent, compeleteEvent };
}
