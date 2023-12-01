export const calculateElapsedTime = (time) => {
  const endDate = new Date().getTime();
  const startDate = new Date(time);

  const timeDifference = endDate - startDate;

  const elapsedSecond = Math.trunc(timeDifference / 1000);
  const elapsedMinutes = Math.trunc(elapsedSecond / 60);
  const elapsedHours = Math.trunc(elapsedMinutes / 60);
  const elapsedDays = Math.trunc(elapsedHours / 24);
  const elapsedWeeks = Math.trunc(elapsedDays / 7);
  const elapsedMonth = Math.trunc(elapsedDays / 30);
  const elapsedYears = Math.trunc(elapsedDays / 365);

  if (elapsedHours < 1) {
    return `${elapsedMinutes} min. ago`;
  }

  if (elapsedHours === 1) {
    return `${elapsedHours} hour ago`;
  }

  if (elapsedHours < 24) {
    return `${elapsedHours} hours ago`;
  }

  if (elapsedDays === 1) {
    return `${elapsedDays} day ago`;
  }

  if (elapsedDays < 7) {
    return `${elapsedDays} days ago`;
  }

  if (elapsedWeeks === 1) {
    return `${elapsedWeeks} week ago`;
  }

  if (elapsedWeeks < 7) {
    return `${elapsedWeeks} weeks ago`;
  }

  if (elapsedMonth === 1) {
    return `${elapsedMonth} month ago`;
  }

  if (elapsedMonth < 12) {
    return `${elapsedMonth} monthі ago`;
  }

  if (elapsedMonth === 1) {
    return `${elapsedMonth} month ago`;
  }

  if (elapsedMonth === 1) {
    return `${elapsedMonth} month ago`;
  }

  if (elapsedYears === 1) {
    return `${elapsedYears} year ago`;
  }

  if (elapsedYears > 1) {
    return `${elapsedYears} years ago`;
  }
};
