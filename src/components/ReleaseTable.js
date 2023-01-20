import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaGithub, FaRegClock, FaJira, FaRegUser, FaRss } from "react-icons/fa";

const ReleaseTable = ({ commits }) => {
  const [tableCommits, setTableCommits] = useState([]);

  useEffect(() => {
    // setCommit(commitObject.commit);
    // loop through commits
    let tcs = [];
    for (let tc of commits) {
      const message = tc.commit.message;
      let tempPull = "";
      let jira = "";
      if (message.includes("VPN-")) {
        jira = message.match(/VPN-(\d+(\.\d+)?)/g)[0];
      }

      const tempTitle = message.split("*")[0];
      /*eslint-disable */
      const titleArr = tempTitle.match(/\B\#\w\w+\b/g);

      if (titleArr !== null) {
        tempPull = titleArr[0];
      }

      const commit = {
        pull: tempPull,
        title: tempTitle,
        author: tc.commit.author.name,
        date: moment(tc.author.date).format("MMMM Do, YYYY"),
        jira,
      };

      tcs.push(commit);
    }

    setTableCommits(tcs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "30px 150px", fontSize: 14 }}>
      <table>
        <tr className="commit-header">
          <th>JIRA</th>
          <th>Pull</th>
          <th>Title</th>
          <th>Author</th>
          <th>Date</th>
        </tr>       

        {tableCommits.map((tc, idx) => {
          return (
            <tr key={idx} className="border_bottom commits">
              <td>
                <div className={tc.jira ? "bold" : null}>
                  <a
                    href={
                      tc.jira
                        ? `https://mozilla-hub.atlassian.net/browse/${tc.jira}`
                        : null
                    }
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <FaJira /> {tc.jira ? tc.jira : "No Jira Ticket"}
                  </a>
                </div>
              </td>
              <td>
                <div className={tc.pull ? "bold" : null}>
                    <a
                    href={
                        tc.pull
                        ? `https://github.com/mozilla-mobile/mozilla-vpn-client/pull/${tc.pull.replace(
                            "#",
                            ""
                            )}`
                        : null
                    }
                    target="_blank"
                    rel="noreferrer noopener"
                    >
                    <FaGithub /> {tc.pull ? tc.pull : "No Pull Number"}
                    </a>
                </div>
              </td>
              <td>
                <div>
                    <a
                    href={
                        tc.pull
                        ? `https://github.com/mozilla-mobile/mozilla-vpn-client/pull/${tc.pull.replace(
                            "#",
                            ""
                            )}`
                        : null
                    }
                    target="_blank"
                    rel="noreferrer noopener"
                    >
                    <FaRss /> {tc.title}
                    </a>
                </div>
              </td>
              <td>
                <FaRegUser /> {tc.author}
              </td>
              <td>
                <FaRegClock /> {tc.date}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default ReleaseTable;
