# API

The public compas API, a work in progress.

[[toc]]

<!-- marker -->

## @compas/stdlib

- [mainFn](./stdlib.html#mainfn)
- [newLogger](./stdlib.html#newlogger)
- [newEvent](./stdlib.html#newevent)
- [newEventFromEvent](./stdlib.html#neweventfromevent)
- [eventStart](./stdlib.html#eventstart)
- [eventStop](./stdlib.html#eventstop)
- [isProduction](./stdlib.html#isproduction)
- [isStaging](./stdlib.html#isstaging)
- [refreshEnvironmentCache](./stdlib.html#refreshenvironmentcache)
- [filenameForModule](./stdlib.html#filenameformodule)
- [dirnameForModule](./stdlib.html#dirnameformodule)
- [isNil](./stdlib.html#isnil)
- [isPlainObject](./stdlib.html#isplainobject)
- [uuid](./stdlib.html#uuid)
- [noop](./stdlib.html#noop)
- [merge](./stdlib.html#merge)
- [streamToBuffer](./stdlib.html#streamtobuffer)
- [pathJoin](./stdlib.html#pathjoin)
- [exec](./stdlib.html#exec)
- [spawn](./stdlib.html#spawn)
- [calculateCookieUrlFromAppUrl](./stdlib.html#calculatecookieurlfromappurl)
- [calculateCorsUrlFromAppUrl](./stdlib.html#calculatecorsurlfromappurl)
- [processDirectoryRecursive](./stdlib.html#processdirectoryrecursive)
- [processDirectoryRecursiveSync](./stdlib.html#processdirectoryrecursivesync)
- [flatten](./stdlib.html#flatten)
- [unFlatten](./stdlib.html#unflatten)
- [getSecondsSinceEpoch](./stdlib.html#getsecondssinceepoch)
- [bytesToHumanReadable](./stdlib.html#bytestohumanreadable)
- [printProcessMemoryUsage](./stdlib.html#printprocessmemoryusage)

## @compas/cli

- [test](./cli.html#test)
- [mainTestFn](./cli.html#maintestfn)
- [newTestEvent](./cli.html#newtestevent)
- [bench](./cli.html#bench)
- [mainBenchFn](./cli.html#mainbenchfn)

## @compas/store

- [newPostgresConnection](./store.html#newpostgresconnection)
- [setStoreQueries](./store.html#setstorequeries)
- [query](./store.html#query)
- [isQueryPart](./store.html#isquerypart)
- [stringifyQueryPart](./store.html#stringifyquerypart)
- [explainAnalyzeQuery](./store.html#explainanalyzequery)
- [newMigrateContext](./store.html#newmigratecontext)
- [getMigrationsToBeApplied](./store.html#getmigrationstobeapplied)
- [runMigrations](./store.html#runmigrations)
- [addEventToQueue](./store.html#addeventtoqueue)
- [addJobToQueue](./store.html#addjobtoqueue)
- [addRecurringJobToQueue](./store.html#addrecurringjobtoqueue)
- [addJobWithCustomTimeoutToQueue](./store.html#addjobwithcustomtimeouttoqueue)
- [getUncompletedJobsByName](./store.html#getuncompletedjobsbyname)
- [newSessionStore](./store.html#newsessionstore)
- [newMinioClient](./store.html#newminioclient)
- [ensureBucket](./store.html#ensurebucket)
- [removeBucket](./store.html#removebucket)
- [listObjects](./store.html#listobjects)
- [removeBucketAndObjectsInBucket](./store.html#removebucketandobjectsinbucket)
- [createOrUpdateFile](./store.html#createorupdatefile)
- [copyFile](./store.html#copyfile)
- [getFileStream](./store.html#getfilestream)
- [syncDeletedFiles](./store.html#syncdeletedfiles)
- [hostChildrenToParent](./store.html#hostchildrentoparent)
- [updateFileGroupOrder](./store.html#updatefilegrouporder)
- [createTestPostgresDatabase](./store.html#createtestpostgresdatabase)
- [cleanupTestPostgresDatabase](./store.html#cleanuptestpostgresdatabase)

## @compas/server

- [getApp](./server.html#getapp)
- [sendFile](./server.html#sendfile)
- [createBodyParsers](./server.html#createbodyparsers)
- [session](./server.html#session)
- [compose](./server.html#compose)
- [createTestAppAndClient](./server.html#createtestappandclient)
- [closeTestApp](./server.html#closetestapp)

<!-- marker -->
