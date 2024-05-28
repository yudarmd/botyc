const axios = require("axios");
const readline = require("readline-sync");
const fs = require("fs");
const path = require("path");
const { Twisters } = require("twisters");

const tokenFilePath = path.join(__dirname, "token.json");
const tokenTxtPath = path.join(__dirname, "addToken.txt");

function loadTokens() {
  if (fs.existsSync(tokenFilePath)) {
    try {
      const tokenData = fs.readFileSync(tokenFilePath);
      const parsedData = JSON.parse(tokenData);
      return parsedData.tokens || [];
    } catch (error) {
      console.error("Error parsing token file:", error);
      return [];
    }
  } else {
    console.log("Token file not found. Creating a new one...");
    saveTokens([]);
    return [];
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(tokenFilePath, JSON.stringify({ tokens }, null, 2));
}

function addTokensFromFile() {
  if (!fs.existsSync(tokenTxtPath)) {
    console.log("token.txt file not found!");
    return;
  }
  const tokenData = fs.readFileSync(tokenTxtPath, "utf8");
  const newTokens = tokenData
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((token) => token.trim());
  const tokens = loadTokens();
  const uniqueTokens = Array.from(new Set([...tokens, ...newTokens]));
  saveTokens(uniqueTokens);
  console.log("Tokens from token.txt added successfully!");
}

function deleteAllTokens() {
  fs.writeFileSync(tokenFilePath, JSON.stringify({ tokens: [] }, null, 2));
  console.log("All tokens deleted successfully!");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectCoin(token) {
  try {
    const response = await axios.post(
      "https://api.yescoin.gold/game/collectCoin",
      9,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          "Content-Length": "1",
          "Content-Type": "application/json",
          Origin: "https://www.yescoin.gold",
          Pragma: "no-cache",
          Referer: "https://www.yescoin.gold/",
          "Sec-Ch-Ua":
            '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99", "Microsoft Edge WebView2";v="124"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          Token: token,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
        },
      }
    );

    return response.data.message;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getAccountInfo(token) {
  try {
    const response = await axios.get(
      "https://api.yescoin.gold/account/getAccountInfo",
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://www.yescoin.gold",
          Priority: "u=1, i",
          Referer: "https://www.yescoin.gold/",
          "Sec-Ch-Ua":
            '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99", "Microsoft Edge WebView2";v="124"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          Token: token,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

(async () => {
  console.log("1. Add Token");
  console.log("2. Delete All Tokens");
  console.log("3. Run Bot");
  const choice = readline.question("Choose an option: ");
  const tokens = loadTokens();

  const twisters = new Twisters();

  if (choice === "1") {
    addTokensFromFile();
  } else if (choice === "2") {
    deleteAllTokens();
  } else if (choice === "3") {
    if (tokens.length === 0) {
      console.log("No tokens available. Please add a token first.");
      return;
    }

    while (true) {
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        let status = null;
        try {
          do {
            const message = await collectCoin(token).then((response) => response);
            status = message;
            const {
              data: { userId, userLevel, rank, currentAmount },
            } = await getAccountInfo(token).then((response) => response);

            // console.log(status)

            twisters.put(token, {
              text: `userId : ${userId} | userLevel : ${userLevel} | rank : ${rank} | currentAmount : ${currentAmount}`,
            });
          } while (status !== "left coin not enough");
        } catch (error) {
          console.log(`Error collecting coin for token ${token}:`, error);
        }
      }
      await delay(60000);
    }
  } else {
    console.log("Invalid choice. Please try again.");
  }
})();
