require("dotenv").config();
const github = require("@actions/github");
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
const fs = require("fs");
const _ = require("lodash");

const orgInfo = {
  owner: "mozilla-mobile",
  repo: "mozilla-vpn-client",
};

async function getData() {
  await getAllWorkflows();
  await getAllRunsForWorkflow();
  await getRunsForSingleWorkflow();
  await generateTestHistoryInfo();
}

getData();

async function getAllWorkflows() {
  const awfPath = "./data/allworkflows.json";
  await checkPath("./data");
  await checkNestedPath("./data/checkruns");
  await checkNestedPath("./data/workflowruns");

  if (!fs.existsSync(awfPath)) {
    fs.writeFileSync(awfPath, JSON.stringify({ workflows: [] }));
  }

  const {
    data: { workflow_runs },
  } = await octokit.request(
    "GET /repos/{owner}/{repo}/actions/runs?branch=main",
    orgInfo
  );

  const existingWorkflowsString = fs.readFileSync(awfPath, "utf8");
  const existingWorkflowsObject = JSON.parse(existingWorkflowsString);

  let wfArray = [];
  let workflowsHash = {};

  for (let workflow of workflow_runs) {
    if (!(workflow.name in workflowsHash)) {
      workflowsHash[workflow.name] = workflow.id;
      workflow.actor = undefined;
      workflow.triggering_actor = undefined;
      workflow.repository = undefined;
      workflow.head_repository = undefined;
      wfArray.push(workflow);
    }
  }

  existingWorkflowsObject.workflows = wfArray;
  fs.writeFileSync(awfPath, JSON.stringify(existingWorkflowsObject));

  return wfArray;
}

async function getAllRunsForWorkflow() {
  const awfPath = "./data/allworkflows.json";
  const workflows = JSON.parse(fs.readFileSync(awfPath, "utf8")).workflows;

  let runs = [];
  for (let workflow of workflows) {    
    const {
      data: { workflow_runs },
    } = await octokit.request(
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs?branch=main&per_page=100",
      {
        ...orgInfo,
        workflow_id: workflow.workflow_id,
      }
    );

    if (
      !fs.existsSync(`./data/workflowruns/workflowruns-${workflow.workflow_id}.json`)
    ) {
      fs.writeFileSync(
        `./data/workflowruns/workflowruns-${workflow.workflow_id}.json`,
        JSON.stringify({ workflow_runs: [] })
      );
    }

    const existingWorkflowRunsObject = JSON.parse(
      fs.readFileSync(
        `./data/workflowruns/workflowruns-${workflow.workflow_id}.json`,
        "utf8"
      )
    );

    let workflowArray = []
    for(let workflow_run of workflow_runs){
        const runInfo =  {
          id: workflow_run.id,
          name: workflow_run.name,
          node_id: workflow_run.node_id,
          display_title: workflow_run.display_title,
          status: workflow_run.status,
          workflow_id: workflow_run.workflow_id,
          check_suite_id: workflow_run.check_suite_id,
          html_url: workflow_run.html_url,
          head_commit: workflow_run.head_commit,
          conclusion: workflow_run.conclusion,
          run_started_at: workflow_run.run_started_at,
        };

        workflowArray.push(runInfo);
    }

    const existingWorkflowRunsArray = existingWorkflowRunsObject.workflow_runs;
    const mergedWorkflowruns = _.unionBy(
      workflowArray,
      existingWorkflowRunsArray,
      "node_id"
    );
    existingWorkflowRunsObject.workflow_runs = mergedWorkflowruns;

    fs.writeFileSync(
      `./data/workflowruns/workflowruns-${workflow.workflow_id}.json`,
      JSON.stringify(existingWorkflowRunsObject)
    );

    runs.push(workflowArray)
  }

  return runs;
}

