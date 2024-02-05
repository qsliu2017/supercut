import { LOCAL_STORAGE_KEY, Shortcuts } from "./types";

let shortcuts = {} as Shortcuts;

chrome.storage.local.get(LOCAL_STORAGE_KEY, (data) => {
  shortcuts = data[LOCAL_STORAGE_KEY] || {
    ["blog"]: { url: "https://blog.qsliu.dev", description: "qsliu's blog" },
    ["g"]: { url: "https://github.com", description: "GitHub" },
    ["gh"]: { url: "https://github.com", description: "GitHub" },
    ["github"]: { url: "https://github.com", description: "GitHub" },
  };
});

chrome.storage.local.onChanged.addListener((changes) => {
  if (!changes[LOCAL_STORAGE_KEY]) return;
  const { newValue, oldValue } = changes[LOCAL_STORAGE_KEY];
  console.debug({ newValue, oldValue });
  shortcuts = newValue;
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  if (shortcuts[text]) {
    chrome.omnibox.setDefaultSuggestion({
      description: `<url><match>${text}</match></url> - ${shortcuts[text].description}`,
    });
  } else {
    chrome.omnibox.setDefaultSuggestion({
      description: `Supercut`,
    });
  }

  suggest(
    Object.entries(shortcuts)
      .filter(([key]) => key.startsWith(text))
      .map(([key, { description }]) => ({
        content: key,
        description: `<url><match>${text}</match>${key.slice(
          text.length
        )}</url> - ${description}`,
        deletable: true,
      }))
  );
});

chrome.omnibox.onInputEntered.addListener((text) => {
  if (shortcuts[text]) chrome.tabs.create({ url: shortcuts[text].url });
});

chrome.action.onClicked.addListener(() =>
  chrome.tabs.create({ url: "/index.html" })
);
