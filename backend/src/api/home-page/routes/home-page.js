'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::home-page.home-page', {
  config: {
    find: {
      auth: false,
    },
  },
});
