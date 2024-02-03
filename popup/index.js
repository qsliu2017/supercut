import { createShortcuts } from "../storage.js";

document.getElementById("save").addEventListener("click", function () {
  const keys = document.getElementById("keys").value.split(" ");
  const url = document.getElementById("url").value;
  const description = document.getElementById("description").value;
  createShortcuts(url, { description }, ...keys);

  document.getElementById("keys").value = "";
  document.getElementById("url").value = "";
  document.getElementById("description").value = "";
});
