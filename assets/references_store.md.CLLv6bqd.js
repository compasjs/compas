import{_ as i,c as a,a2 as n,o as h}from"./chunks/framework.Co4PEow0.js";const F=JSON.parse('{"title":"Store","description":"","frontmatter":{},"headers":[],"relativePath":"references/store.md","filePath":"references/store.md"}'),k={name:"references/store.md"};function t(p,s,l,e,E,r){return h(),a("div",null,s[0]||(s[0]=[n(`<h1 id="store" tabindex="-1">Store <a class="header-anchor" href="#store" aria-label="Permalink to &quot;Store&quot;">​</a></h1><p>This is the current migration state of <code>@compas/store</code> and should be used as your first migration:</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> EXTENSION </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">IF</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> NOT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> EXISTS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;uuid-ossp&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> TABLE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">file</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            uuid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">PRIMARY KEY</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> uuid_generate_v4(),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;contentLength&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">              NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;bucketName&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    varchar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;contentType&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   varchar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;name&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          varchar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;meta&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          jsonb            </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;createdAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;updatedAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> INDEX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">fileBucketNameIdx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ON</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;file&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bucketName&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> TABLE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">job</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;id&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">             bigserial</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> PRIMARY KEY</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;isComplete&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     boolean</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;priority&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;retryCount&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;name&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           varchar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;scheduledAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;data&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           jsonb                 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;handlerTimeout&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;createdAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;updatedAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> INDEX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">jobIsCompleteScheduledAtIdx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ON</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;job&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;isComplete&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;scheduledAt&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> INDEX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">jobNameIdx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ON</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;job&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> INDEX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">jobScheduledAtIdx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ON</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;job&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;scheduledAt&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> INDEX</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> IF</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> NOT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> EXISTS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;jobIsCompleteUpdatedAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ON</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;job&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;isComplete&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;updatedAt&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">WHERE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;isComplete&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> IS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> TRUE;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> TABLE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sessionStore</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        uuid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">PRIMARY KEY</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> uuid_generate_v4(),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;checksum&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  varchar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;data&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      jsonb            </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;revokedAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;createdAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;updatedAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> TABLE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sessionStoreToken</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           uuid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">PRIMARY KEY</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> NOT NULL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> DEFAULT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> uuid_generate_v4(),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;session&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      uuid             </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;expiresAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;refreshToken&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> uuid             </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;revokedAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;createdAt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    timestamptz</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  CONSTRAINT</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;sessionStoreTokenSessionFk&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> FOREIGN KEY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;session&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">REFERENCES</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;sessionStore&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ON DELETE CASCADE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  CONSTRAINT</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;sessionStoreTokenRefreshTokenFk&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> FOREIGN KEY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;refreshToken&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">REFERENCES</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;sessionStoreToken&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ON DELETE CASCADE</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> INDEX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sessionStoreTokenSessionIdx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ON</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;sessionStoreToken&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;session&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> INDEX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sessionStoreTokenRefreshTokenIdx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&quot; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ON</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;sessionStoreToken&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;refreshToken&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div>`,3)]))}const g=i(k,[["render",t]]);export{F as __pageData,g as default};