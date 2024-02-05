chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  suggest([
    {
      content: "https://www.google.com/search?q=" + text,
      description: "Search for " + text,
    },
  ]);
});

chrome.action.onClicked.addListener(() => {
  // create a new tab
  chrome.tabs.create({ url: "/index.html" });
});
