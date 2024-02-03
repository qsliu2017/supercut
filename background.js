/**@type {Object<string, {url: string, description: string}>}*/
let shortcuts = {
  ["blog"]: { url: "https://blog.qsliu.dev", description: "qsliu's Blog" },
  ["tool"]: { url: "https://tool.qsliu.dev", description: "qsliu's Tool" },
  ["g"]: { url: "https://github.com", description: "GitHub" },
  ["linux"]: {
    url: "https://elixir.bootlin.com/linux/latest/source",
    description: "Linux Kernel Source",
  },
};

chrome.storage.local.get("shortcuts").then((data) => {
  console.debug("shortcuts loaded", data);
  shortcuts = { ...shortcuts, ...data };
});

chrome.storage.local.onChanged.addListener((changes) => {
  if (!changes["shortcuts"]) return;
  console.debug("shortcuts changed", changes["shortcuts"].newValue, shortcuts);
  shortcuts = changes["shortcuts"].newValue;
});

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  if (shortcuts[text]) {
    chrome.omnibox.setDefaultSuggestion({
      description: `<url><match>${text}</match></url> ${shortcuts[text].description}`,
    });
  } else {
    chrome.omnibox.setDefaultSuggestion({
      description: "Shortcuts",
    });
  }

  suggest(
    Object.entries(shortcuts)
      .filter(([key]) => key.startsWith(text))
      .map(([key, { description }]) => ({
        content: key,
        description: `<url><match>${text}</match>${key.substring(
          text.length
        )}</url> ${description}`,
        deletable: true,
      }))
  );
});

chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
  if (!shortcuts[text]) return; // TODO: maybe create shortcut?

  const url = shortcuts[text].url;

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
