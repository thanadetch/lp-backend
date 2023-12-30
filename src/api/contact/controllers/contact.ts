/**
 * contact controller
 */

import {factories} from "@strapi/strapi";

export default factories.createCoreController("api::contact.contact", ({strapi}) => ({
  async sendContact(ctx) {
    const contact = ctx.request.body;
    const res = await strapi.service("api::contact.contact").sendContact(contact);
    return this.sanitizeOutput(res, ctx);
  }
}));
