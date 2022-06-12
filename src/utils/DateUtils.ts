import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export class DateUtils {
  static getFirstAndLastDateOfCurrentMonth() {
    const firstDateOfCurrentMonth = dayjs().startOf("month").format();
    const lastDateOfCurrentMonth = dayjs().endOf("month").format();
    return { firstDateOfCurrentMonth, lastDateOfCurrentMonth };
  }

  static getFirstAndLastDateOfPreviousMonth() {
    const firstDateOfPreviousMonth = dayjs()
      .subtract(1, "month")
      .startOf("month")
      .format();

    const lastDateOfPreviousMonth = dayjs()
      .subtract(1, "month")
      .endOf("month")
      .format();

    return { firstDateOfPreviousMonth, lastDateOfPreviousMonth };
  }

  static getFirstAndLastDateOfCurrentWeek() {
    const firstDateOfCurrentWeek = dayjs().startOf("isoWeek").format();

    const lastDateOfCurrentWeek = dayjs().endOf("isoWeek").format();

    return { firstDateOfCurrentWeek, lastDateOfCurrentWeek };
  }

  static getFirstAndLastDateOfPreviousWeek() {
    const firstDateOfPreviousWeek = dayjs()
      .startOf("isoWeek")
      .subtract(7, "day")
      .format();

    const lastDateOfPreviousWeek = dayjs()
      .endOf("isoWeek")
      .subtract(7, "day")
      .format();

    return { firstDateOfPreviousWeek, lastDateOfPreviousWeek };
  }
}
