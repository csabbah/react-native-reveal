class HelpersServices {
  // retrieve data saved in token
  returnHeights() {
    const heights = [];

    for (let i = 60; i <= 225; i++) {
      const cm = `${i}cm`;
      const ft = `${Math.floor(i / 30.48)}'${Math.round((i % 30.48) / 2.54)}"`;
      const height = `${cm} - ${ft}`;
      heights.push(height);
    }
    return heights;
  }

  returnDates() {
    const startYear = 1950; // You can replace this with any year you like
    const endYear = new Date().getFullYear(); // Get the current year

    // Create an array of years using a loop
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }

    const year = 2023; // Replace this with the year you want
    const month = 3; // Replace this with the month you want (1 = January, 2 = February, etc.)
    const numDays = daysInMonth(month, year);

    // Create an array of days of the month using a loop
    const days = [];
    for (let day = 1; day <= numDays; day++) {
      days.push(day);
    }
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return { monthNames, days, years };
  }
}
export default new HelpersServices();
