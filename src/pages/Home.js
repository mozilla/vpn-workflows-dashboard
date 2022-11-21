/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { getFullTestWorkflowReport } from "../api/functional_tests";
import HomeComponent from "../components/HomeComponent";

const HomePage = () => {
  const [isLoading, setLoading] = useState(false);
  const [isLoadingFlakes, setLoadingFlakes] = useState(false);
  const [latestWorkflowData, setLatestWorkflowData] = useState({});
  const [testHistory, setTestHistory] = useState({});
  const [passPercentage, setPassPercentage] = useState(0);
  const [chartData, setChartData] = useState();

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    setLoading(true);
    getFullTestWorkflowReport()
      .then((workflowData) => {
        console.log("herererer", workflowData.workflow_runs_data[0]);
        let cData = workflowData.workflow_runs_data.map((data, idx) => ({
          name: `${moment(data.workflow_run.started).format("L")} - ${
            data.workflow_run.title
          }`,
          passed: data.passed_count,
          flakes: data.flaked_count,
          failures: data.failed_count,
          date: moment(data.workflow_run.started).format("L"),
        }));

        const passPerc = Math.floor(
          (workflowData.workflow_runs_data[0].passed_count /
            workflowData.workflow_runs_data[0].test_runs.length) *
            100
        );
        setPassPercentage(passPerc);
        buildTestRuns(workflowData.workflow_runs_data);
        setChartData(cData.reverse());
        setLatestWorkflowData(workflowData.workflow_runs_data[0]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const buildTestRuns = (workflows) => {
    setLoadingFlakes(true);
    let flakes = [];
    for (let i = 0; i < workflows.length; i++) {
      const workflow = workflows[i];
      if (workflow.flaked_count > 0 || workflow.failed_count > 0) {
        const test_runs = workflow.test_runs;
        for (let j = 0; j < test_runs.length; j++) {
          const test_run = test_runs[j];

          if (test_run.test_flake_history.length) {
            const testFlakeHistory = {
              test_commit: workflow.workflow_run.title,
              test_commit_actor: workflow.workflow_run.actor_name,
              test_name: test_run.test_name,
              test_failed_count: 0,
              test_flaked_count: 0,
              test_date: test_run.test_completed,
              tests_error_messages: test_run.test_annotations,
            };

            for (let k = 0; k < test_run.test_annotations.length; k++) {
              const annotation = test_run.test_annotations[k];
              if (annotation.annotation_level === "warning") {
                testFlakeHistory.test_flaked_count++;
              }

              if (annotation.annotation_level === "failure") {
                testFlakeHistory.test_failed_count++;
              }
            }

            flakes.push(testFlakeHistory);
          }
        }
      }
    }

    let combinedTests = flakes.reduce(function (acc, curr) {
      let findIndex = acc.findIndex(function (item) {
        return item.test_commit === curr.test_commit;
      });

      if (findIndex === -1) {
        acc.push(curr);
      } else {
        acc[findIndex] = Object.assign({}, acc[findIndex], curr);
      }

      return acc;
    }, []);

    setTestHistory(combinedTests);
    setLoadingFlakes(false);
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <HomeComponent
          latestWorkflowData={latestWorkflowData}
          chartData={chartData}
          isLoadingFlakes={isLoadingFlakes}
          testHistory={testHistory}
          passPercentage={passPercentage}
        />
      )}
    </div>
  );
};

export default HomePage;
