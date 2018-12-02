const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList
} = graphql;

const api_key = process.env.API_KEY;
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(api_key);

const SourceType = new GraphQLObjectType({
  name: "Source",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    url: { type: GraphQLString },
    category: { type: GraphQLString },
    language: { type: GraphQLString },
    country: { type: GraphQLString }
  })
});

const ArticleType = new GraphQLObjectType({
  name: "Article",
  fields: () => ({
    source: { type: SourceType },
    author: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    url: { type: GraphQLString },
    urlToImage: { type: GraphQLString },
    publishedAt: { type: GraphQLString },
    content: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    sources: {
      type: new GraphQLList(SourceType),
      resolve(parent, args) {
        return newsapi.v2
          .sources({
            language: "en"
          })
          .then(response => response.sources);
      }
    },
    topHeadlines: {
      type: new GraphQLList(ArticleType),
      resolve(parent, args) {
        return newsapi.v2
          .topHeadlines({
            language: "en"
          })
          .then(response => response.articles);
      }
    },
    getNews: {
      type: new GraphQLList(ArticleType),
      args: {
        q: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return newsapi.v2
          .everything({
            q: args.q,
            language: "en",
            sortBy: "relevancy"
          })
          .then(response => response.articles);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
