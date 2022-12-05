/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { getAllRunsForWorkflow } from "../api/githubService";
import { WfLineGraph } from "../components/WorkflowHistoryLineGraph";

const WorkflowHistoryPage = () => {
  const params = useParams();
  const [isLoading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [failures, setFailures] = useState([]);

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    setLoading(true);
    let dateHash = {};
    let chartDataArray = [];
    let failures = [];
    getAllRunsForWorkflow(params.workflowId)
      .then((workflowHistory) => {
        workflowHistory.forEach((wf) => {
          if (wf?.run_started_at) {
            const date = wf.run_started_at?.split("T")[0];
            if (dateHash[date]) {
              dateHash[date].push(wf);
            } else {
              dateHash[date] = [wf];
            }
          }

          if (wf.conclusion === "failure" && wf?.run_started_at) {
            failures.push(wf);
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

        setFailures(failures);
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
        <>
          <WfLineGraph chartData={chartData} />
          <div className="details" style={{ height: 500 }}>
            <div>
              <h3>Failure History</h3>
            </div>
            <div
              className="history"
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {failures.map((run, idx) => {
                return (
                  <div
                    className="history-row"
                    style={{ justifyContent: "space-evenly" }}
                    key={idx}
                    onClick={() => window.open(run.html_url)}
                  >
                    <div className="test-name">
                      <div className="title">Workflow Run Title</div>
                      <div className="subTitle">{run.display_title}</div>
                      <div className="sub">
                        {moment(run.run_started_at).format("MMM. Do YYYY")}
                      </div>
                    </div>
                    <div className="commit">
                      <div className="title">Commit</div>
                      <div className="subTitle">{run.head_commit.message}</div>
                      <div className="sub">
                        By {run.head_commit.author.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkflowHistoryPage;