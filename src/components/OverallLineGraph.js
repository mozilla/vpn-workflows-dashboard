/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-moment";
import moment from "moment";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export function OverallLineGraph({ chartData }) {
  const options = {

    scales: {
        y: {
          type: "time",
          time: {
            unit: "minute",
            displayFormats: {
                minute: "HH:mm"
            }
          }
        },
      },
    layout: {
      padding: {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
      },
    },
    plugins: {
      title: {
        display: true,
        text: `VPN Workflow Summary`,
      },
    },
  };

  // const _fakedata = [
  //   {
  //     time: 5,
  //     date: "2023-01-03T19:20:23Z",
  //     commit: "(#9835)",
  //   },
  //   {
  //     time: 2,
  //     date: "2023-01-01T19:20:23Z",
  //     commit: "(#6831)",
  //   },
  //   {
  //     time: 3,
  //     date: "2023-01-02T19:20:23Z",
  //     commit: "(#5132)",
  //   },
  //   {
  //     time: 4,
  //     date: "2022-12-31T19:20:23Z",
  //     commit: "(#2268)",
  //   },
  // ];

  const fakedata = [
    {
      time: moment("02:34", "HH:mm").format("HH:mm"),
      date: "2023-01-03T19:20:23Z",
      commit: "(#9835)",
    },
    {
      time: moment("01:45", "HH:mm").format("HH:mm"),
      date: "2023-01-01T19:20:23Z",
      commit: "(#6831)",
    },
    {
      time: moment("01:23", "HH:mm").format("HH:mm"),
      date: "2023-01-02T19:20:23Z",
      commit: "(#5132)",
    },
    {
      time: moment("01:07", "HH:mm").format("HH:mm"),
      date: "2022-12-31T19:20:23Z",
      commit: "(#2268)",
    },
  ];

  const labels = fakedata.map((data) => data.commit);
  console.log(fakedata);

  const data = {
    labels,
    datasets: [
      {
        label: "Duration",
        data: fakedata.map((data) => data.time),
        borderColor: "#17ca80",
        backgroundColor: "#17ca80",
      },
    ],
  };

  //   const data = {
  //     labels,
  //     datasets: [
  //       {
  //         label: "Duration",
  //         data: fakedata.map(data => data.time),
  //         borderColor: "#17ca80",
  //         backgroundColor: "#17ca80",
  //       },
  //     ],
  //   };

  return <Line options={options} data={data} />;
}