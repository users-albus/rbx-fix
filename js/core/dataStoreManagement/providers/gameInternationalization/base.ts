// tslint:disable
/// <reference path="./custom.d.ts" />
/**
 * GameInternationalization Api v1
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: v1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { EnvironmentUrls } from "Roblox";
import { Configuration } from "./configuration";
import { httpClient as globalAxios } from "../../../http/http";
import { AxiosPromise, AxiosInstance } from "axios";

export const BASE_PATH = EnvironmentUrls.gameInternationalizationApi.replace(
  /\/+$/,
  ""
);

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
  csv: ",",
  ssv: " ",
  tsv: "\t",
  pipes: "|",
};

/**
 *
 * @export
 * @interface RequestArgs
 */
export interface RequestArgs {
  url: string;
  options: any;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
  protected configuration: Configuration | undefined;

  constructor(
    configuration?: Configuration,
    protected basePath: string = BASE_PATH,
    protected axios: AxiosInstance = globalAxios
  ) {
    if (configuration) {
      this.configuration = configuration;
      this.basePath = configuration.basePath || this.basePath;
    }
  }
}

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
  name: "RequiredError" = "RequiredError";
  constructor(public field: string, msg?: string) {
    super(msg);
  }
}
