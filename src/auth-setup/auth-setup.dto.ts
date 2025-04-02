class AuthSetupInput {
  apiKey?: string
  source?: string
  userId: string
}

class AuthSetupOutput {
  message: string
}

export { AuthSetupInput as AuthSetupInputDto, AuthSetupOutput as AuthSetupOutputDto }
