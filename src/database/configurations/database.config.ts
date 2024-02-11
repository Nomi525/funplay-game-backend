import { config } from 'dotenv';
// import { DataSource, DataSourceOptions } from 'typeorm';
config();

class DatabaseConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string | undefined {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getLogDirectory() {
    return this.getValue('LOG_DIR', true);
  }

  public getJwtSecretKey() {
    return this.getValue('JWT_SECRET_KEY', true);
  }

  // public getTypeOrmConfig(): DataSourceOptions {
  //   return {
  //     type: 'postgres',
  //     host: this.getValue('DB_HOST'),
  //     port: parseInt(this.getValue('DB_PORT')),
  //     username: this.getValue('DB_USER'),
  //     password: this.getValue('DB_USER_PWD'),
  //     database: this.getValue('DB_NAME'),
  //     entities: [join(__dirname, '../../**/**/**', '*.entity.{ts,js}')],

  //     migrationsTableName: 'migrations',
  //     migrations: [join(__dirname, '../migrations', '*.{ts,js}')],
  //     logging: 'all',
  //     synchronize: false,
  //   };
  // }

  // public dataSource(): DataSource {
  //   return new DataSource(this.getTypeOrmConfig());
  // }
}

const configService = new DatabaseConfigService(process.env).ensureValues([
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_USER_PWD',
  'DB_NAME',
  'JWT_SECRET_KEY',
]);

export { configService };

// export default new DataSource(
//   new DatabaseConfigService(process.env).getTypeOrmConfig(),
// );
