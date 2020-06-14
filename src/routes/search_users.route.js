const Joi = require('@hapi/joi');
const handler = require('./handlers/search_users_route.handler');

module.exports = {
    method: 'GET',
    path: '/search/users',
    handler: async (request, h) => {
        try{
            return await handler(request);
        } catch(e) {
            console.error('Error in /search/users handler', e);
            return h.error('An Error has occured.');
        }
        
    },
    options: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
        auth: false,
        validate: {
            query: Joi.object({
                searchTerm: Joi.string().required(),
                page: Joi.number().default(1),
                pageSize: Joi.number().default(25)
            })
        }
    }
};