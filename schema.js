const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLString, 
    GraphQLInt 
} = require('graphql');
const axios = require('axios');
const md5 = require('md5');

const CharactersInfo = new GraphQLObjectType({
    name: 'characters',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        thumbnail: { type: CharacterThumbnail }
    })
})

const CharacterThumbnail = new GraphQLObjectType({
    name: 'characterthumbnail',
    fields: () => ({
        path: { type: GraphQLString },
        extension: { type: GraphQLString }
    })
})

const ThumbnailPath = new GraphQLObjectType({
    name: 'thumbnailPath',
    fields: () => ({
        img: { type: GraphQLString },
    })
})

let date = Date.now();
let hash = md5(`${date}783118be80cb2e11218c8e853c0eb7762a590ca484c5e1a66da9e1c3ff93d7782ffff98e`);
let authorization = `ts=${date}&apikey=84c5e1a66da9e1c3ff93d7782ffff98e&hash=${hash}`;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        characters: {
            type: new GraphQLList(CharactersInfo),
            resolve(parent, args) {
                return axios.get(`https://gateway.marvel.com:443/v1/public/characters?${authorization}`)
                    .then(res => res.data.data.results);
            }
        },
        character: {
            type: new GraphQLList(CharactersInfo),
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return axios.get(`https://gateway.marvel.com:443/v1/public/characters/${args.id}?${authorization}`)
                    .then(res => res.data.data.results);
            }
        },
        character_pagination: {
            type: new GraphQLList(CharactersInfo),
            args: {
                startswith: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${args.startswith}&limit=100&${authorization}`)
                    .then(res => res.data.data.results);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})