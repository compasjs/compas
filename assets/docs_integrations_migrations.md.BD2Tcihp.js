import{_ as a,c as t,a2 as s,o as e}from"./chunks/framework.Co4PEow0.js";const g=JSON.parse('{"title":"Migrations integration","description":"","frontmatter":{},"headers":[],"relativePath":"docs/integrations/migrations.md","filePath":"docs/integrations/migrations.md"}'),n={name:"docs/integrations/migrations.md"};function o(r,i,l,h,d,c){return e(),t("div",null,i[0]||(i[0]=[s(`<h1 id="migrations-integration" tabindex="-1">Migrations integration <a class="header-anchor" href="#migrations-integration" aria-label="Permalink to &quot;Migrations integration&quot;">​</a></h1><p>Combining the <a href="/docs/integrations/docker.html">Docker integration</a> and the <a href="/features/migrations.html">migrations features</a> from <code>@compas/store</code>, Compas can prompt you to migrate you Postgres database when necessary.</p><h2 id="getting-started" tabindex="-1">Getting started <a class="header-anchor" href="#getting-started" aria-label="Permalink to &quot;Getting started&quot;">​</a></h2><p>Enabling this integration can be done by running:</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">compas</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> init</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> migrations</span></span></code></pre></div><p>This executes a few things:</p><ul><li>It creates a migration directory, if not exists.</li><li>Adds <code>@compas/store</code> as a dependency to your project.</li><li>Adds the following contents to your config in <code>config/compas.json</code>:</li></ul><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	&quot;migrations&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="config" tabindex="-1">Config <a class="header-anchor" href="#config" aria-label="Permalink to &quot;Config&quot;">​</a></h2><p>There is nothing to configure for this setup. Compas automatically prompts to either migrate or rebuild the database.</p><ul><li>Migrate executes the pending migrations.</li><li>Rebuild clears the full database and runs all migrations from scratch.</li></ul><h2 id="limitations" tabindex="-1">Limitations <a class="header-anchor" href="#limitations" aria-label="Permalink to &quot;Limitations&quot;">​</a></h2><ul><li>Compas assumes that you have Postgres running.</li><li>Compas only supports this feature when the <a href="/features/migrations.html">migrations are used from <code>@compas/store</code></a>.</li></ul>`,13)]))}const m=a(n,[["render",o]]);export{g as __pageData,m as default};