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

const STORAGE_KEY = "scshortcuts";

chrome.storage.local.get(STORAGE_KEY).then((data) => {
  const storedShortcuts = data[STORAGE_KEY];
  console.debug({ data, storedShortcuts });
  shortcuts = { ...shortcuts, ...storedShortcuts };
});

chrome.storage.local.onChanged.addListener((changes) => {
  const storedChanges = changes[STORAGE_KEY];
  if (!storedChanges) return;
  console.debug({ storedChanges });
  shortcuts = storedChanges.newValue;
});

export function matchedShortcuts(prefix) {
  return Object.entries(shortcuts).filter(([key]) => key.startsWith(prefix));
}

export function exactShortcut(key) {
  return shortcuts[key];
}

/**
 * @param {string} url
 * @param {{description: string}} opts
 * @param  {...string} keys
 */
export function createShortcuts(url, { description }, ...keys) {
  const newShortcuts = keys.reduce(
    (acc, key) => ({ ...acc, [key]: { url, description } }),
    {}
  );

  chrome.storage.local.set({
    [STORAGE_KEY]: { ...shortcuts, ...newShortcuts },
  });
}
