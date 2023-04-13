import * as cheerio from "cheerio";
import request from "request";
const DAN_TRI_LINK = "https://dantri.com.vn/";
const common = (model, link) => {
  request(link, async (err, res, body) => {
    if (!err) {
      let $ = cheerio.load(body);
      let titles = $(".article-title");

      let links = $(".article-thumb > a");

      let imgs = $(".article-thumb > a > img");

      try {
        await model.deleteMany({});

        for (let i = 0; i < 6; i++) {
          let imgUrl;

          if (i >= 4) imgUrl = imgs[i]?.attribs["data-src"];
          else imgUrl = imgs[i]?.attribs?.src;

          await model.create({
            title: $(titles[i]).text().trim(),
            link: DAN_TRI_LINK + links[i]?.attribs?.href,
            imageUrl: imgUrl,
          });
        }
      } catch (error) {
        console.log("[error--]", error);
      }
    } else {
      console.log(err);
    }
  });
};

export default common;
