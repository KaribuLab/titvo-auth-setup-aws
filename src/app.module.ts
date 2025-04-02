import { Module } from '@nestjs/common'
import { ParameterModule } from '@shared'
import { AuthSetupModule } from './auth-setup/auth-setup.module'
import { SecretManagerModule } from '../shared/src/secret-manager/secret-manager.module'

@Module({
  imports: [
    AuthSetupModule,
    SecretManagerModule.forRoot({
      ttl: 60,
      awsEndpoint: process.env.AWS_ENDPOINT ?? 'http://localhost:4566',
      awsStage: process.env.AWS_STAGE ?? 'prod',
      serviceName: 'auth-setup'
    }),
    ParameterModule.forRoot({
      parameterServiceOptions: {
        ttl: 60,
        awsEndpoint: process.env.AWS_ENDPOINT ?? 'http://localhost:4566',
        awsStage: process.env.AWS_STAGE ?? 'prod',
        parameterBasePath: '/tvo/security-scan',
        serviceName: 'auth-setup'
      },
      isGlobal: true
    })
  ]
})
export class AppModule {}
