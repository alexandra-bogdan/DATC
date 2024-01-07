const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cityCoordinates = require("./cityCoordinates.json");
const port = 3031;

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  port: 3032,
  database: "datc_schema",
  insecureAuth: true,
});

connection.connect((error) => {
  if (error) {
    console.log("Error connecting to the MySQL Database", error);
    return;
  }
  console.log("Connection established successfully");
});

app.use(express.static(path.join(__dirname, "public")));

// Define a single route for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Middleware to parse JSON
app.use(bodyParser.json());

// Handle POST request for form data
app.post("/api/postData", (req, res) => {
  const { text, date, area } = req.body;

  // Generate a unique idfacts using uuid
  const { latitude, longitude } = cityCoordinates[area];
  //console.log(idfacts);
  const insertQuery = `INSERT INTO facts SET ?`;

  const values = {
    text,
    date,
    area,
    latitude,
    longitude,
  };

  connection.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error("Error inserting into database:", error);
      res.status(500).json({ error: "Error inserting into database" });
    } else {
      console.log("Inserted successfully into database");
      //res.status(200).json({ success: true });
    }
  });

  try {
    const query = "SELECT longitude, latitude FROM facts WHERE area = ?";

    connection.query(query, [area], (err, results) => {
      if (err) {
        console.error("Error fetching coordinates from the database: ", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Extract long and lat from the results
      const coordinates = results.map((result) => ({
        longitude: result.longitude,
        latitude: result.latitude,
      }));
      //console.log("Coordonatele obținute:", coordinates);

      // Return the response
      res.json({ coordinates });
    });
  } catch (error) {
    console.error("Error in /api/getCoordinates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/getFacts", (req, res) => {
  const query = "SELECT * FROM facts";

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ query: query, error: err.message });
      return;
    }

    res.json(results);
  });
});

// Ruta pentru obținerea coordonatelor
app.get("/api/getCoordinates", (req, res) => {
  try {
    const query = "SELECT longitude, latitude FROM facts";
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching coordinates from the database: ", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Extract long and lat from the results
      const coordinates = results.map((result) => ({
        longitude: result.longitude,
        latitude: result.latitude,
      }));
      console.log("Coordonatele obținute:", coordinates);
      // Return the response
      res.json({ coordinates });
    });
  } catch (error) {
    console.error("Error in /api/getCoordinates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/*app.get("/api/getCoordinates", (req, res) => {
  try {
    const query = "SELECT long, lat FROM facts";

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching coordinates from the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Extract long and lat from the results
      const coordinates = results.map((result) => ({
        long: result.long,
        lat: result.lat,
      }));

      // Return the response
      res.json({ coordinates });
    });
  } catch (error) {
    console.error("Error in /api/getCoordinates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
*/
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
