/**
 * property controller
 */

import {factories} from "@strapi/strapi";
import {PaginatedResult} from "@strapi/types/dist/modules/entity-service";

export default factories.createCoreController("api::property.property", ({strapi}) => ({
  async findOrderBySubCode(ctx) {
    const res = await strapi.service("api::property.property").findOrderBySubCode(ctx.request.params, ctx.query);
    const sanitizedEntity = await this.sanitizeOutput(res, ctx) as PaginatedResult<"api::property.property">;
    return this.transformResponse(sanitizedEntity?.results, {pagination: sanitizedEntity?.pagination});
  }
}));
