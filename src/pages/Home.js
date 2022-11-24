/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { getFullTestWorkflowReport } from "../api/githubService";
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
        let cData = workflowData.workflow_runs_data.map(data => ({
          name: `${moment(data.workflow_run.run_started_at).format("L")} - ${
            data.workflow_run.display_title
          }`,
          passed: data.passed_count,
          flakes: data.flaked_count,
          failures: data.failed_count,
          date: moment(data.workflow_run.run_started_at).format("L"),
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
    for (let workflow of workflows) {
      if (workflow.flaked_count > 0 || workflow.failed_count > 0) {        
        for (let test_run of workflow.test_runs) {
          if (test_run.test_flake_history.length) {
            const testFlakeHistory = {
              test_id: test_run.test_run.id,
              test_commit: workflow.workflow_run.display_title,
              test_commit_actor: workflow.workflow_run.author,
              test_name: test_run.test_name,
              test_failed_count: test_run.test_failed_count,
              test_flaked_count: test_run.test_flaked_count,
              test_date: test_run.test_completed,
              tests_error_messages: test_run.test_annotations,
            };

            flakes.push(testFlakeHistory);
          }
        }
      }
    }

    setTestHistory(flakes);
    setLoadingFlakes(false);
  };

  return (
    <div>
      {isLoading ? (
        <div style={{ fontSize: 160, fontWeight: 'bold', marginTop: 300 }}>Loading...</div>
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
