/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllRunsForWorkflow } from "../api/githubService";
import { WfLineGraph } from "../components/WorkflowHistoryLineGraph";

const WorkflowHistoryPage = () => {
  const params = useParams();
  const [isLoading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    setLoading(true);
    let dateHash = {};
    let chartDataArray = [];
    getAllRunsForWorkflow(params.workflowId)
      .then((workflowHistory) => {
        workflowHistory.forEach((wf) => {
          const date = wf.run_started_at.split("T")[0];
          if (dateHash[date]) {
            dateHash[date].push(wf);
          } else {
            dateHash[date] = [wf];
          }
        });

        for (let property in dateHash) {
          let cObject = {
            date: property,
            name: dateHash[property][0].name,
            total_count: dateHash[property].length,
            failure_count: 0,
            success_count: 0,
            cancelled_count: 0,
            others_count: 0,
            data: dateHash[property],
          };

          for (let run of dateHash[property]) {
            if (run.conclusion === "failure") {
              cObject.failure_count++;
            } else if (run.conclusion === "success") {
              cObject.success_count++;
            } else if (run.conclusion === "cancelled") {
              cObject.cancelled_count++;
            } else {
              cObject.others_count++;
            }
          }

          chartDataArray.push(cObject);
        }

        setChartData(chartDataArray.reverse());
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div style={{ padding: 50 }} className="wf-history">
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <WfLineGraph chartData={chartData} />
      )}
    </div>
  );
};

export default WorkflowHistoryPage;