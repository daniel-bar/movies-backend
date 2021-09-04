export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly PORT: string;
            readonly HTTP_ACCESS_IP: string;
            readonly MYSQL_HOST: string;
            readonly MYSQL_PORT: string;
            readonly MYSQL_USER: string;
            readonly MYSQL_PWD: string;
            readonly MYSQL_DB_NAME: string;
            readonly JWT_PWD: string;
        }
    }
}