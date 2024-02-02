const shortcuts = {
  ["blog"]: { url: "https://blog.qsliu.dev", description: "My Blog" },
  ["tool"]: { url: "https://tool.qsliu.dev", description: "My Tool" },
  ["g"]: { url: "https://github.com", description: "GitHub" },
  ["linux"]: {
    url: "https://elixir.bootlin.com/linux/latest/source",
    description: "Linux Kernel Source",
  },
};

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  const suggestions = Object.keys(shortcuts)
    .filter((sc) => sc.startsWith(text))
    .map((sc) => ({
      content: sc,
      description: `<url><match>${text}</match>${sc.substring(text.length)}</url> ${shortcuts[sc].description}`,
      deletable: true,
    }));

  if (shortcuts[text]) {
    chrome.omnibox.setDefaultSuggestion({
      description: shortcuts[text].description,
    });
  } else {
    chrome.omnibox.setDefaultSuggestion({
      description: "Shortcuts",
    });
  }

  suggest(suggestions);
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
