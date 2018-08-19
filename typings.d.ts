// For importing json file in typescript with import * as...
declare module "*.json" {
    const value: any;
    export default value;
}