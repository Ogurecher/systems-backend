const fs = require('fs');
const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');

const resolvers = {
    Query: {
        researchTemplatesList: async (parent, args, context) => {
            return context.prisma.researchTemplate.findMany();
        },
        researchTemplate: async (parent, args, context) => {
            return context.prisma.researchTemplate.findUnique({
                where: {
                    id: args.id
                }
            });
        }
    },
    Mutation: {
        createResearchTemplate: (parent, args, context) => {
            const researchTemplate = context.prisma.researchTemplate.create({
                data: {
                    name: args.name,
                    template: args.template
                },
            })

            return researchTemplate;
        },
        deleteResearchTemplate: (parent, args, context) => {
            const researchTemplate = context.prisma.researchTemplate.delete({
                where: {
                    id: args.id
                }
            });

            return researchTemplate;
        }
    }
};

const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers,
    context: {
        prisma
    }
});

const app = express();

app.use('/', express.static('public'));

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`GraphQL server ready at http://localhost:4000${server.graphqlPath}`));
