import { Module } from '@nestjs/common'
import { AuthSetupService } from './auth-setup.service'
import { LoggerModule } from 'nestjs-pino'
import { pino } from 'pino'
import { ApiKeyModule } from '../api-key'

const awsStage = process.env.AWS_STAGE ?? 'dev'
const awsEndpoint = process.env.AWS_ENDPOINT ?? 'http://localhost:4566'

@Module({
  imports: [
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
    ApiKeyModule.forRoot({
      tableName: `tvo-security-scan-account-apikey-${awsStage}`,
      awsStage,
      awsEndpoint
    })
  ],
  providers: [AuthSetupService]
})
export class AuthSetupModule {}
