/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { getFullTestWorkflowReport } from "../api/githubService";
import HomeComponent from "../components/HomeComponent";

const FunctionalTestsPage = () => {
  const [isLoading, setLoading] = useState(false);
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
        let cData = workflowData.map((data) => ({
          name: `${moment(data.workflow_run.run_started_at).format("L")} - ${
            data.workflow_run.display_title
          }`,
          passed: data.passed_count,
          flakes: data.flaked_count,
          failures: data.failed_count,
          date: moment(data.workflow_run.run_started_at).format("L"),
        }));

        const passPerc = Math.floor(
          (workflowData[0].passed_count / workflowData[0].test_runs.length) *
            100
        );

        setPassPercentage(passPerc);
        buildTestRuns(workflowData);
        setChartData(cData.reverse());
        setLatestWorkflowData(workflowData[0]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const buildTestRuns = (workflows) => {
    let flakes = [];
    for (let workflow of workflows) {
      if (workflow.flaked_count > 0 || workflow.failed_count > 0) {
        for (let test_run of workflow.test_runs) {
          if (test_run.test_flake_history.length) {
            const testFlakeHistory = {
              test_id: test_run.test.id,
              test_commit: workflow.workflow_run.display_title,
              test_commit_actor: workflow.workflow_run.head_commit.author.name,
              test_name: test_run.test_name,
              test_html_url: test_run.test.html_url,
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
  };

  return (
    <div>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <HomeComponent
          latestWorkflowData={latestWorkflowData}
          chartData={chartData}
          testHistory={testHistory}
          passPercentage={passPercentage}
        />
      )}
    </div>
  );
};

export default FunctionalTestsPage;