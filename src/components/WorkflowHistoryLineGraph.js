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
} from "chart.js";
import moment from "moment";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function WfLineGraph({ chartData }) {
  const options = {
    responsive: true,
    layout: {
      padding: {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `VPN ${chartData[0]?.name} Workflow History`,
      },
    },
  };

  const labels = chartData.map((data) =>
    moment(data.date).format("MMM. Do YYYY")
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Success",
        data: chartData.map((data) => data.success_count),
        borderColor: "#17ca80",
        backgroundColor: "#17ca80",
      },
      {
        label: "Failure",
        data: chartData.map((data) => data.failure_count),
        borderColor: "#f47169",
        backgroundColor: "#f47169",
      },
    ],
  };

  return <Line options={options} data={data} />;
}