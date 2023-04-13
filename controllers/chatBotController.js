import request from "request";
import chatbotServices from "../services/chatbot.js";
import { getDetailsCovidInfoLocation } from "../utils/getInfoCovid.js";
import { getNewInforCountry } from "../utils/getInfoCovidWorld.js";
import { checkVietnameseString } from "../utils/checkVietNameseLanguage.js";
import { templateInfoCovid } from "../utils/template.js";
import { checkDirtyWord } from "../utils/checkDirtyWord.js";

const COVID_ROUTE = process.env.COVID_ROUTE;
const SOCIETY_ROUTE = process.env.SOCIETY_ROUTE;
const SPORT_ROUTE = process.env.SPORT_ROUTE;

const getResult = (link) => {
  return new Promise((resolve, reject) => {
    request(link, async (err, res, body) => {
      if (!err) {
        let response = await JSON.parse(body);
        resolve(response.response);
      } else {
        console.error("Unable to send message:" + err);
        reject(err);
      }
    });
  });
};

const getHomePage = (req, res, next) => {
  res.render("homepage");
};

const getWebhook = (req, res, next) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

const postWebhook = (req, res, next) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
};

// handle received message
const handleMessage = async (sender_psid, received_message) => {
  let messageText = received_message.text?.toLowerCase().replace(/\s+/g, "");
  let response = { text: "" },
    text;

  console.log(
    "------------------------------------------------------------------------------------------------------------------------------------------------------"
  );
  console.log("yourInput--", messageText);
  console.log(
    "------------------------------------------------------------------------------------------------------------------------------------------------------"
  );

  // check dirty word
  const { inValid, dirtyWord } = checkDirtyWord(messageText);
  if (inValid) {
    response = {
      text: `Your chat contains impolite words like "${dirtyWord}" 😒😒, please use the polite word possible 😘`,
    };
    callSendAPI(sender_psid, response);
    return;
  }

  let check = ["1", "2", "3", "getstarted"].includes(messageText);
  if (!check) {
    check = checkVietnameseString(messageText);
    switch (check) {
      case true:
        var { data } = await getDetailsCovidInfoLocation(messageText);
        text = templateInfoCovid(
          data?.name,
          data?.cases,
          data?.death,
          data?.casesToday == 0 ? "updating..." : data?.casesToday,
          undefined,
          data
        );
        break;
      default:
        var data = await getNewInforCountry(messageText);
        text = templateInfoCovid(
          data?.location,
          data?.total,
          data?.deaths,
          data?.newCases == 0 ? "updating..." : data?.newCases,
          data?.recovered,
          data
        );
        break;
    }
  } else if (messageText === "1") {
    response = await getResult(COVID_ROUTE);
  } else if (messageText === "2") {
    response = await getResult(SPORT_ROUTE);
  } else if (messageText === "3") {
    response = await getResult(SOCIETY_ROUTE);
  }
  response.text = text || "";

  callSendAPI(sender_psid, response);
};

const handlePostback = async (sender_psid, received_postback) => {
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case "RESET_BOT":
    case "GET_STARTED":
    case "BACK_TO_MAIN_MENU":
      // await chatbotServices.handleGetStarted(sender_psid);
      await chatbotServices.handleGetNews(sender_psid);
      break;

    default:
      response = { text: "I don't know what to say!" };
      break;
  }
};

// send information back to user
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  console.log("RESPONSE-", request_body);
  let infoRes = {
    uri: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body,
  };

  // Send the HTTP request to the Messenger Platform
  request(infoRes, (err, res, body) => {
    if (!err) {
      console.log("message sent!");
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

const setUpProfile = async (req, res) => {
  // Construct the message body
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: ["https://friendlyy-chatbot.onrender.com/"],
  };
  let infoRes = {
    uri: `https://graph.facebook.com/v13.0/me/messenger_profile?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body,
  };
  // Send the HTTP request to the Messenger Platform
  await request(infoRes, (err, res, body) => {
    if (!err) {
      console.log("Setup profile successed!");
    } else {
      console.error("Unable to setup profile successed:" + err);
    }
  });
  return res.send("Setup profile successed!");
};

const setUpPersistentMenu = async (req, res, next) => {
  console.log("RESPersistentMenu--", req);
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "web_url",
            title: "Contact to Hưng via facebook",
            url: "https://www.facebook.com/leminh.hung.9256/",
          },
          {
            type: "web_url",
            title: "Github Lê Minh Hưng",
            url: "https://github.com/leminhung",
          },
          {
            type: "postback",
            title: "Reset conversation now",
            payload: "RESET_BOT",
          },
          {
            type: "web_url",
            title: "Leave infor so we can contact you",
            url: "https://github.com/leminhung",
            webview_height_ratio: "full",
            messenger_extensions: true,
          },
        ],
      },
    ],
  };
  let infoRes = {
    uri: `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body,
  };

  await request(infoRes, (err, res, body) => {
    if (!err) {
      console.log("Setup persistent menu successfully!");
    } else {
      console.error("Unable to setup persistent menu:" + err);
    }
  });
  return res.send("Setup persistent menu!");
};

let handleAddInfo = (req, res) => {
  const sender_psid = req.params.sender_psid;
  const username = req.params.username;
  return res.render("add-info", {
    sender_psid,
    username,
  });
};

let handlePostAddInfo = async (req, res, next) => {
  try {
    let customerName = "";
    if (req.body.customerName === "") {
      customerName = "Empty";
    } else {
      customerName = req.body.customerName;
    }
    let response1 = {
      text: `----------INFORMATION------------
      \n🔥Name: ${customerName} 
      \n📩Email: ${req.body.email}
      \n📳Phone: ${req.body.phoneNumber}
      `,
    };
    await chatbotServices.callSendAPI(req.body.psid, response1);
  } catch (error) {
    res.status(500).json({ message: "Loi " + error });
  }
};

export default {
  getHomePage,
  getWebhook,
  postWebhook,
  setUpProfile,
  setUpPersistentMenu,
  handleAddInfo,
  handlePostAddInfo,
};
