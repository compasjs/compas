WITH
  recurring_jobs AS (
    SELECT DISTINCT data ->> 'name' AS "recurringName" FROM "job" WHERE "name" = 'compas.job.recurring'
  ),
  removed_recurring_jobs AS (DELETE FROM "job" WHERE "name" = 'compas.job.recurring'
  )
DELETE
FROM "job"
WHERE
    "name" IN (
    SELECT "recurringName"
    FROM recurring_jobs
  );
