import express from "express";
import chatBotController from "../controllers/chatBotController.js";
import baoMoiController from "../controllers/baoMoiController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  // get homepage
  router.get("/", chatBotController.getHomePage);

  // set up get started
  router.post("/setup-profile", chatBotController.setUpProfile);

  // set up persistent menu
  router.post("/setup-persistent", chatBotController.setUpPersistentMenu);

  // set up webhook
  router.get("/webhook", chatBotController.getWebhook);
  router.post("/webhook", chatBotController.postWebhook);

  // add info(GET, POST)
  router.get(
    "/add-info/:sender_psid/:username",
    chatBotController.handleAddInfo
  );
  router.post("/add-info", chatBotController.handlePostAddInfo);

  router.get("/api/v1/covid", baoMoiController.handleGetCovidInfo);
  router.get("/api/v1/society", baoMoiController.handleGetSocietyInfo);
  router.get("/api/v1/sport", baoMoiController.handleGetSportInfo);

  return app.use("/", router);
};

export default initWebRoutes;
