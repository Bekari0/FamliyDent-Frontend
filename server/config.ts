const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const config = {
  get mongoUri() {
    return required("MONGODB_URI");
  },
  databaseName: process.env.MONGODB_DATABASE?.trim() || "FamilyDent",
  port: Number(process.env.PORT || 8787),
  nodeEnv: process.env.NODE_ENV || "development",
};
