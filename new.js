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


async function getAccountBuildInfo(token) {
  try {
    const response = await axios.get(
      "https://api.yescoin.gold/build/getAccountBuildInfo",
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://www.yescoin.gold",
          Priority: "u=1, i",
          Referer: "https://www.yescoin.gold/",
          "Sec-Ch-Ua": '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24", "Microsoft Edge WebView2";v="125"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          Token: token,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function levelUp(token, skill) {
  try {
    const response = await axios.post(
      "https://api.yescoin.gold/build/levelUp",
      skill,
      {
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\", \"Microsoft Edge WebView2\";v=\"125\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "token": token,
          "Referer": "https://www.yescoin.gold/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


async function recoverCoinPool(token) {
  try {
    const response = await axios.post(
      "https://api.yescoin.gold/game/recoverCoinPool",
      null,
      {
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\", \"Microsoft Edge WebView2\";v=\"125\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "token": token,
          "Referer": "https://www.yescoin.gold/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function optionMenu(token) {
  try {
    const { currentAmount } = await getAccountInfo(token).then((response) => response.data);
    const { coinPoolLeftRecoveryCount, singleCoinLevel, singleCoinUpgradeCost, coinPoolRecoveryLevel, coinPoolRecoveryUpgradeCost, coinPoolTotalLevel, coinPoolTotalUpgradeCost } = await getAccountBuildInfo(token).then((response) => response.data);
    if (singleCoinLevel <= 3 && currentAmount > singleCoinUpgradeCost) {
      await levelUp(token, 1).then((response) => response.data);
    } else if (coinPoolRecoveryLevel <= 10 && currentAmount > coinPoolRecoveryUpgradeCost) {
      await levelUp(token, 2).then((response) => response.data);
    } else if (coinPoolTotalLevel <= 10 && currentAmount > coinPoolTotalUpgradeCost) {
      await levelUp(token, 3).then((response) => response.data);
    }

    if (coinPoolLeftRecoveryCount > 0) {
      await recoverCoinPool(token);
    }
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
            const { coinPoolLeftRecoveryCount, singleCoinLevel, coinPoolRecoveryLevel, coinPoolTotalLevel } = await getAccountBuildInfo(token).then((response) => response.data);

            twisters.put(token, {
              text: `userId : ${userId} | userLevel : ${userLevel} | rank : ${rank} | CoinLvl : ${singleCoinLevel} | RecoveryLvl : ${coinPoolRecoveryLevel} | PoolTotalLvl : ${coinPoolTotalLevel} | Recovery : ${coinPoolLeftRecoveryCount} | currentAmount : ${currentAmount}`,
            });
          } while (status !== "left coin not enough");
          await optionMenu(token);
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
