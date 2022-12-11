import React, {useState, useEffect} from "react";
import "./tickets.css";
import * as microsoftTeams from "@microsoft/teams-js";

export function Tickets() {
  const [userContext, setUserContext] = useState();
  const [tickets, setTickets] = useState([]);
  const { REACT_APP_SYNCRO_API_KEY, REACT_APP_SYNCRO_SUBDOMAIN } = process.env;

  useEffect(() => {
    microsoftTeams.initialize();
    microsoftTeams.getContext((context) => {
      setUserContext(context.userPrincipalName);
    });   
  }, []);

  useEffect(() => {
    setTickets([]);
    fetch( `https://${REACT_APP_SYNCRO_SUBDOMAIN}.syncromsp.com/api/v1/search?query=${userContext}&api_key=${REACT_APP_SYNCRO_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        //Use Contact ID to get list of open tickets from Syncro API
        fetch( `https://${REACT_APP_SYNCRO_SUBDOMAIN}.syncromsp.com/api/v1/tickets?api_key=${REACT_APP_SYNCRO_API_KEY}&status=New&contact_Id=` + data.results[0].table._id)
        .then(response => response.json())
        .then(data => {
          setTickets(data.tickets);
        });
      }
      );
  }, [userContext]);

  return (
    <div className="deploy page">
      <h2>Open Tickets</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Ticket #</th>
            <th scope="col">Subject</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets && tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.subject}</td>
              <td style={{color: ticket.status === "New" ? "green" : "black"}}>{ticket.status}</td>
              <td>{ticket.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
