import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY, Shortcuts } from "./types";

export default function App() {
  const [shortcuts, setShortcuts] = useState<Shortcuts>({});
  useEffect(
    () =>
      chrome.storage.local.get(LOCAL_STORAGE_KEY, (data) => {
        if (!data[LOCAL_STORAGE_KEY]) return;
        setShortcuts(data[LOCAL_STORAGE_KEY]);
      }),
    []
  );
  useEffect(() => {
    const syncShortcuts = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (!changes[LOCAL_STORAGE_KEY]) return;
      setShortcuts(changes[LOCAL_STORAGE_KEY].newValue);
    };
    chrome.storage.local.onChanged.addListener(syncShortcuts);
    return () => chrome.storage.local.onChanged.removeListener(syncShortcuts);
  }, [setShortcuts]);

  return (
    <main>
      <ul>
        {Object.entries(shortcuts).map(([shortcut, { url, description }]) => (
          <li key={shortcut}>
            <p>{shortcut}</p>
            <p>{url}</p>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
