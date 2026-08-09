export type Migration = Readonly<{
  id: string;
  filename: string;
}>;

export const migrations: readonly Migration[] = [
  {
    id: "0001_initial_finance_schema",
    filename: "0001_initial_finance_schema.sql",
  },
];
