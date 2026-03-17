import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";


export default function useJournal() {
  const [journalItems, setJournalItems] = useState([]);
  const [tags, setTags] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getJournalFromApi() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/journals`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const journals = await data.json();
      setJournalItems(journals);
    }

    async function getTags() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/tags`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tags = await data.json();

      setTags(tags);
    }

    if (accessToken) {
      getJournalFromApi();
      getTags();
    }
  }, [accessToken, journalItems.length, tags.length]);

  return [journalItems, setJournalItems, tags, setTags];
}