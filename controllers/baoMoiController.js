import Covid from "../models/Covid.js";
import Society from "../models/Society.js";
import Sport from "../models/Sport.js";
import { template } from "../utils/template.js";

const handleGetCovidInfo = async (req, res, next) => {
  let data = await Covid.find({}).sort({ createdAt: -1 }).limit(6);
  if (!data.length) {
    return next(new Error("Khong co du lieu Covid"));
  }
  data.reverse();
  let response = template(data);
  res.status(200).json({ response });
};

const handleGetSocietyInfo = async (req, res, next) => {
  let data = await Society.find({}).sort({ createdAt: -1 }).limit(6);
  if (!data.length) {
    return next(new Error("Khong co du lieu Society"));
  }
  data.reverse();
  let response = template(data);
  res.status(200).json({ response });
};

const handleGetSportInfo = async (req, res, next) => {
  let data = await Sport.find({}).sort({ createdAt: -1 }).limit(6);
  if (!data.length) {
    return next(new Error("Khong co du lieu Sport"));
  }
  data.reverse();
  let response = template(data);
  res.status(200).json({ response });
};

export default {
  handleGetCovidInfo,
  handleGetSocietyInfo,
  handleGetSportInfo,
};
