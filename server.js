const express = require("express");
const graphQLHTTP = require("express-graphql");
const schema = require("./schema");

const app = express();

app.use(
  "/graphql",
  graphQLHTTP({
    schema,
    graphiql: true
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
