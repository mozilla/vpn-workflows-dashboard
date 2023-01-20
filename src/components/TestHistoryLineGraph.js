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

export function LineGraph({ chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "VPN Functional Test History",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return chartData[tooltipItems[0].dataIndex].name;
          },
        },
      },
    },
  };

  const labels = chartData.map((data) => data.date);

  const data = {
    labels,
    datasets: [
      {
        label: "Passed",
        data: chartData.map((data) => data.passed),
        borderColor: "#17ca80",
        backgroundColor: "#17ca80",
      },
      {
        label: "Flakes",
        data: chartData.map((data) => data.flakes),
        borderColor: "#ffbf00",
        backgroundColor: "#ffbf00",
      },
      {
        label: "Failures",
        data: chartData.map((data) => data.failures),
        borderColor: "#f47169",
        backgroundColor: "#f47169",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
