const fs = require('fs');
const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

let mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock-data.json'), 'utf8'));

let idCount = mockData.length + 1;

const resolvers = {
    Query: {
        researchTemplatesList: () => mockData,
        researchTemplate: (parent, args) => mockData.find(researchTemplate => researchTemplate.id === args.id)
    },
    Mutation: {
        createResearchTemplate: (parent, args) => {
            const researchTemplate = {
                id: idCount++,
                name: args.name,
                template: args.template
            };

            mockData.push(researchTemplate);

            return researchTemplate;
        },
        deleteResearchTemplate: (parent, args) => {
            const researchTemplate = mockData.find(researchTemplate => researchTemplate.id === args.id);

            mockData = mockData.filter(researchTemplate => researchTemplate.id !== args.id);

            return researchTemplate;
        }
    }
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers
});

const app = express();

app.use('/', express.static('public'));

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`GraphQL server ready at http://localhost:4000${server.graphqlPath}`));
