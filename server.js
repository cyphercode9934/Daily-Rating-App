require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Google Auth Setup
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.post("/update-rating", async (req, res) => {
  try {
    const { month, day, rating } = req.body;

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1eJ_J5jCAizy3ck4gn9ssuIFSmrN7sLsFlT4_zPOBEaA";

    if (!row) {
      return res.status(400).json({ error: "Invalid month provided" });
    }

    // Example range (you will adjust this later)
    const monthMap = {
        January: 2,
        February: 3,
        March: 4,
        April: 5,
        May: 6,
        June: 7,
        July: 8,
        August: 9,
        September: 10,
        October: 11,
        November: 12,
        December: 13,
    };

    function getColumnLetter(day) {
        const baseCharCode = "B".charCodeAt(0);
        return String.fromCharCode(baseCharCode + day - 1);
    }

    const row = monthMap[month];
    const column = getColumnLetter(day);
    const range = `Sheet1!${column}${row}`;

    console.log(`Updating cell: ${range} with value ${rating}`);
    console.log("Month:", month);
    console.log("Day:", day);
    console.log("Row:", row);
    console.log("Column:", column);
    console.log("Range:", range);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[rating]],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update rating" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
