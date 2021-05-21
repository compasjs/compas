CREATE OR REPLACE VIEW "fileGroupView" AS
  SELECT
    fg.*,
    CASE WHEN (calc."childCount" > 0) THEN TRUE ELSE FALSE END as "isDirectory"
  FROM
    "fileGroup" fg
      LEFT JOIN LATERAL ( SELECT
                            count(nfg."id") as "childCount"
                          FROM
                            "fileGroup" nfg
                          WHERE
                              nfg."parent" = fg."id" ) "calc"
                ON TRUE;
