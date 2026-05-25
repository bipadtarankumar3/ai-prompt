# AI Prompt Generator Backend

Express.js + PostgreSQL server following a clean controller-service-repository (layered) architecture.

## Folder Structure

Matches the structure requested by the user:
- `app/controllers`: Route request handlers.
- `app/services`: Business logic & external AI integrations.
- `app/repositories`: Database access.
- `app/models`: Schema SQL files and entities.
- `app/routes`: API endpoints.
- `app/middlewares`: Request auth & error handling.
- `app/validations`: Input data validation.
- `app/helpers`: Success/error JSON response formatting.
- `app/utils`: Logging.
- `app/config`: Database connection pool and environmental variables.

## Getting Started

1. Create a database `ai_prompts` in your local PostgreSQL.
2. Setup your `.env` configuration file in this directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run in dev mode (which runs table migrations & seeding automatically):
   ```bash
   npm run dev
   ```
