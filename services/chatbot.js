import request from "request";

// Sends response messages via the Send API
const callSendAPI = async (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
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
};

// latest news
let handleGetNews = (sender_psid) => {
  let response = {
    text: `Hey bro ๐, let look up ๐ the latest infor the global Covid 19 (menu ๐)
      \n๐ท Update about the epidemic in Vietnam (press 1) ๐ฅ 
      \nโฝ Update sports - life infor in Vietnam (press 2) ๐ฅ
      \n๐ Update social news - cinema in Vietnam (press 3) ๐ฅ
      \n๐ป๐ณ Infor Covid 19 in Vietnam ๐พ (Hร  Nแปi,...)
      \n๐ Infor Covid 19 in your country ๐ฑ (VietNam, Usa,...)
      \n๐ Chit chat ๐ฌ with real people (about me โ)
    `,
  };
  return new Promise(async (resolve, reject) => {
    try {
      await callSendAPI(sender_psid, response);
      resolve("done!");
    } catch (error) {
      console.log("[err--]", error);
      reject(error);
    }
  });
};
export default {
  callSendAPI,
  handleGetNews,
};