async function generateTestHistoryInfo() {
  let return_data = [];
  const frPath = "./data/workflowruns/functional-workflow-runs.json";
  const thPath = "./data/checkruns/test-history.json";

  const existingWorkflowRunsArray = JSON.parse(
    fs.readFileSync(frPath, "utf8")
  ).workflow_runs;
  if (!existingWorkflowRunsArray) return new Error("No existing check runs");

  if (!fs.existsSync(thPath)) {
    fs.writeFileSync(thPath, JSON.stringify({ test_history: [] }));
  }

  for (let workflow_run of existingWorkflowRunsArray) {
    let workflow = {
      workflow_run,
      test_runs: [],
      passed_count: 0,
      failed_count: 0,
      flaked_count: 0,
    };

    const check_runs = await getCheckRuns(workflow.workflow_run.check_suite_id);
    for (let check_run of check_runs) {
      let testInfo = {
        test: check_run,
        test_annotations: [],
        test_flake_history: [],
        test_flaked_count: 0,
        test_failed_count: 0,
        test_passed_count: 0,
      };

      testInfo.test_name = check_run.name;
      testInfo.test_started = check_run.started_at;
      testInfo.test_completed = check_run.completed_at;

      // add annotations/flakes per testrun (check run)
      if (testInfo.test.output.annotations_count > 0) {
        let flake = {
          flakes: 0,
          failures: 0,
          messages: [],
          start_line: [],
          end_line: [],
        };

        let message = {};

        const annotations = await getAnnotations(testInfo.test.id);

        testInfo.test_annotations = annotations;
        flake.test_name = testInfo.test_name;

        for (let annotation of annotations) {
          if (annotation.annotation_level === "warning") {
            workflow.flaked_count++;
            testInfo.test_flaked_count++;
            flake.flakes++;
            message.info = annotation.message;
            message.start_line = annotation.start_line;
            message.end_line = annotation.end_line;
            flake.messages.push(message);
          }

          if (annotation.annotation_level === "failure") {
            workflow.failed_count++;
            testInfo.test_failed_count++;
            flake.failures++;
            message.info = annotation.message;
            message.start_line = annotation.start_line;
            message.end_line = annotation.end_line;
            flake.messages.push(message);
          }

          testInfo.test_flake_history.push(flake);
        }
      }

      // update test run and workflow run passed counts
      if (check_run.conclusion === "success") {
        workflow.passed_count++;
        testInfo.test_passed_count++;
      }

      workflow.test_runs.push(testInfo);
    }

    return_data.push(workflow);
  }

  const existingTestHistoryObject = JSON.parse(fs.readFileSync(thPath, "utf8"));
  const existingTestHistoryArray = existingTestHistoryObject.test_history;
  const mergedTestHistory = _.unionBy(
    return_data,
    existingTestHistoryArray,
    "workflow_run.node_id"
  );
  existingTestHistoryObject.test_history = mergedTestHistory;

  fs.writeFileSync(thPath, JSON.stringify(existingTestHistoryObject));
  return return_data;
}

async function getAnnotations(test_id) {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
    {
      ...orgInfo,
      check_run_id: test_id,
    }
  );

  return data;
}

async function getRunsForSingleWorkflow() {
  const workflow_id = 5937682;
  const frPath = "./data/workflowruns/functional-workflow-runs.json";
  let return_data = [];
  let i = 0;

  if (!fs.existsSync(frPath)) {
    fs.writeFileSync(frPath, JSON.stringify({ workflow_runs: [] }));
  }

  const existingFunctionalRunsObject = JSON.parse(
    fs.readFileSync(frPath, "utf8")
  );
  const origArray = existingFunctionalRunsObject.workflow_runs;

  try {
    const {
      data: { workflow_runs },
    } = await octokit.request(
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs?branch=main&status=completed&per_page=100",
      {
        ...orgInfo,
        workflow_id,
      }
    );

    while (return_data.length < 10 && workflow_runs.length) {
      if (workflow_runs[i] && workflow_runs[i].conclusion !== "cancelled") {
        workflow_runs[i].actor = undefined;
        workflow_runs[i].triggering_actor = undefined;
        workflow_runs[i].repository = undefined;
        workflow_runs[i].head_repository = undefined;
        return_data.push(workflow_runs[i]);
      }

      ++i;
    }

    const mergedFunctionalRunsArray = _.unionBy(
      return_data,
      origArray,
      "node_id"
    );
    existingFunctionalRunsObject.workflow_runs = mergedFunctionalRunsArray;

    fs.writeFileSync(frPath, JSON.stringify(existingFunctionalRunsObject));
    return return_data;
  } catch (err) {
    console.log("Error fetching runs for single workflow", err);
    return;
  }
}

async function getCheckRuns(check_suite_id) {
  let return_data = [];
  try {
    const {
      data: { check_runs },
    } = await octokit.request(
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
      {
        ...orgInfo,
        check_suite_id,
      }
    );

    for (let check_run of check_runs) {
      if (check_run.name !== "Build Test Client") {
        check_run.app = undefined;
        return_data.push(check_run);
      }
    }

    return return_data;
  } catch (err) {
    console.log("Error fetching check_runs", err);
    return;
  }
}

async function checkPath(path) {
  if (!fs.existsSync(path)) fs.mkdirSync(path);
}

async function checkNestedPath(path) {
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}