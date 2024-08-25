import express from 'express';
import {ApolloServer} from '@apollo/server';
import cors from 'cors'
import {expressMiddleware} from '@apollo/server/express4';
import bodyParser from 'body-parser';
import { prismaClient } from '../clients/db';
import {User} from "./user";
import { GraphqlContext } from '../interface';
import JWTService from '../services/jwt';


export async function initServer(){
    const app = express();
    app.use(cors());

    app.use(bodyParser.json());

    // prismaClient.user.create. {

    // }

    const graphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs:`
            ${User.types}
            type Query {
               ${User.queries}
            }
        `,
        resolvers:{
            Query: {
                ...User.resolvers.queries,
            },
        },
    });


    await graphqlServer.start();

    app.use('/graphql',expressMiddleware(graphqlServer, {
        context:async({req, res}) =>{
        return {
                user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split("Bearer ")[1]) : undefined,
            }
        }
    }));

    return app;

}