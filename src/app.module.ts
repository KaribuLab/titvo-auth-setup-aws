import { ConfigModule } from '@aws/config'
import { Module } from '@nestjs/common'
import { SetupModule } from '@infrastructure/setup/setup.module'
import { pino } from 'pino'
import { LoggerModule } from 'nestjs-pino'
import { SecretModule } from '@aws/secret'
@Module({
  imports: [
    SetupModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level (label: string): { level: string } {
            return { level: label }
          }
        }
      }
    }),
    ConfigModule.forRoot({
      configOptions: {
        awsEndpoint: process.env.AWS_ENDPOINT ?? 'http://localhost:4566',
        awsStage: process.env.AWS_STAGE ?? 'prod',
        tableName: process.env.CONFIG_TABLE_NAME ?? 'api-key-table'
      },
      isGlobal: true
    }),
    SecretModule.forRoot({
      awsStage: process.env.AWS_STAGE ?? 'prod',
      awsEndpoint: process.env.AWS_ENDPOINT ?? 'http://localhost:4566'
    })
  ]
})
export class AppModule {}
