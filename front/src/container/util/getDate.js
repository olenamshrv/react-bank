const monthName = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const getDate = (time, dateTimeFormat = false) => {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const currentDate = new Date();
  const currentDateYear = currentDate.getFullYear();

  if (dateTimeFormat) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formattedDay = date.getDate().toString().padStart(2, "0");
    const formattedMonth = monthName[date.getMonth() + 1];

    if (year === currentDateYear) {
      return `${formattedDay} ${formattedMonth}, ${hours}:${minutes}`;
    } else {
      return `${formattedDay} ${formattedMonth} ${year}, ${hours}:${minutes}`;
    }
  }

  const currentDateMonth = currentDate.getMonth();
  const currentDateDay = currentDate.getDate();

  if (
    year === currentDateYear &&
    month === currentDateMonth &&
    day === currentDateDay
  ) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  } else {
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const formattedDay = date.getDate().toString().padStart(2, "0");

    return `${formattedDay}.${formattedMonth}.${year}`;
  }
};
