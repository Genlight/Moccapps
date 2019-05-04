const PROXY_CONFIG = [
  {
      context: [
          "/login",
          "/project",
          "/projects",
          "/users",
          "/user",
          "/invite",
          "/invites",
      ],
      target: "http://localhost:8090",
      secure: false
  }
]

module.exports = PROXY_CONFIG;