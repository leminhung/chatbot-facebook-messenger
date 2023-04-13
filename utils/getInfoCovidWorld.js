import fetch from "node-fetch";

let options = {
  method: "GET",
};

const getNewInforCountry = async (country) => {
  console.log("country--", country);
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
    return {
      location: country,
      newCases: "updating...",
      total: 503302,
      recovered: 379053,
      deaths: 5272,
    };

    // console.log("[err-+-]", error);
  }
};

export { getNewInforCountry };
