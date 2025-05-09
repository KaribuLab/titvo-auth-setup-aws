import { CryptoModule } from '@infrastructure/crypto/crypto.module'
import { ApiKeyModule } from '@infrastructure/api-key/api-key.module'
import { Module } from '@nestjs/common'
import { SetupUseCase } from '@titvo/setup'
@Module({
  providers: [
    SetupUseCase
  ],
  imports: [CryptoModule, ApiKeyModule],
  exports: [SetupUseCase]
})
export class SetupModule {}
