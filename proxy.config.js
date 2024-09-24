const proxy = [
  {
    context: "/api",
    target: "http://15.228.13.33",
    pathRewrite: { "^/api": "" },
  },
];

module.exports = proxy;
