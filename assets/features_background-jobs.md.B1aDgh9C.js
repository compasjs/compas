import{_ as o,c as t,a2 as a,o as r}from"./chunks/framework.Co4PEow0.js";const p=JSON.parse('{"title":"Background jobs","description":"","frontmatter":{},"headers":[],"relativePath":"features/background-jobs.md","filePath":"features/background-jobs.md"}'),i={name:"features/background-jobs.md"};function s(n,e,l,u,d,c){return r(),t("div",null,e[0]||(e[0]=[a('<h1 id="background-jobs" tabindex="-1">Background jobs <a class="header-anchor" href="#background-jobs" aria-label="Permalink to &quot;Background jobs&quot;">​</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Requires <code>@compas/store</code> to be installed</p></div><p>The queue system is based on &#39;static&#39; units of work to be done in the background. It supports the following:</p><ul><li>Job priority&#39;s. Lower value means higher priority.</li><li>Scheduling jobs at a set time</li><li>Customizable handler timeouts</li><li>Recurring job handling</li><li>Concurrent workers pulling from the same queue</li><li>Specific workers for a specific job</li></ul><p>When to use which function of adding a job:</p><ul><li><code>queueWorkerAddJob</code>: use the queue as background processing of defined units. Like converting a file to different formats, sending async or scheduled notifications. Jobs created will have a priority of &#39;5&#39;.</li><li><code>queueWorkerRegisterCronJobs</code>: use the queue for scheduled recurring jobs based on the specific <code>cronExpression</code>. Jos created will have a default priority of &#39;4&#39;.</li></ul><p>Every job runs with a timeout. This timeout is enforced with an <code>AbortSignal</code> on the <code>event</code> argument passed to your handler and automatically checked with calls like <code>eventStart</code> and <code>newEventFromEvent</code>. It is determined in the following order:</p><ul><li>Timeout of the specific job, via <code>handlerTimeout</code> property. Should be used sporadically</li><li>Timeout of a specific handler as provided by the <code>handler</code> property.</li><li>The <code>handlerTimeout</code> property of the QueueWorker</li></ul><p>Jobs are picked up if the following criteria are met:</p><ul><li>The job is not complete yet</li><li>The job&#39;s &#39;scheduledAt&#39; property is in the past</li><li>The job&#39;s &#39;retryCount&#39; value is lower than the <code>maxRetryCount</code> option.</li></ul><p>Eligible jobs are sorted in the following order:</p><ul><li>By priority ascending, so a lower priority value job will run first</li><li>By scheduledAt ascending, so an earlier scheduled job will be picked before a later scheduled job.</li></ul><p>If a job fails, by throwing an error, other jobs may run first before any retries happen, based on the above ordering.</p><h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><p>Provided by <code>@compas/store</code>. A summary of the available functionality. See the docs on these functions for more information and their accepted arguments.</p><h3 id="queueworkercreate" tabindex="-1">queueWorkerCreate <a class="header-anchor" href="#queueworkercreate" aria-label="Permalink to &quot;queueWorkerCreate&quot;">​</a></h3><p>This function constructs a worker, applies the default options if no value is provided and returns a <code>{ start, stop }</code> synchronously. <code>start</code> needs to be called before any jobs are picked up. If you need to shut down gracefully you can use <code>await stop()</code>. This will finish all running jobs and prevent picking up new jobs. See the <code>QueueWorkerOptions</code> as the second argument of this function for all available options and their defaults.</p><p>Some specific options include:</p><ul><li><code>includeNames</code> / <code>excludeNames</code>: let this queue worker only pick up specific jobs. This allows you to scale queue workers independently.</li><li><code>deleteJobOnCompletion</code>: by default, the queue keeps history of the processed jobs. For high-volume queues, it is generally considered more efficient to delete jobs on completion. If you want to keep a history of jobs for a few days, you can use <code>false</code> and instead use <a href="#jobqueuecleanup"><code>jobQueueCleanup</code></a>.</li><li><code>unsafeIngoreSorting</code>: Ignore priority and scheduled based sorting. This is useful in combination with <code>includeNames</code> to create a higher throughput queue, with no guarantees of the order in which jobs are picked up.</li></ul><h3 id="queueworkeraddjob" tabindex="-1">queueWorkerAddJob <a class="header-anchor" href="#queueworkeraddjob" aria-label="Permalink to &quot;queueWorkerAddJob&quot;">​</a></h3><p>Add a new job to the queue. The <code>name</code> option is mandatory. This function returns the <code>id</code> of the inserted job.</p><h3 id="queueworkerregistercronjobs" tabindex="-1">queueWorkerRegisterCronJobs <a class="header-anchor" href="#queueworkerregistercronjobs" aria-label="Permalink to &quot;queueWorkerRegisterCronJobs&quot;">​</a></h3><p>Register cron jobs to the queue. Any existing cron job not in this definition will be removed from the queue, even if pending jobs exist. When the cron expression of a job is changed, it takes effect immediately. The system won&#39;t ever upgrade an existing normal job to a cron job. Note that your job may not be executed on time. Use <code>job.data.cronLastCompletedAt</code> and <code>job.data.cronExpression</code> to decide if you still need to execute your logic. The provided <code>cronExpression</code> is evaluated in &#39;utc&#39; mode.</p><p><a href="https://www.npmjs.com/package/cron-parser" target="_blank" rel="noreferrer">cron-parser</a> is used for parsing the <code>cronExpression</code>. If you need a different type of scheduler, use <code>queueWorkerAddJob</code> manually in your job handler.</p><h3 id="jobqueuecleanup" tabindex="-1">jobQueueCleanup <a class="header-anchor" href="#jobqueuecleanup" aria-label="Permalink to &quot;jobQueueCleanup&quot;">​</a></h3><p>A handler to remove jobs from the queue. The queue is the most performant when old completed jobs are cleaned up periodically. The advised way to use this job is the following:</p><ul><li>In <code>queueWorkerRegisterCronJobs</code>: <code>{ name: &quot;compas.queue.cleanup&quot;, cronExpression: &quot;0 1 * * *&quot; }</code> to run this job daily at 1 AM.</li><li>In your handler object: <code>{ &quot;compas.queue.cleanup&quot;: jobQueueCleanup({ queueHistoryInDays: 5 }), }</code></li></ul><h3 id="jobqueueinsights" tabindex="-1">jobQueueInsights <a class="header-anchor" href="#jobqueueinsights" aria-label="Permalink to &quot;jobQueueInsights&quot;">​</a></h3><p>Get insights in the amount of jobs that are ready to be picked up (ie <code>pending</code>) and how many jobs are scheduled at some time in the future. The advised way to use this job is the following:</p><ul><li>In <code>queueWorkerRegisterCronJobs</code>: <code>{ name: &quot;compas.queue.insights&quot;, cronExpression: &quot;0 * * * *&quot; }</code> to run this job every hour.</li><li>In your handler object: <code>{ &quot;compas.queue.insights&quot;: jobQueueInsights(), }</code></li></ul><h2 id="other-compas-store-jobs" tabindex="-1">Other @compas/store jobs <a class="header-anchor" href="#other-compas-store-jobs" aria-label="Permalink to &quot;Other @compas/store jobs&quot;">​</a></h2><h3 id="jobfilecleanup" tabindex="-1">jobFileCleanup <a class="header-anchor" href="#jobfilecleanup" aria-label="Permalink to &quot;jobFileCleanup&quot;">​</a></h3><p>When you delete a file via <code>queries.fileDelete</code> the file is not removed from the underlying bucket. To do this <code>syncDeletedFiles</code> is necessary. This job does that.</p><ul><li>In <code>queueWorkerRegisterCronJobs</code>: <code>{ name: &quot;compas.file.cleanup&quot;, cronExpression: &quot;0 2 * * *&quot; }</code> to run this job daily at 2 AM.</li><li>In your handler object: <code>{ &quot;compas.file.cleanup&quot;: jobFileCleanup(s3Client, &quot;bucketName&quot;), }</code></li></ul><h3 id="jobfilegenerateplaceholderimage" tabindex="-1">jobFileGeneratePlaceholderImage <a class="header-anchor" href="#jobfilegenerateplaceholderimage" aria-label="Permalink to &quot;jobFileGeneratePlaceholderImage&quot;">​</a></h3><p>When you create a file via <code>createOrUpdateFile</code> you have to the option to let it create a job to generate a placeholder image. This is a 10px wide JPEG that is stored on the file object, to support things like <a href="https://nextjs.org/docs/api-reference/next/image#blurdataurl" target="_blank" rel="noreferrer">Next.js Image <code>blurDataUrl</code></a>.</p><ul><li>In your handler object: <code>{ &quot;compas.file.generatePlaceholderImage&quot;: jobFileGeneratePlaceholderImage(s3Client, &quot;bucketName&quot;), }</code></li></ul><h3 id="jobfiletransformimage" tabindex="-1">jobFileTransformImage <a class="header-anchor" href="#jobfiletransformimage" aria-label="Permalink to &quot;jobFileTransformImage&quot;">​</a></h3><p>When you send files with <code>fileSendTransformedImageResponse</code>, it adds this job when a not yet transformed option combination is found. This job transforms the image according to the requested options.</p><ul><li>In your handler object: <code>{ &quot;compas.file.transformImage&quot;: jobFileTransformImage(s3Client), }</code></li></ul><h3 id="jobsessionstorecleanup" tabindex="-1">jobSessionStoreCleanup <a class="header-anchor" href="#jobsessionstorecleanup" aria-label="Permalink to &quot;jobSessionStoreCleanup&quot;">​</a></h3><p>Revoked and expired sessions of the session store are not automatically removed. This job does exactly that.</p><ul><li>In <code>queueWorkerRegisterCronJobs</code>: <code>{ name: &quot;compas.sessionStore.cleanup&quot;, cronExpression: &quot;0 2 * * *&quot; }</code> to run this job daily at 2 AM.</li><li>In your handler object: <code>{ &quot;compas.sessionStore.cleanup&quot;: jobSessionStoreCleanup({ maxRevokedAgeInDays: 14 }), }</code></li></ul><h3 id="jobsessionstoreprocessleakedsession" tabindex="-1">jobSessionStoreProcessLeakedSession <a class="header-anchor" href="#jobsessionstoreprocessleakedsession" aria-label="Permalink to &quot;jobSessionStoreProcessLeakedSession&quot;">​</a></h3><p>Process re ported leaked sessions. These jobs occur when the session store finds that refresh token is used multiple times. The job is able to either process the leaked session in to a report and log it via <code>type: &quot;sessionStore.leakedSession.report&quot;</code> or is able to dump the raw session information via <code>type: &quot;sessionStore.leakedSession.dump&quot;</code></p><ul><li>In your handler object: <code>{ &quot;compas.sessionStore.potentialLeakedSession&quot;: jobSessionStoreCleanup({ maxRevokedAgeInDays: 14 }), }</code></li></ul>',46)]))}const b=o(i,[["render",s]]);export{p as __pageData,b as default};