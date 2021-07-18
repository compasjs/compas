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
    lastUpdated: "Last updated",

    nav: [
      {
        text: "Guide",
        link: "/",
        activeMatch: "^/$|^/setup/|^/features/",
      },
      {
        text: "API reference",
        link: "/api/index.html",
        activeMatch: "^/api/",
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
      "/api/": getApiSidebar(),
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
};

function getHomeSidebar() {
  return [
    {
      text: "Project setup",
      link: "/setup/index.html",
      children: [
        {
          text: "Project setup",
          link: "/setup/project-setup.html",
        },
        {
          text: "CLI and linting",
          link: "/setup/cli-setup.html",
        },
        {
          text: "Writing tests",
          link: "/setup/test-runner.html",
        },
        {
          text: "Services setup",
          link: "/setup/services-setup.html",
        },
        {
          text: "Server setup",
          link: "/setup/server-setup.html",
        },
        {
          text: "Postgres setup",
          link: "/setup/postgres-setup.html",
        },
        {
          text: "Code gen setup",
          link: "/setup/code-gen-setup.html",
        },
        {
          text: "Client side setup",
          link: "/setup/client-side-setup.html",
        },
      ],
    },
    {
      text: "Features",
      link: "/features/index.html",
      children: [
        {
          text: "Logger",
          link: "/features/logger.html",
        },
        {
          text: "Test runner",
          link: "/features/test-runner.html",
        },
        {
          text: "Code generation",
          link: "/features/code-gen.html",
        },
        {
          text: "Code generation with relations",
          link: "/features/code-gen-relations.html",
        },
        {
          text: "Sessions",
          link: "/features/sessions.html",
        },
        {
          text: "File uploads",
          link: "/features/file-uploads.html",
        },
        {
          text: "Background jobs",
          link: "/features/background-jobs.html",
        },
        {
          text: "Migrations",
          link: "/features/migrations.html",
        },
        {
          text: "Environment",
          link: "/features/environment.html",
        },
      ],
    },
  ];
}

function getApiSidebar() {
  return [
    {
      text: "@compas/stdlib",
      link: "/api/stdlib.html",
    },
    {
      text: "@compas/cli",
      link: "/api/cli.html",
    },
    {
      text: "@compas/store",
      link: "/api/store.html",
    },
    {
      text: "@compas/server",
      link: "/api/server.html",
    },
  ];
}

function getReleaseNotesSidebar() {
  return [
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
