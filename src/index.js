const fs = require('fs');
const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

let mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock-data.json'), 'utf8'));

let idCount = mockData.length + 1;

const resolvers = {
    Query: {
        tasks: () => mockData,
        task: (parent, args) => mockData.find(task => task.id === args.id)
    },
    Mutation: {
        createTask: (parent, args) => {
            const task = {
                id: `${idCount++}`,
                title: args.title,
                description: args.description,
                maxNumRepeats: args.maxNumRepeats,
                taskType: args.taskType,
                questions: args.questions
            };

            mockData.push(task);

            return task;
        },
        deleteTask: (parent, args) => {
            const task = mockData.find(task => task.id === args.id);

            mockData = mockData.filter(task => task.id !== args.id);

            return task;
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
