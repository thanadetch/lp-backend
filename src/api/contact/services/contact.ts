/**
 * contact service
 */

import {factories} from "@strapi/strapi";
import {env} from "@strapi/utils";

export default factories.createCoreService("api::contact.contact", ({strapi}) => ({
  async sendContact(contact) {
    const res = await strapi.entityService.create("api::contact.contact", {
      data: {
        ...contact,
        publishedAt: new Date(),
      },
      populate: ["property"]
    });
    const contactConfig = await strapi.service("api::contact-config.contact-config").find();
    if (contactConfig?.isSendEmail && contactConfig?.receivedEmail) {
      const emailTemplate = {
        subject: 'Client contact you | <%= contact.property.propertyCode %> - <%= contact.property.name %>',
        html: (`
            <h1>There is client contact you.</h1>
            <p>Name: <%= contact.name %></p>
            <p>Email: <%= contact.email %></p>
            <p>Phone: <%= contact.phoneNo %></p>
            <p>Line: <%= contact.lineId %></p>
            <p>Property Code: <%= contact.property.propertyCode %></p>
            <p>Listing Type: <%= contact.listingType %></p>
            <br />
            <p>This is automated email do not reply.</p>
        `),
        text: "",
      };

      await strapi.plugins["email"].services.email.sendTemplatedEmail(
        {
          from: env("SENDGRID_EMAIL_FROM"),
          to: contactConfig?.receivedEmail,
        },
        emailTemplate,
        {
          contact: res
        });
    }
    return res;
  }
}));
