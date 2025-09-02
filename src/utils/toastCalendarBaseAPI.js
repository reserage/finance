function updateCurrentDate(calendar) {
  if (calendar) {
    const date = calendar.getDate();
    return `${date.getFullYear()} - ${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  }
}

function goPrev(calendar) {
  calendar.prev();
  return updateCurrentDate(calendar);
}

function goNext(calendar) {
  calendar.next();
  return updateCurrentDate(calendar);
}

function goToday(calendar) {
  calendar.today();
  return updateCurrentDate(calendar);
}

export { updateCurrentDate, goPrev, goNext, goToday };