/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import moment from "moment";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const statuses = {
  success: "#17ca80",
  in_progress: "#ffbf00",
  queued: "#ffbf00",
  failure: "#f47169",
};

const HomeComponent = ({
  latestWorkflowData,
  chartData,
  testHistory,
  passPercentage,
}) => {
  const getDuration = (run) => {
    let startTime = moment(run.test_run.started, "HH:mm:ss a"),
      endTime = moment(run.test_run.completed, "HH:mm:ss a");
    let duration = moment(endTime).diff(moment(startTime), "minutes");
    let formattedDuration;

    if (duration < 0) {
      formattedDuration = duration * -1;
    } else {
      formattedDuration = duration;
    }

    return formattedDuration;
  };

  return (
    <div>
      {latestWorkflowData.workflow_run && (
        <div id="main-home">
          <div id="left">
            <div className="latest">
              <div>
                <h3>Latest Main Branch Test Runs</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div className="run-info">
                  <div style={{ fontWeight: 600, marginLeft: 20 }}>
                    {latestWorkflowData.workflow_run.title}
                  </div>
                  <div className="subTitle">
                    {moment(latestWorkflowData.workflow_run.created).format(
                      "MMM. Do YYYY"
                    )}
                  </div>
                  <div className="sub">
                    {latestWorkflowData.workflow_run.actor_name}
                  </div>
                  <div className="count">
                    <div style={{ fontWeight: "bolder", fontSize: 40 }}>
                      {latestWorkflowData.test_runs.length}
                    </div>
                    <div>test cases</div>
                  </div>
                </div>
                <div className="chart">
                  <div style={{ fontSize: 60, fontWeight: "bold" }}>
                    {passPercentage}%
                  </div>
                  <div>Passed test cases</div>
                </div>
              </div>
            </div>
            <div className="test-list">
              <div>
                <h3>Latest Test Case Results</h3>
              </div>
              {latestWorkflowData.test_runs.map((run) => {
                return (
                  <div
                    style={{
                      margin: "2px 0",
                      padding: "5px",
                      cursor: "pointer",
                      borderBottom: "1px solid",
                      backgroundColor: `${statuses[run.test_run.conclusion]}`,
                    }}
                    key={run.test_run.id}
                  >
                    {run.test_run.name} - {getDuration(run)} secs
                  </div>
                );
              })}
            </div>
          </div>
          <div id="right">
            <div className="trends">
              <h3>Test Trends</h3>
              <LineChart
                isAnimationActive={true}
                width={800}
                height={300}
                data={chartData}
              >
                <Line type="monotone" dataKey="passed" stroke="#228B22" />
                <Line type="monotone" dataKey="flakes" stroke="#FFDB58" />
                <Line type="monotone" dataKey="failures" stroke="#FF0000" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </div>
            <div className="details">
              <div>
                <h3>Flake History (Past 10 commits)</h3>
              </div>
              <div className="history">
                {testHistory.map((run) => {
                  return (
                    <div className="history-row" key={run.test_commit}>
                      <div className="test-name">
                        <div className="title">Test Name</div>
                        <div className="subTitle">{run.test_name}</div>
                        <div className="sub">
                          {moment(run.test_date).format("MMM. Do YYYY")}
                        </div>
                      </div>
                      <div className="commit">
                        <div className="title">Commit</div>
                        <div className="subTitle">{run.test_commit}</div>
                        <div className="sub">{run.test_commit_actor}</div>
                      </div>
                      <div className="test-history">
                        <div className="title">History</div>
                        <div className="test-run-history">
                          <div>
                            <div className="sub">Flaky Run(s)</div>
                            <div>{run.test_flaked_count}</div>
                          </div>
                          <div>
                            <div className="sub">Failed Run(s)</div>
                            <div>{run.test_failed_count}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
