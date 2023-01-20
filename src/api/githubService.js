/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import axios from "axios";

export const getAllWorkflows = async () => {
  try {
    const api =
      "https://raw.githubusercontent.com/mozrokafor/dashboard/main/data/allworkflows.json";

    const {
      data: { workflows },
    } = await axios.get(api);
    return workflows;
  } catch (err) {
    console.log(err);
    return;
  }
};

export const getAllRunsForWorkflow = async (workflow_id) => {
  try {
    const api = `https://raw.githubusercontent.com/mozrokafor/dashboard/main/data/workflowruns/workflowruns-${workflow_id}.json`;

    const {
      data: { workflow_runs },
    } = await axios.get(api);

    return workflow_runs;
  } catch (err) {
    console.log(err);
    return;
  }
};

export const getAllWorkflowsStats = async () => {
  const api = `https://raw.githubusercontent.com/mozrokafor/dashboard/main/data/allworkflowstats.json`;

  const { data } = await axios.get(api);

  return data[0];
};

export const getFullTestWorkflowReport = async () => {
  try {
    const api = `https://raw.githubusercontent.com/mozrokafor/dashboard/main/data/checkruns/test-history.json`;

    const {
      data: { test_history },
    } = await axios.get(api);

    return test_history;
  } catch (err) {
    console.log(err);
    return;
  }
};

export const getReleaseDiffsAsync = async () => {
  const base = "releases/2.12.0";
  const head = "releases/2.13.0";

  try {
    const api = `https://api.github.com/repos/mozilla-mobile/mozilla-vpn-client/compare/${base}...${head}`;

    const { data } = await axios.get(api);

    return data;
  } catch (err) {
    console.log(err);
    return;
  }
};

export const getReleaseDiffs = () => {
  const base = "releases/2.12.0";
  const head = "releases/2.13.0";

  try {
    const api = `https://api.github.com/repos/mozilla-mobile/mozilla-vpn-client/compare/${base}...${head}`;

    return axios.get(api).then(res => res.data);
  } catch (err) {
    console.log(err);
    return;
  }
};
