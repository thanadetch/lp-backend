/**
 * property service
 */

import {factories} from "@strapi/strapi";
import _ from "lodash";

export default factories.createCoreService("api::property.property", ({strapi}) => ({

  async findOrderBySubCode(params, query) {
    const {subCodeId} = params;
    const {filters, pagination: {page, pageSize}} = query;

    const subCodeFilters = _.cloneDeep(filters);
    subCodeFilters["$and"].push({
      subCode: {
        codeId: {
          $eq: subCodeId
        },
      }
    });

    const subCodeProperties = await strapi.entityService.findPage("api::property.property", {
      ...query,
      filters: subCodeFilters,
      page: page,
      pageSize: pageSize,
    });

    const propertiesFilters = _.cloneDeep(filters);
    propertiesFilters["$and"].push({
      subCode: {
        codeId: {
          $ne: subCodeId
        }
      }
    });


    const lastLeftCount = subCodeProperties.pagination.total % pageSize;
    let start = (pageSize - lastLeftCount) + ((page - subCodeProperties.pagination.pageCount - 1) * pageSize);
    start = start < 0 ? 0 : start;
    const limit = pageSize - subCodeProperties.results.length;

    // exclude subCode
    const propertyCount = await strapi.entityService.count("api::property.property", {
      ...query,
      filters: propertiesFilters,
    });
    const properties = await strapi.entityService.findMany("api::property.property", {
      ...query,
      filters: propertiesFilters,
      start: start,
      limit: limit,
    });

    return {
      results: [...subCodeProperties.results, ...properties],
      pagination: {
        ...subCodeProperties.pagination,
        total: subCodeProperties.pagination.total + propertyCount,
        pageCount: subCodeProperties.pagination.pageCount + Math.ceil(propertyCount / pageSize),
      }
    };
  },
}));
