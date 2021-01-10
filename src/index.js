const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');

const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock-data.json'), 'utf8'));

const resolvers = {
    Query: {
        tasks: () => mockData,
        task: (parent, args) => mockData.find(task => task.id === args.id)
    }
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers
});

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );