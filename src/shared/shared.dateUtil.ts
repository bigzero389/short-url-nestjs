export class ShortUrlDateUtil {
  public static isValidDateTime(dateTime: string): boolean {
    // const dateString = dateTime.substring(0, 8);
    // console.log(dateString);
    // // First check for the pattern
    // const regex_date = /^\d{4}\d{1,2}\d{1,2}$/;

    // if (!regex_date.test(dateString)) {
    //   console.log(!regex_date.test(dateString));
    //   return false;
    // }

    if (dateTime.length !== 14) {
      console.log('length is over the range: %s', dateTime);
      return false;
    }
    // Parse the date parts to integers
    const year = parseInt(dateTime.substring(0, 4));
    const month = parseInt(dateTime.substring(4, 6));
    const day = parseInt(dateTime.substring(6, 8));
    const hour = parseInt(dateTime.substring(8, 10));
    const minute = parseInt(dateTime.substring(10, 12));
    const second = parseInt(dateTime.substring(12, 14));
    console.log(year);
    console.log(month);
    console.log(day);
    console.log(hour);
    console.log(minute);
    console.log(second);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
      console.log('year or month is over the range - %s, %s', year, month);
      return false;
    }

    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
      monthLength[1] = 29;
    }

    // Check the range of the day
    if (day <= 0 || day > monthLength[month - 1]) {
      console.log('day is over the range: %s', day);
      return false;
    }

    // check time range
    if (parseInt(dateTime.substring(8, 14)) > 240000) {
      console.log('time is over the range: %s', dateTime.substring(8, 14));
      return false;
    }

    if (hour < 0 || hour >= 24) {
      console.log('hour is over the range: %s', hour);
      return false;
    }

    if (minute < 0 || minute >= 60) {
      console.log('minute is over the range: %s', minute);
      return false;
    }

    if (second < 0 || second >= 60) {
      console.log('second is over the range: %s', second);
      return false;
    }

    return true;
  }
}
