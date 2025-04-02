import { Injectable, Logger } from '@nestjs/common'
import { AuthSetupInputDto, AuthSetupOutputDto } from './auth-setup.dto'
import { ApiKeyRepository, UserNotFoundError, InvalidApiKeyError } from '../api-key'
import * as crypto from 'crypto'

@Injectable()
export class AuthSetupService {
  private readonly logger = new Logger(AuthSetupService.name)

  constructor (
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  /**
   * Creates a SHA-256 hash of the provided API key
   * @param apiKey API key to hash
   * @returns Hashed API key
   */
  private hashApiKey (apiKey: string): string {
    return crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex')
  }

  /**
   * Validates the API key and user ID provided in the input
   * @param userId User ID to validate
   * @param apiKey API key to validate
   * @throws UserNotFoundError if the user ID is not found
   * @throws InvalidApiKeyError if the API key is invalid
   */
  private async validateApiKey (userId: string, apiKey?: string): Promise<void> {
    if (apiKey === undefined) {
      const errorMessage = `API Key is undefined for user ID: ${userId}`
      this.logger.warn(errorMessage)
      throw new InvalidApiKeyError(errorMessage)
    }

    // Find the API key by user ID
    const storedApiKey = await this.apiKeyRepository.findByUserId(userId)

    if (storedApiKey === null) {
      this.logger.warn(`No API Key found for user ID: ${userId}`)
      throw new UserNotFoundError(userId)
    }

    // Hash the input API key to compare with the stored hash
    const hashedApiKey = this.hashApiKey(apiKey)

    // Compare the hash with the stored API key (which is already hashed)
    if (hashedApiKey !== storedApiKey.apiKey) {
      const errorMessage = `Invalid API Key provided for user ID: ${userId}`
      this.logger.warn(errorMessage)
      throw new InvalidApiKeyError(errorMessage)
    }

    this.logger.log(`API Key validated successfully for user ID: ${userId}`)
  }

  /**
   * Process the auth setup request
   * @param input Auth setup input data
   * @returns Auth setup output data
   */
  async process (input: AuthSetupInputDto): Promise<AuthSetupOutputDto> {
    // Validate the API key and user ID
    await this.validateApiKey(input.userId, input.apiKey)

    return {
      message: 'success'
    }
  }
}
