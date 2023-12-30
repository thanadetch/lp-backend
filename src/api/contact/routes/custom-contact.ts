export default {
  routes: [
    {
      method: "POST",
      path: "/contacts/send-contact",
      handler: "contact.sendContact",
    },
  ],
};
