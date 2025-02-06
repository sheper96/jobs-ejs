const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

module.exports = dbURI;