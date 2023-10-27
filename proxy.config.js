const proxy = [
  /* {
    context: "/api",
    target: "http://localhost:8080",
    pathRewrite: { "^/api": "" },
  }, */
  {
    context: "/api",
    target: "http://localhost:3000",
    pathRewrite: { "^/api": "" },
  },
];

module.exports = proxy;