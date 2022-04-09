module.exports = {
  lang: "en-US",
  title: "Compas",
  description: "Unified backend tooling",

  themeConfig: {
    repo: "compasjs/compas",
    docsDir: "docs",
    docsBranch: "main",

    editLinks: true,
    editLinkText: "Edit this page on GitHub",

    nav: [
      {
        text: "Docs",
        link: "/getting-started.html",
        activeMatch: "/getting-started|^/features/|^/migrations/|^/references/",
      },
      {
        text: "Changelog",
        link: "/changelog",
      },
      {
        text: "Release notes",
        link: "/releases/index.html",
        activeMatch: "^/releases/",
      },
    ],

    sidebar: {
      "/releases/": getReleaseNotesSidebar(),
      "/": getHomeSidebar(),
    },
  },

  markdown: {
    anchor: {},
    toc: {
      includeLevel: [1, 2, 3],
    },
  },

  vite: {
    envDir: process.cwd() + "/docs",
  },
};

function getHomeSidebar() {
  return [
    {
      text: "Getting started",
      link: "/getting-started.html",
    },
    {
      text: "Features",
      children: [
        {
          text: "CLI",
          link: "/features/cli.html",
        },
        {
          text: "Linting and formatting",
          link: "/features/lint-setup.html",
        },
        {
          text: "Typescript setup",
          link: "/features/typescript-setup.html",
        },
        {
          text: "Logger & events",
          link: "/features/logger-and-events.html",
        },
        {
          text: "Configuration files",
          link: "/features/config-files.html",
        },
        {
          text: "Testing and benchmarking",
          link: "/features/test-and-bench-runner.html",
        },
        {
          text: "HTTP server",
          link: "/features/http-server.html",
        },
        {
          text: "Postgres and Minio",
          link: "/features/postgres-and-minio.html",
        },
        {
          text: "Code generation",
          link: "/features/code-gen-validators.html",
        },
        {
          text: "Code generation HTTP api",
          link: "/features/code-gen-api.html",
        },
        {
          text: "Code generation api client",
          link: "/features/code-gen-api-client.html",
        },
        {
          text: "Code generation SQL queries",
          link: "/features/code-gen-sql.html",
        },
        {
          text: "Postgres migrations",
          link: "/features/migrations.html",
        },
        {
          text: "Background jobs",
          link: "/features/background-jobs.html",
        },
        {
          text: "Session handling",
          link: "/features/session-handling.html",
        },
        {
          text: "File handling",
          link: "/features/file-handling.html",
        },
        {
          text: "Extending the CLI",
          link: "/features/extending-the-cli.html",
        },
        {
          text: "Route invalidations",
          link: "/features/route-invalidations.html",
        },
      ],
    },

    {
      text: "Examples",
      link: "/examples.html",
    },

    {
      text: "References",
      children: [
        {
          text: "Compas configuration",
          link: "/references/compas-config.html",
        },
        {
          text: "CLI Reference",
          link: "/references/cli.html",
        },
      ],
    },

    {
      text: "Migrations",
      link: "/migrations/index.html",
      children: [
        {
          text: "@compas/store",
          link: "/migrations/store.html",
        },
      ],
    },
  ];
}

function getReleaseNotesSidebar() {
  return [
    { text: "Release v0.0.180", link: "/releases/0.0.180.html" },
    { text: "Release v0.0.172", link: "/releases/0.0.172.html" },
    { text: "Release v0.0.171", link: "/releases/0.0.171.html" },
    { text: "Release v0.0.158", link: "/releases/0.0.158.html" },
    { text: "Release v0.0.138", link: "/releases/0.0.138.html" },
    { text: "Release v0.0.124", link: "/releases/0.0.124.html" },
    { text: "Release v0.0.119", link: "/releases/0.0.119.html" },
    { text: "Release v0.0.115", link: "/releases/0.0.115.html" },
    { text: "Release v0.0.103", link: "/releases/0.0.103.html" },
    { text: "Release v0.0.89", link: "/releases/0.0.89.html" },
    { text: "Release v0.0.84", link: "/releases/0.0.84.html" },
    { text: "Release v0.0.83", link: "/releases/0.0.83.html" },
    { text: "Release v0.0.81", link: "/releases/0.0.81.html" },
    { text: "Release v0.0.79", link: "/releases/0.0.79.html" },
  ];
}
