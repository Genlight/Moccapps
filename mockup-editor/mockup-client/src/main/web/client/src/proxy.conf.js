const PROXY_CONFIG = [
  {
      context: [
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
          "/logout"
      ],
      target: "http://localhost:8090",
      secure: false,
      ws: true
  }
]

module.exports = PROXY_CONFIG;