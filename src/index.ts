import express from "express";

const libraryApp = express();

const PORT = 3000;

libraryApp.listen(PORT, () => {
  console.log(`Library app running on port! ${PORT}`);
});
