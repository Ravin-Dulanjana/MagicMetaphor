const express = require("express");
const router = express.Router();
const client = require("../elasticsearch/client");
const csvtojson = require("csvtojson");

// Define custom analyzer and index settings
const indexSettings = {
  "analysis": {
    "analyzer": {
      "default": {
        "type": "standard"
      },
      "poem_analyzer": {
        "type": "custom",
        "tokenizer": "standard",
        "filter": ["edgeNgram", "stop"]
      },
      "betterFuzzy": {
        "type": "custom",
        "tokenizer": "standard",
        "filter": ["lowercase", "edgeNgram"]
      }
    },
    "filter": {
      "edgeNgram": {
        "type": "edge_ngram",
        "min_gram": 3,
        "max_gram": 50,
        "side": "front"
      },
      "stop": {
        "type": "stop",
        "stopwords": [
          "ගත්කරු",
          "රචකයා",
          "ලියන්නා",
          "ලියන",
          "රචිත",
          "ලියපු",
          "ලියව්ව",
          "රචනා",
          "රචක",
          "ලියන්",
          "ලිවූ",
          "ලියූ",
          "කියූ",
          "ලියවුණු",
          "කියව්ව",
          "කියපු",
          "කියවපු",
          "කළ",
          "වර්ගය",
          "වර්ගයේ",
          "වර්ගයේම",
          "වැනි",
          "නම් වූ",
          "නැමැති",
          "නැමති",
          "නමැති",
          "නමති",
          "කවි",
          "කාව්‍ය",
          "කව",
          "කාව",
          "රූපක",
          "ගැන",
          "පිළිබඳ",
          "පිළිබඳව",
          "කියවෙන"
        ]
      }
    }
  }
};

// Definition of the mapping
const mappings = {
  "properties": {
    "ID": {
      "type": "keyword"
    },
    "PoemName": {
      "type": "text",
      "analyzer": "poem_analyzer",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "PoemLine": {
      "type": "text",
      "analyzer": "poem_analyzer"
    },
    "MetaphorCount": {
      "type": "integer"
    },
    "MetaphoricTerms": {
      "type": "text",
      "analyzer": "poem_analyzer",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "MetaphorType": {
      "type": "keyword"
    },
    "SourceDomain": {
      "type": "text",
      "analyzer": "poem_analyzer",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "TargetDomain": {
      "type": "text",
      "analyzer": "poem_analyzer",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "Interpretation": {
      "type": "text",
      "analyzer": "poem_analyzer",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "Poet": {
      "type": "text",
      "analyzer": "poem_analyzer",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "Year": {
      "type": "text",
      "analyzer": "poem_analyzer",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    }
  }
};

router.get("/process", async function (req, res) {
  console.log("Loading Application...");
  res.json("Running Application...");

  indexData = async () => {
    try {
      console.log("Reading data from the CSV file");

      const records = await csvtojson().fromFile(
        __dirname + "/../../corpus/190179M_DM_Corpus.csv"
      );

      console.log(records);

      console.log("Data reading successful!");

      console.log(
        "Creating the Elasticsearch index with custom analyzers and mappings"
      );
      await client.indices.create({
        index: "finaltest1",
        body: {
          settings: indexSettings,
          mappings: mappings,
        },
      });

      console.log("Indexing data...");

      for (const record of records) {
        await client.index({
          index: "finaltest1",
          body: record,
        });
      }

      console.log("Data has been indexed successfully!");
    } catch (err) {
      console.log(err);
    }
  };
  indexData();
});

module.exports = router;
