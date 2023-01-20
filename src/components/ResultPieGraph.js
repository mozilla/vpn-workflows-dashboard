/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutGraph({ latestWorkflowData, passPercentage }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${passPercentage}% Tests Passed`,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return `${(
              (tooltipItems[0].parsed / latestWorkflowData.test_runs.length) *
              100
            ).toFixed(2)}% - ${tooltipItems[0].label}`;
          },
        },
      },
    },
  };

  const data = {
    labels: ["Passed", "Failures", "Flakes"],
    datasets: [
      {
        label: "Count",
        data: [
          latestWorkflowData.passed_count,
          latestWorkflowData.failed_count,
          latestWorkflowData.flaked_count,
        ],
        backgroundColor: ["#17ca80", "#f47169", "#ffbf00"],
        borderColor: ["#17ca80", "#f47169", "#ffbf00"],
        borderWidth: 1,
      },
    ],
  };
  return <Doughnut data={data} options={options} />;
}
