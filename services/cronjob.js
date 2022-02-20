import { CronJob } from "cron";
import Covid from "../models/Covid.js";
import Society from "../models/Society.js";
import Sport from "../models/Sport.js";
import CommonModel from "../utils/commonModel.js";

const COVID_LINK = "https://dantri.com.vn/suc-khoe/dai-dich-covid-19.htm";
const SOCIETY_LINK = "https://dantri.com.vn/xa-hoi.htm";
const SPORT_LINK = "https://dantri.com.vn/the-thao.htm";

const covidCron = new CronJob("0 */3 * * * *", () => {
  CommonModel(Covid, COVID_LINK);
});

const societyCron = new CronJob("0 */3 * * * *", () => {
  CommonModel(Society, SOCIETY_LINK);
});

const sportCron = new CronJob("0 */3 * * * *", () => {
  CommonModel(Sport, SPORT_LINK);
});

export default {
  start: () => {
    covidCron.start(), societyCron.start(), sportCron.start();
  },
  startNow: () => {
    CommonModel(Covid, COVID_LINK);
    CommonModel(Society, SOCIETY_LINK);
    CommonModel(Sport, SPORT_LINK);
  },
};
