export async function migrate(sql) {
  await sql.unsafe(`
    CREATE TABLE "testTable"
    (
      value int
    );
  `);
}
