/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import moment from "moment";
import { LineGraph } from "./TestHistoryLineGraph";
import { DonutGraph } from "./ResultPieGraph";

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
  const calculateDuration = ({ start, end }) => {
    const startTime = moment(start, "HH:mm:ss a");
    const endTime = moment(end, "HH:mm:ss a");
    const min = moment.utc(endTime.diff(startTime)).format("mm");
    const sec = moment.utc(endTime.diff(startTime)).format("ss");
    return `${Number(min)}m ${sec}s`;
  };

  const generatePrUrl = (run) => {
    const pr_title = run.display_title;
    const getHashIndex = pr_title.lastIndexOf("#");
    const pullRequestNumber = pr_title.slice(getHashIndex + 1).replace(")", "");
    return `https://github.com/mozilla-mobile/mozilla-vpn-client/pull/${pullRequestNumber}`;
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
                  <div
                    style={{
                      fontWeight: 700,
                      marginLeft: 20,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(
                        generatePrUrl(latestWorkflowData.workflow_run)
                      )
                    }
                  >
                    {latestWorkflowData.workflow_run.display_title}
                  </div>
                  <div className="subTitle">
                    {moment(latestWorkflowData.workflow_run.created).format(
                      "MMM. Do YYYY"
                    )}
                  </div>
                  <div className="sub">
                    {latestWorkflowData.workflow_run.head_commit.author.name}
                  </div>
                  <div className="count">
                    <div style={{ fontWeight: "bolder", fontSize: 40 }}>
                      {latestWorkflowData.test_runs.length}
                    </div>
                    <div>Test Cases</div>
                    <div
                      style={{ fontSize: 12, fontWeight: 600, color: "gray" }}
                    >
                      Total Duration:{" "}
                      {calculateDuration({
                        start: latestWorkflowData.workflow_run.run_started_at,
                        end: latestWorkflowData.workflow_run.updated_at,
                      })}
                    </div>
                  </div>
                </div>
                <div className="chart">
                  <DonutGraph
                    latestWorkflowData={latestWorkflowData}
                    passPercentage={passPercentage}
                  />
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
                      margin: "5px 0",
                      padding: "15px",
                      cursor: "pointer",
                      width: 800,
                      borderRadius: 5,
                      backgroundColor: `${statuses[run.test.conclusion]}`,
                    }}
                    onClick={() => window.open(run.test.html_url)}
                    key={run.test.id}
                  >
                    {run.test.name} -{" "}
                    {calculateDuration({
                      start: run.test.started_at,
                      end: run.test.completed_at,
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div id="right">
            <div className="trends" style={{ width: "100%", height: 300 }}>
              <LineGraph chartData={chartData} />
            </div>
            <div className="details">
              <div>
                <h3>Flake History</h3>
              </div>
              <div className="history">
                {testHistory.map((run, idx) => {
                  return (
                    <div
                      className="history-row"
                      key={idx}
                      onClick={() => window.open(run.test_html_url)}
                    >
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
                        <div className="sub">By {run.test_commit_actor}</div>
                      </div>
                      <div className="test-history">
                        <div className="title">History</div>
                        <div className="test-run-history">
                          <div>
                            <div className="sub" style={{ color: "#ffbf00" }}>
                              Flake(s)
                            </div>
                            <div>{run.test_flaked_count}</div>
                          </div>
                          <div>
                            <div className="sub" style={{ color: "#f47169" }}>
                              Failure(s)
                            </div>
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
