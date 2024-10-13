const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getDay = (timeStamp) => {
  const date = new Date(timeStamp).getDate();
  const monthIndex = new Date(timeStamp).getMonth();
  return `${date} ${month[monthIndex]}`;
};

export const getFullDay = (timeStamp) => {
  const date = new Date(timeStamp).getDate();
  const monthIndex = new Date(timeStamp).getMonth();
  const year = new Date(timeStamp).getFullYear();
  return `${date} ${month[monthIndex]} ${year}`;
};
