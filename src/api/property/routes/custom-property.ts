export default {
  routes: [
    {
      method: "GET",
      path: "/properties/order-sub-code/:subCodeId",
      handler: "property.findOrderBySubCode",
    },
  ],
};
