import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
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

  const createShortcutRef = useRef<HTMLInputElement>(null);
  const createUrlRef = useRef<HTMLInputElement>(null);
  const createDescriptionRef = useRef<HTMLInputElement>(null);
  const clearCreateShortcut = () => {
    createShortcutRef.current && (createShortcutRef.current.value = "");
    createUrlRef.current && (createUrlRef.current.value = "");
    createDescriptionRef.current && (createDescriptionRef.current.value = "");
  };
  const createShortcut = () => {
    if (
      !createShortcutRef.current ||
      !createUrlRef.current ||
      !createDescriptionRef.current
    )
      return;
    const shortcut = createShortcutRef.current.value;
    const url = createUrlRef.current.value;
    const description = createDescriptionRef.current.value;
    if (!shortcut || !url) return;
    chrome.storage.local.set({
      [LOCAL_STORAGE_KEY]: { ...shortcuts, [shortcut]: { url, description } },
    });
    clearCreateShortcut();
  };

  const deleteShortcut = (shortcut: string) => {
    const { [shortcut]: _, ...rest } = shortcuts;
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY]: rest });
  };

  return (
    <main className="tw-grid tw-grid-cols-4 tw-grid-flow-row tw-gap-5 tw-p-5">
      <Card className="tw-row-span-2 tw-flex tw-flex-col tw-justify-between">
        <CardHeader>
          <CardTitle>
            <h1>Supercut</h1>
          </CardTitle>
          <CardDescription>Add a new shortcut</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="tw-grid tw-items-center tw-gap-2">
              <Label htmlFor="shortcut">Shortcut</Label>
              <Input id="shortcut" type="text" ref={createShortcutRef} />
              <Label htmlFor="url">URL</Label>
              <Input id="url" type="text" ref={createUrlRef} />
              <Label htmlFor="description">Description</Label>
              <Input id="description" type="text" ref={createDescriptionRef} />
            </div>
          </form>
        </CardContent>
        <CardFooter className="tw-flex tw-justify-between">
          <Button variant="outline" onClick={clearCreateShortcut}>
            Clear
          </Button>
          <Button onClick={createShortcut}>Create</Button>
        </CardFooter>
      </Card>
      {Object.entries(shortcuts).map(([shortcut, { url, description }]) => (
        <Card key={shortcut}>
          <CardHeader>
            <CardTitle>
              <pre>
                <code>{shortcut}</code>
              </pre>
            </CardTitle>
            <CardDescription>
              {description || "<No Description>"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{url}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteShortcut(shortcut)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </main>
  );
}
