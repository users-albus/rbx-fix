import { authenticatedUser } from "header-scripts";
import React, { useState, useEffect } from "react";
import navigationService from "../services/navigationService";
import SponsoredEvents from "../components/SponsoredEvents";

function SponsoredEventsContainer(props) {
  const { isAuthenticated } = authenticatedUser;
  const [sponsoredPagesData, setSponsoredPagesData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigationService.getSponsoredPages().then(
        (result) => {
          const events = result?.data ?? [];
          const filteredEvents = events.filter((event) => {
            return (
              !event?.name?.includes("giftcards") &&
              !event?.title?.includes("giftcards")
            );
          });
          setSponsoredPagesData(filteredEvents);
        },
        (error) => {
          console.debug(error);
        }
      );
    }
  }, [isAuthenticated]);

  return <SponsoredEvents {...{ sponsoredPagesData, ...props }} />;
}

export default SponsoredEventsContainer;
