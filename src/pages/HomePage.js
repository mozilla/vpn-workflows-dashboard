/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import { getAllWorkflows } from "../api/githubService";
import WorkflowCard from "../components/WorkflowCard";

const HomePage = () => {
  const [isLoading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    setLoading(true);
    getAllWorkflows()
      .then((allWorkflows) => {
        setWorkflows(allWorkflows);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div>
      <div style={{ margin: "50px 0", fontWeight: "bold", fontSize: 50 }}>
        VPN Workflow Statuses
      </div>
      <div id="workflows-container">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          workflows.map((workflow) => {
            return (
              <WorkflowCard key={workflow.workflow_id} workflow={workflow} />
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomePage;
