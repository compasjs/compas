import{_ as s,c as a,o as e,a3 as n}from"./chunks/framework.DebO_3PL.js";const g=JSON.parse('{"title":"Compas examples","description":"","frontmatter":{},"headers":[],"relativePath":"examples.md","filePath":"examples.md"}'),p={name:"examples.md"},t=n(`<h1 id="compas-examples" tabindex="-1">Compas examples <a class="header-anchor" href="#compas-examples" aria-label="Permalink to &quot;Compas examples&quot;">​</a></h1><p>Examples of how to do various tasks with Compas. These examples can be used via with <code>create-compas</code> to quickly start a new project.</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Via NPM</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npx</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> create-compas@latest</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Or with Yarn</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> create</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> compas</span></span></code></pre></div><h2 id="templates" tabindex="-1">Templates <a class="header-anchor" href="#templates" aria-label="Permalink to &quot;Templates&quot;">​</a></h2><p>Any Compas provided template can be used via <code>npx create-compas@latest --template [template-name]</code></p><ul><li><p><strong><a href="https://github.com/compasjs/compas/tree/main/examples/default" target="_blank" rel="noreferrer">default</a>:</strong> This is the default template that is used. It contains boilerplate and conventions to create your api&#39;s.</p></li><li><p><strong><a href="https://github.com/compasjs/compas/tree/main/examples/with-auth" target="_blank" rel="noreferrer">with-auth</a>:</strong> Based on the default teplate, adds a basic register and loginc system, using <code>@compas/store</code> powered sessions.</p></li></ul><h2 id="synopsis" tabindex="-1">Synopsis <a class="header-anchor" href="#synopsis" aria-label="Permalink to &quot;Synopsis&quot;">​</a></h2><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>Usage: create-compas</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Initialize Compas projects based on Compas examples or a custom repository.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Examples:</span></span>
<span class="line"><span>- yarn create compas</span></span>
<span class="line"><span>- npx create-compas@latest</span></span>
<span class="line"><span>- npx create-compas@latest --template with-auth</span></span>
<span class="line"><span>- npx create-compas@latest --template github:user/repo --output-directory ./my-project</span></span>
<span class="line"><span>- npx create-compas@latest --template github:user/repo --template-path ./path/to/scaffold --template-ref v1.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>References:</span></span>
<span class="line"><span>- Docs: https://compasjs.com</span></span>
<span class="line"><span>- Provided templates: https://github.com/compasjs/compas/tree/main/examples</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Supported templates:</span></span>
<span class="line"><span>- Examples from the Compas repository, for example &#39;default&#39;.</span></span>
<span class="line"><span>- Your own templates via their Git repository. Currently, only &#39;github:user/repo&#39; is supported.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Note that for templates from the Compas repository, the default value for &#39;--template-ref&#39;</span></span>
<span class="line"><span>is based on the &#39;create-compas&#39; version that you are using. To use the latest example version,</span></span>
<span class="line"><span>specify &#39;--template-ref main&#39;.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Flags:</span></span>
<span class="line"><span>  --help              Display information about the current command. (boolean)</span></span>
<span class="line"><span>  --template          Specify Compas example or custom repository. (string)</span></span>
<span class="line"><span>  --template-path     Use a subdirectory from the provided template repository. (string)</span></span>
<span class="line"><span>  --template-ref      Use a specific branch, tag or commit. (string)</span></span>
<span class="line"><span>  --output-directory  Use the provided directory instead of the current directory. (string)</span></span></code></pre></div>`,8),l=[t];function i(o,r,c,m,h,d){return e(),a("div",null,l)}const f=s(p,[["render",i]]);export{g as __pageData,f as default};
