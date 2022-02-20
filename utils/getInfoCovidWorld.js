import fetch from "node-fetch";

let options = {
  method: "GET",
};

const getNewInforCountry = async (country) => {
  try {
    const data = await fetch(
      `${process.env.URL_COVID_INFOR_WORLD}${country}`,
      options
    );
    let info = await data.json();
    return {
      location: info["country"],
      newCases: info["todayCases"],
      total: info["cases"],
      recovered: info["recovered"],
      deaths: info["deaths"],
    };
  } catch (error) {
    console.log("[err-+-]", error);
  }
};

export { getNewInforCountry };
