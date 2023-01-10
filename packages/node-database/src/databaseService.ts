import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { getVariable, isVariableEnabled } from "@link1900/node-environment";
import { logger } from "@link1900/node-logger-api";

export async function connectToPostgresDatabase(
  options: PostgresConnectionOptions
): Promise<DataSource> {
  try {
    logger.info(
      `attempting to connect to database ${options.database} at ${options.host}`
    );
    // make sure pg has been imported first before attempting to connect
    require("pg");

    const dataSource = new DataSource(options);
    await dataSource.initialize();

    logger.info(`connected to database ${options.database}`);

    return dataSource;
  } catch (e) {
    logger.error(`error connecting to database ${options.database}`, e);
    throw e;
  }
}

export async function disconnectFromDatabase(
  dataSource: DataSource
): Promise<void> {
  logger.info(`closing connection to database`);
  if (dataSource.isInitialized) {
    return await dataSource.destroy();
  }
}

export function getPostgresDatabaseLambdaOptions(
  entities: Function[],
  migrations: Function[]
): PostgresConnectionOptions {
  // database connection details
  const databaseName = getVariable("DATABASE_NAME");
  const username = getVariable("DATABASE_USERNAME");
  const password = getVariable("DATABASE_PASSWORD");
  const host = getVariable("DATABASE_HOST");

  // database config
  const dropSchema = isVariableEnabled("DATABASE_DROP_ON_START");
  const synchronize = isVariableEnabled("DATABASE_SYNC");
  const logging = isVariableEnabled("DATABASE_LOGGING");

  return {
    type: "postgres",
    entities,
    migrations,
    database: databaseName,
    username,
    password,
    host,
    dropSchema,
    synchronize,
    logging,
    uuidExtension: "uuid-ossp",
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      options: "-c TimeZone=UTC",
      pool: {
        max: 1,
        min: 0,
        idleTimeoutMillis: 120000,
        connectionTimeoutMillis: 10000
      }
    }
  };
}
