const express = require("express");
const client = require("./elasticsearch/client");
const cors = require("cors");

const app = express();

const port = 3001;

const data = require("./data_management/retrieve_and_ingest_data");

app.use("/ingest_data", data);

app.use(cors());

app.get("/results", (req, res) => {
  const passed = req.query.para;

  async function sendESRequest() {
    const body = await client.search({
      index: "finaltest1",
      body: {
        size: 100,
        query: {
          bool: {
            should: [
              {
                match: { Poet: { query: passed } },
              },
              {
                match: { PoemLine: { query: passed } },
              },
              {
                match: { MetaphoricTerm: { query: passed } },
              },
              {
                match: { MetaphorType: { query: passed } },
              },
              {
                match: { SourceDomain: { query: passed } },
              },
              {
                match: { TargetDomain: { query: passed } },
              },
              {
                match: { Interpretation: { query: passed } },
              },
              {
                match: { PoemName: { query: passed } },
              },
              {
                match: { Year: { query: passed } },
              },
            ],
          },
        },
        sort: [
          {
            MetaphorCount: {
              order: "desc",
            },
          },
        ],
        aggs: {
          "PoemName": {
            terms: {
              field: "PoemName.keyword",
            },
          },
        }
      },
    });
    res.json({
      hits: body.hits.hits,
      aggregations: body.aggregations,
    });
  }
  sendESRequest();
});

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
