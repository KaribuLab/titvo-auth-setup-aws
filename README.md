# Titvo Auth Setup

Este repositorio contiene la implementación de un sistema de autenticación basado en API Keys para servicios de Titvo. Proporciona una base para configurar y gestionar la autenticación en proyectos que utilizan AWS Lambda con API Gateway.

## Características

- Gestión de API Keys para autenticación
- Configuración automática de autenticación
- Integración con servicios de AWS
- Compatible con NestJS

## Requisitos

- [NVM](https://github.com/nvm-sh/nvm)
- [Task](https://taskfile.dev/installation/)
- [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform)
- [Terragrunt](https://terragrunt.gruntwork.io/docs/getting-started/install/)

> [!IMPORTANT]
> En windows se **DEBE** usar [Windows Subsystem for Linux 2 (WSL2)](https://learn.microsoft.com/es-es/windows/wsl/install)

## Estructura del Proyecto

```shell
.
├── auth                 # Módulo de autenticación
│   ├── src              # Código fuente del servicio de autenticación
│   │   ├── app          # Lógica de aplicación
│   │   └── core         # Entidades y repositorios
├── aws                  # Recursos de AWS
│   ├── cloudwatch       # Configuración de CloudWatch
│   ├── lambda           # Configuración de Lambda
│   └── parameter        # Parámetros de AWS
├── setup                # Scripts de configuración inicial
├── shared               # Código compartido entre módulos
├── src                  # Código fuente principal
├── localstack           # Configuración para desarrollo local
├── .vscode              # Configuración de VS Code
├── package.json         # Dependencias del proyecto
├── serverless.hcl       # Configuración de Serverless
├── terragrunt.hcl       # Configuración de Terragrunt
├── tsconfig.json        # Configuración de TypeScript
└── localstack.hcl       # Configuración adicional de LocalStack
```

## Configuración de Autenticación

Para configurar la autenticación, se puede utilizar el endpoint disponible que se muestra en el archivo `auth.http`:

```http
POST /auth/setup
Content-Type: application/json
X-API-Key: {{apiKey}}

{
  "source": "cli",
  "args": {
    "user_id": "{{user_id}}"
  }
}
```

## Desarrollo Local

Para el desarrollo local, se utiliza LocalStack. La configuración se encuentra en el archivo `localstack.hcl`.

## Tecnologías

- NestJS para la implementación del servicio
- AWS Lambda como entorno de ejecución
- DynamoDB para almacenamiento de datos
- API Gateway para exposición del servicio

## Despliegue

Opcionalmente se puede crear un archivo common_tags.json con las etiquetas necesarias:

```json
{
  "Project": "Titvo Security Scan",
  "Customer": "Titvo",
  "Team": "Area Creacion"
}
```

1. Crear archivo .env con las variables necesarias descritas arriba
  ```bash
  export AWS_ACCESS_KEY_ID="tu_access_key"
  export AWS_SECRET_ACCESS_KEY="tu_secret_key"
  export AWS_DEFAULT_REGION="us-east-1"
  export AWS_STAGE="prod"
  export PROJECT_NAME="titvo-auth-setup" # Opcional si quiere mantener los valores por defecto. Esto se usará como prefijo para los recursos
  export PARAMETER_PATH="/titvo/security-scan" # Opcional si quiere mantener los valores por defecto. Esto se usará como prefijo para los parámetros
  export BUCKET_STATE_NAME="titvo-auth-setup-terraform-state" # Opcional, si no se especifica se usará el nombre del proyecto. Por ejemplo: titvo-security-scan-terraform-state
  ```
  > [!IMPORTANT]
  > `PARAMETER_PATH`deben tener los mismos valores que se usarion en el proyecto [titvo-security-scan-infra-aws](https://github.com/KaribuLab/titvo-security-scan-infra-aws)
1. Desplegar el proyecto
  ```bash
  npm install
  npm run build
  cd aws
  terragrunt run-all apply --terragrunt-non-interactive --auto-approve
  ```

## Licencia

Este proyecto está licenciado bajo [Apache License 2.0](LICENSE).