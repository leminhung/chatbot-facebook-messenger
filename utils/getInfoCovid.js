import fetch from "node-fetch";
const getNew = async () => {
  try {
    const data = await fetch(process.env.URL_COVID_INFOR, {
      method: "GET",
    });
    let info = await data.json();
    return {
      locations: info.locations,
      internal: info.total.internal,
      world: info.total.world,
      today: {
        internal: info.today.internal,
        world: info.today.world,
      },
    };
  } catch (error) {
    console.log("[err--]", error);
  }
};

const getDetailsCovidInfoLocation = async (location) => {
  if (location === "thanhhoá") {
    location = "thanhhóa";
  }
  try {
    let newData = await getNew();
    let locations = newData.locations || [];
    let data = locations.find(
      (l) => location.indexOf(l.name.toLowerCase().replace(/\s+/g, "")) !== -1
    );

    return {
      data,
    };
  } catch (error) {
    console.log("[err--]", error);
  }
};

export { getDetailsCovidInfoLocation };
