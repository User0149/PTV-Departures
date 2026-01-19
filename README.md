After cloning the repo:
1. Run `pnpm install-deps` in the project directory to install dependencies
1. Create a `.env` file in the project directory with the following content:
    ```
    BACKEND_PORT=<backend port here>
    FRONTEND_PORT=<frontend port here>
    ```
1. Create a `.env` file in the `backend/` directory with the following content:
    ```
    PTV_DEVELOPER_ID=<your developer id here>
    PTV_DEVELOPER_KEY=<your developer key here>
    ```

To start the development server:
1. Run `pnpm dev`

To build and start the production server:
1. Run `pnpm build`
1. Run `pnpm start`
