const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Read the data from db.json
let jsonData = [];

fs.readFile("db2.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading from file:", err);
  } else {
    jsonData = JSON.parse(data);
  }
});

// Function to save the data to the db.json file
function saveDataToFile() {
  fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    }
  });
}

// Define the route to create a new entry
app.post("/api/data", (req, res) => {
  const newData = req.body;
  jsonData.push(newData);
  saveDataToFile();
  res.json(newData);
});

// Define the route to get all entries
app.get("/api/data", (req, res) => {
  res.json(jsonData);
});

// Define the route to get a specific entry by ID
app.get("/api/data/:id", (req, res) => {
  const id = req.params.id;
  const entry = jsonData.find((item) => item.id === id);
  if (entry) {
    res.json(entry);
  } else {
    res.status(404).json({ error: "Entry not found" });
  }
});

// Define the route to update an entry
app.put("/api/data/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const index = jsonData.findIndex((item) => item.id === id);
  if (index !== -1) {
    jsonData[index] = { ...jsonData[index], ...updatedData };
    saveDataToFile();
    res.json(jsonData[index]);
  } else {
    res.status(404).json({ error: "Entry not found" });
  }
});

// Define the route to delete an entry
app.delete("/api/data/:id", (req, res) => {
  const id = req.params.id;
  const index = jsonData.findIndex((item) => item.id === id);
  if (index !== -1) {
    const deletedEntry = jsonData.splice(index, 1);
    saveDataToFile();
    res.json(deletedEntry);
  } else {
    res.status(404).json({ error: "Entry not found" });
  }
});

// Define custom endpoints for specific data
app.get("/api/reach/total", (req, res) => {
  const totalReach = jsonData.reduce(
    (acc, entry) => acc + entry.reach.total,
    0
  );
  res.json({ totalReach });
});

app.get("/api/engagement/likes", (req, res) => {
  const totalLikes = jsonData.reduce(
    (acc, entry) => acc + entry.engagement.likes,
    0
  );
  res.json({ totalLikes });
});

app.get("/api/audience/age/:ageGroup", (req, res) => {
  const ageGroup = req.params.ageGroup;
  const filteredData = jsonData.filter((entry) => entry.audience.age[ageGroup]);
  res.json(filteredData);
});

// Custom CRUD operations for individual endpoints
app.post("/api/reach/total", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

app.put("/api/reach/total", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

app.delete("/api/reach/total", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

app.post("/api/engagement/likes", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

app.put("/api/engagement/likes", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

app.delete("/api/engagement/likes", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

app.post("/api/audience/age/:ageGroup", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

app.put("/api/audience/age/:ageGroup", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

app.delete("/api/audience/age/:ageGroup", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
