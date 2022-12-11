import React, {useState, useEffect} from "react";
import "./CreateTicket.css";
import * as microsoftTeams from "@microsoft/teams-js";  
export function CreateTicket() {
  const [userContext, setUserContext] = useState();
  const [customer, setCustomer] = useState();
  const [contact, setContact] = useState();
  const { REACT_APP_SYNCRO_API_KEY, REACT_APP_SYNCRO_SUBDOMAIN } = process.env;
  
  //Get the user context from Teams
  useEffect(() => {
    microsoftTeams.initialize();
    microsoftTeams.getContext((context) => {
      setUserContext(context.userPrincipalName);
    });
  }, []);

      //Use Search Endpoint from Syncro API to get contact ID only after userContext is set
      useEffect(() => {
        fetch( `https://${REACT_APP_SYNCRO_SUBDOMAIN}.syncromsp.com/api/v1/search?query=${userContext}&api_key=${REACT_APP_SYNCRO_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setContact(data.results[0].table._id);
        setCustomer(data.results[0].table._source.table.customer_id);
      });
      }, [userContext]);

  //Function for onsubmit of form
  const handleSubmit = async (event) => {
    event.preventDefault();
   //Create New Ticket in syncro based on submitted form
   await fetch(`https://${REACT_APP_SYNCRO_SUBDOMAIN}.syncromsp.com/api/v1/tickets?api_key=${REACT_APP_SYNCRO_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: document.getElementById("subject").value,
        comments_attributes: [
          {
            body: document.getElementById("description").value,
            subject: document.getElementById("subject").value,
            hidden: true,
          },
        ],
        contact_id: contact,
        customer_id: customer,
        status: "New",
        start_at: new Date(),
      })
    });
    //Clear form
    document.getElementById("subject").value = "";
    document.getElementById("description").value = "";

    //Show success message
    document.getElementById("success").innerHTML = "Your case has been submitted successfully";
  };

  return (
    <div className="publish page">
      <h2>Create New Support Case</h2>
      <p id="success"></p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="subject">Subject</label>
          <input type="text" className="form-control" id="subject" placeholder="Enter Subject" />
          <label for="description">Description</label>
          <textarea className="form-control" id="description" rows="3"></textarea>
          <button type="submit" className="btn btn-secondary">Submit</button>
          </div>
      </form>
    </div>
  );
}
