const fs = require('fs');
const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');

const createGetQuery = (entityName) => {
    return async (parent, args, context) => {
        return context.prisma[entityName].findMany();
    }
};

const createGetByIdQuery = (entityName) => {
    return async (parent, args, context) => {
        return context.prisma[entityName].findUnique({
            where: {
                id: args.id
            }
        });
    }
};

const createDeleteMutation = (entityName) => {
    return (parent, args, context) => {
        const entity = context.prisma[entityName].delete({
            where: {
                id: args.id
            }
        });

        return entity;
    }
};

const resolvers = {
    Query: {
        researchTemplatesList: createGetQuery('researchTemplate'),
        researchTemplate:      createGetByIdQuery('researchTemplate'),
        researchList:          createGetQuery('research'),
        research:              createGetByIdQuery('research'),
        studentList:           createGetQuery('student'),
        student:               createGetByIdQuery('student')
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
        deleteResearchTemplate: createDeleteMutation('researchTemplate'),
        createResearch: (parent, args, context) => {
            const research = context.prisma.research.create({
                data: {
                    title: args.title,
                    description: args.description,
                    templateId: args.templateId
                },
            })

            return research;
        },
        deleteResearch: createDeleteMutation('research'),
        createStudent: (parent, args, context) => {
            const student = context.prisma.student.create({
                data: {
                    name: args.name
                },
            })

            return student;
        },
        deleteStudent: createDeleteMutation('student')
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
