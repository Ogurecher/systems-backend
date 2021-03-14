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
        researchTemplateList:  createGetQuery('researchTemplate'),
        researchTemplate:      createGetByIdQuery('researchTemplate'),
        researchList:          createGetQuery('research'),
        research:              createGetByIdQuery('research'),
        studentList:           createGetQuery('student'),
        student:               createGetByIdQuery('student'),
        researchSuggestions:   async (parent, args, context) => {
            return context.prisma.researchSuggestions.findMany({
                where: {
                    researchId: args.researchId
                }
            });
        },
        researchSuggestionsList: createGetQuery('researchSuggestions'),
        researchResultsList:    async (parent, args, context) => {
            const researchList = await context.prisma.research.findMany();

            const results = [];

            for (research of researchList) {
                const template = await context.prisma.researchTemplate.findUnique({
                    where: {
                        id: research.templateId
                    }
                });

                const answers = await context.prisma.researchSuggestions.findMany({
                    where: {
                        researchId: research.id
                    }
                });

                const result = {
                    researchTitle:     research.title,
                    templateName:      template.name,
                    dateOpened:        research.dateOpened,
                    dateClosed:        research.dateClosed,
                    completedResearch: answers.filter(item => item.answer !== null).length,
                    totalResearch:     answers.length,
                    status:            research.status
                };

                results.push(result);
            }

            return results;
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
        deleteResearchTemplate: createDeleteMutation('researchTemplate'),
        createResearch: async (parent, args, context) => {
            const research = await context.prisma.research.create({
                data: {
                    title: args.title,
                    description: args.description,
                    templateId: args.templateId,
                    dateOpened: Date.now(),
                    answers: {
                        create: args.performers.map(id => {
                            return { studentId: id }
                        })
                    }
                },
            });

            const researchSuggestions = await context.prisma.researchSuggestions.findMany({
                where: {
                    researchId: research.id
                }
            });

            research.performers = researchSuggestions.map(researchAnswer => researchAnswer.studentId);

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
        deleteStudent: createDeleteMutation('student'),
        addAnswer: async (parent, args, context) => {
            const answer = await context.prisma.researchSuggestions.update({
                where: {
                    studentId_researchId: {
                        researchId: args.researchId,
                        studentId: args.studentId
                    }
                },
                data: {
                    answer: args.answer
                }
            });

            let allAnswers = await context.prisma.researchSuggestions.findMany({
                where: {
                    researchId: args.researchId
                }
            });
            
            allAnswers = allAnswers.map(item => item.answer);

            const submittedAnswers = allAnswers.filter(answer => answer !== null);

            if (allAnswers.length === submittedAnswers.length) {
                await context.prisma.research.update({
                    where: {
                        id: args.researchId
                    },
                    data: {
                        status: "Завершено",
                        dateClosed: Date.now()
                    }
                });
            }

            return answer;
        }
    },
    Research: {
        answers: (parent, args, context) => {
            return context.prisma.research.findUnique({ where: { id: parent.id } }).answers();
        },
        performers: async (parent, args, context) => {
            const answers =  await context.prisma.research.findUnique({ where: { id: parent.id } }).answers();

            return answers.map(answer => answer.studentId);
        },
        template: (parent, args, context) => {
            return context.prisma.research.findUnique({ where: { id: parent.id } }).template();
        },
    },
    Student: {
        answers: (parent, args, context) => {
            return context.prisma.student.findUnique({ where: { id: parent.id } }).answers();
        }
    },
    ResearchSuggestions: {
        student: (parent, args, context) => {
            return context.prisma.researchSuggestions.findUnique({
                where: {
                    studentId_researchId: {
                        researchId: parent.researchId,
                        studentId: parent.studentId
                    }
                }
            }).student();
        },
        research: (parent, args, context) => {
            return context.prisma.researchSuggestions.findUnique({
                where: {
                    studentId_researchId: {
                        researchId: parent.researchId,
                        studentId: parent.studentId
                    }
                }
            }).research();
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
