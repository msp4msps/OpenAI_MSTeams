import React, { useState } from "react";
import { Image, Menu } from "@fluentui/react-northstar";
import "./Welcome.css";
import { Tickets } from "./Tickets";
import { CreateTicket } from "./CreateTicket";
import { Chat } from "./Chat";

export function Welcome() {

  const steps = ["question", "tickets", "newTicket"];
  const friendlyStepsName = {
    question: "1. Ask A Question",
    tickets: "2. View Open Tickets",
    newTicket: "3. Create Ticket",
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState("question");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => setSelectedMenuItem(step),
    };
  });

  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        <Image src="logo.png" />
        <h1 className="center">Support Hub</h1>
        <Menu defaultActiveIndex={0} items={items} underlined secondary />
        <div className="sections">
          {selectedMenuItem === "question" && (
            <div>
              <Chat />
            </div>
          )}
          {selectedMenuItem === "tickets" && (
            <div>
              <Tickets />
            </div>
          )}
          {selectedMenuItem === "newTicket" && (
            <div>
              <CreateTicket />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
