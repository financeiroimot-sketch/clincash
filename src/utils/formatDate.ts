export function formatDate() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const dayFormatted = day < 10 ? `0${day}` : day;
  const month = currentDate.getMonth() + 1;
  const monthFormatted = month < 10 ? `0${month}` : month;
  const year = currentDate.getFullYear();

  const hour = currentDate.getHours();
  const hourFormatted = hour < 10 ? `0${hour}` : hour;

  const minute = currentDate.getMinutes();
  const minuteFormatted = minute < 10 ? `0${minute}` : minute;

  return `${dayFormatted}/${monthFormatted}/${year} ${hourFormatted}:${minuteFormatted}`;
}
