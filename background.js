import { matchedShortcuts, exactShortcut } from "./storage.js";

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  const shortcut = exactShortcut(text);
  chrome.omnibox.setDefaultSuggestion({
    description: shortcut
      ? `<url><match>${text}</match></url> ${shortcut.description}`
      : "Shortcuts",
  });

  suggest(
    matchedShortcuts(text).map(([key, { description }]) => ({
      content: key,
      description: `<url><match>${text}</match>${key.substring(
        text.length
      )}</url> ${description}`,
      deletable: true,
    }))
  );
});

chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
  const shortcut = exactShortcut(text);
  if (!shortcut) return; // TODO: maybe create shortcut?

  const url = shortcut.url;
  switch (disposition) {
    case "currentTab":
      chrome.tabs.update({ url });
      break;
    case "newForegroundTab":
      chrome.tabs.create({ url });
      break;
    case "newBackgroundTab":
      chrome.tabs.create({ url, active: false });
      break;
  }
});
