/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const statuses = {
  success: "#17ca80",
  in_progress: "#ffbf00",
  queued: "#ffbf00",
  failure: "#f47169",
};

const WorkflowCard = ({ workflow }) => {
  let navigate = useNavigate();

  const openHistory = (wf) => {
    if (wf.name === "Functional tests") {
      navigate("/functional-tests");
    } else {
      navigate(`/workflows/${wf.workflow_id}`);
    }
  };

  return (
    <div
    key={workflow.node_id}
      onClick={() => openHistory(workflow)}
      style={{
        cursor: "pointer",
        padding: "2rem",
        boxShadow: "0 15px 50px rgba(0,0,0,0.35)",
        borderRadius: 10,
        backgroundColor:
          statuses[
            workflow.conclusion === null ? workflow.status : workflow.conclusion
          ],
      }}
    >
      <div>{workflow.name}</div>
      <div>{workflow.display_title}</div>
      <div className="subTitle">By {workflow.head_commit.author.name}</div>
      <div className="subTitle">
        {moment(workflow.run_started_at).format("MMMM Do YYYY")}
      </div>
    </div>
  );
};

export default WorkflowCard;