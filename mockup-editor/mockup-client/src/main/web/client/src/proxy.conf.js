const PROXY_CONFIG = [
  {
      context: [
          "/",
          "/connect",
          "/login",
          "/register",
          "/page",
          "/pages",
          "/project",
          "/projects",
          "/users",
          "/user",
          "/invite",
          "/invites",
          "/elements",
          "/logout"
      ],
      target: "http://localhost:8090",
      secure: false,
      ws: true
  }
]

module.exports = PROXY_CONFIG;