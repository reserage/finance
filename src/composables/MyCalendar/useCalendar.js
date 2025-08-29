export default function useCalendar(calendar, currentDateText) {
  function updateCurrentDate() {
    if (calendar) {
      const date = calendar.getDate();
      // 格式化年月
      currentDateText.value = `${date.getFullYear()} - ${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
    }
  }

  function goPrev() {
    calendar.prev();
    updateCurrentDate();
  }

  function goNext() {
    calendar.next();
    updateCurrentDate();
  }

  function goToday() {
    calendar.today();
    updateCurrentDate();
  }

  return {
    updateCurrentDate,
    goPrev,
    goNext,
    goToday,
  };
}
