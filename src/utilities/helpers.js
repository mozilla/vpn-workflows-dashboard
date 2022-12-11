import moment from "moment";

export function calculateDuration({ start, end }) {
    const startTime = moment(start, "HH:mm:ss a");
    const endTime = moment(end, "HH:mm:ss a");
  
    const hrs = moment.utc(endTime.diff(startTime)).format("HH");
    const min = moment.utc(endTime.diff(startTime)).format("mm");
    const sec = moment.utc(endTime.diff(startTime)).format("ss");
    return moment.duration(`${hrs}:${min}:${sec}`).humanize();
  }