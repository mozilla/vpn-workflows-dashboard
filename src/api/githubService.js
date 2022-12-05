/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import axios from "axios";

export const getAllWorkflows = async () => {
  const api =
    "https://raw.githubusercontent.com/mozrokafor/dashboard/main/data/allworkflows.json";

  const {
    data: { workflows },
  } = await axios.get(api);
  return workflows;
};

export const getAllRunsForWorkflow = async (workflow_id) => {
  const api = `https://raw.githubusercontent.com/mozrokafor/dashboard/main/data/workflowruns/workflowruns-${workflow_id}.json`;

  const {
    data: { workflow_runs },
  } = await axios.get(api);

  return workflow_runs;
};

export const getFullTestWorkflowReport = async () => {
  try {
    const api = `https://raw.githubusercontent.com/mozrokafor/dashboard/main/data/checkruns/test-history.json`;

    const {
      data: { test_history },
    } = await axios.get(api);

    return test_history;
  } catch (err) {
    return;
  }
};
