import { readdirSync } from "fs";

export default {
  lang: "en-US",
  title: "Compas",
  description: "Unified backend tooling",
  head: [
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/favicon/apple-touch-icon.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon/favicon-16x16.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon/favicon-32x32.png",
      },
    ],
    ["link", { rel: "shortcut icon", href: "/favicon/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#3EAF7C" }],
  ],
  lastUpdated: true,

  themeConfig: {
    logo: "/compas-icon.svg",
    siteTitle: "Compas",

    editLink: {
      pattern: "https://github.com/compasjs/compas/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    nav: [
      {
        text: "Docs",
        link: "/generators/introduction.html",
        activeMatch: "/generators|features|references/",
      },
      {
        text: "Examples",
        link: "/examples.html",
        activeMatch: "/example/",
      },
      {
        text: "Changelog",
        link: "/changelog",
      },
      {
        text: "Release notes",
        link: "/releases/index.html",
        activeMatch: "/releases/",
      },
    ],

    sidebar: {
      "/releases/": getReleaseNotesSidebar(),
      "/": getHomeSidebar(),
    },

    outline: [2, 5],
    outlineBadges: true,

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/compasjs/compas",
      },
    ],

    footer: {
      message:
        'Released under the <a href="https://github.com/compasjs/compas/blob/main/LICENSE">MIT License</a>.',
      copyright:
        'Copyright © 2019-present <a href="https://github.com/dirkdev98">Dirk de Visser</a>',
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
      text: "Generators",
      items: [
        {
          text: "Introduction",
          link: "/generators/introduction.html",
        },
        {
          text: "Targets",
          link: "/generators/targets.html",
        },
        {
          text: "Generating from an structure",
          link: "/generators/importing-structure.html",
        },
        {
          text: "Build a custom structure",
          items: [
            {
              text: "Types and validators",
              link: "/generators/build-structure/types-and-validators.html",
            },
            {
              text: "Routes",
              link: "/generators/build-structure/routes.html",
            },
            {
              text: "Entities",
              link: "/generators/build-structure/entities.html",
            },
            {
              text: "Generating CRUD routes",
              link: "/generators/build-structure/crud.html",
            },
          ],
        },
        {
          text: "Using the generated code",
          items: [
            {
              text: "Koa router",
              link: "/generators/usage/koa-router.html",
            },
            {
              text: "Axios API client",
              link: "/generators/usage/axios-api-client.html",
            },
          ],
        },
      ],
    },

    {
      text: "Features",
      items: [
        {
          text: "Getting started",
          link: "/features/getting-started.html",
        },

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
          text: "Postgres and S3",
          link: "/features/postgres-and-s3.html",
        },
        {
          text: "Code generation",
          link: "/features/code-gen-validators.html",
        },
        {
          text: "Code generation API",
          link: "/features/code-gen-api.html",
        },
        {
          text: "Code generation API client",
          link: "/features/code-gen-api-client.html",
        },
        {
          text: "Code generation SQL queries",
          link: "/features/code-gen-sql.html",
        },
        {
          text: "Code generation CRUD",
          link: "/features/code-gen-crud.html",
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

    getExamplesSidebar(),

    {
      text: "References",
      items: [
        {
          text: "Compas configuration",
          link: "/references/compas-config.html",
        },
        {
          text: "CLI Reference",
          link: "/references/cli.html",
        },
        {
          text: "@compas/store migrations",
          link: "/references/store.html",
        },
      ],
    },
  ];
}

function getExamplesSidebar() {
  const files = readdirSync("./docs/examples");

  return {
    text: "Examples",
    items: [
      {
        text: "Introduction",
        link: "/examples.html",
      },
      ...files.map((it) => ({
        text: it.slice(0, 1).toUpperCase() + it.slice(0, -3).replace("-", " "),
        link: `/examples/${it.replace(".md", ".html")}`,
      })),
    ],
  };
}

function getReleaseNotesSidebar() {
  return [
    {
      text: "Migrating to the new code-gen",
      link: "/releases/code-gen-migration.html",
    },
    { text: "Release v0.0.212", link: "/releases/0.0.212.html" },
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
