/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import moment from "moment";

export function calculateDuration({ start, end }) {
    const startTime = moment(start, "HH:mm:ss a");
    const endTime = moment(end, "HH:mm:ss a");
  
    const hrs = moment.utc(endTime.diff(startTime)).format("HH");
    const min = moment.utc(endTime.diff(startTime)).format("mm");
    const sec = moment.utc(endTime.diff(startTime)).format("ss");
    return `${min}:${sec}`
  }