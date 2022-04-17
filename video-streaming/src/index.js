const express = require("express");
const http = require("http");
const mongodb = require("mongodb");

const app = express();
const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;

const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_HOST);
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

function main() {
  return mongodb.MongoClient.connect(DBHOST).then((client) => {
    const db = client.db(DBNAME);
    const videosCollection = db.collection("videos");

    app.get("/video", (req, res) => {
      const videoId = new mongodb.ObjectId(req.query.id);
      videosCollection
        .findOne({ _id: videoId })
        .then((videoRecord) => {
          if (!videoRecord) {
            res.sendStatus(404);
            return;
          }
          console.log("working here!");
          const forwardRequest = http.request(
            {
              host: VIDEO_STORAGE_HOST,
              port: VIDEO_STORAGE_PORT,
              path: `/video?path=${videoRecord.videoPath}`,
              method: "GET",
              headers: req.headers,
            },
            (forwardResponse) => {
              res.writeHeader(
                forwardResponse.statusCode,
                forwardResponse.headers
              );
              forwardResponse.pipe(res);
            }
          );
          req.pipe(forwardRequest);
        })
        .catch((err) => {
          console.log("Database query failed.");
          console.log((err && err.stack) || err);
          res.sendStatus(500);
        });
    });

    app.listen(PORT, () => {
      console.log(`Microservice online.`);
    });
  });
}

main()
  .then(() => console.log("Microservice online."))
  .catch((err) => {
    console.log("Microservice failed to start");
    console.log((err && err.stack) || err);
  });
