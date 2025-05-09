import { NestFactory } from '@nestjs/core'
import { Context, APIGatewayProxyHandlerV2, APIGatewayProxyCallbackV2, APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from 'aws-lambda'
import { AppModule } from './app.module'
import { Logger } from 'nestjs-pino'
import { HttpStatus, INestApplicationContext, Logger as NestLogger } from '@nestjs/common'
import { findHeaderCaseInsensitive } from './utils/headers'
import { SetupUseCase, SetupInputDto } from '@titvo/setup'
import { InvalidApiKeyError } from '@titvo/auth'
import { UserNotFoundError } from '@setup/app/setup/setup.error'
const logger = new NestLogger('AuthSetupHandler')

async function initApp (): Promise<INestApplicationContext> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true
  })
  await app.init()
  app.useLogger(app.get(Logger))
  app.flushLogs()
  return app
}

const app = await initApp()

const setupUseCase = app.get(SetupUseCase)

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: APIGatewayProxyCallbackV2): Promise<APIGatewayProxyResultV2> => {
  logger.debug(`Received event: ${event.body as string}`)
  try {
    const apiKey = findHeaderCaseInsensitive(event.headers, 'x-api-key')
    const body = JSON.parse(event.body ?? '{}')
    logger.log(`Received event: [source=${body.source as string}, args=${JSON.stringify(body.args)}]`)
    const input: SetupInputDto = {
      apiKey,
      source: body.source,
      userId: body.args.user_id
    }
    const output = await setupUseCase.execute(input)
    return {
      statusCode: HttpStatus.OK,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(output)
    }
  } catch (error) {
    // Log error details with stack trace if available
    if (error instanceof Error) {
      logger.error(`Error caught in handler: ${error.message}`, error.stack)
    } else {
      logger.error(`Unknown error caught in handler: ${String(error)}`)
    }

    // Check if the error is related to API Key authentication
    if (error instanceof UserNotFoundError || error instanceof InvalidApiKeyError) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Authentication failed',
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }

    // Handle any other error as internal server error
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    }
  }
}
