// tslint:disable
/// <reference path="./custom.d.ts" />
/**
 * TranslationRoles Api v1
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as globalImportUrl from "url";
import { Configuration } from "./configuration";
import { httpClient as globalAxios } from "../../../http/http";
import { AxiosPromise, AxiosInstance } from "axios";
import {
  BASE_PATH,
  COLLECTION_FORMATS,
  RequestArgs,
  BaseAPI,
  RequiredError,
} from "./base";

/**
 *
 * @export
 * @interface RobloxGameLocalizationClientGameLocalizationRolesAssignee
 */
export interface RobloxGameLocalizationClientGameLocalizationRolesAssignee {
  /**
   *
   * @type {string}
   * @memberof RobloxGameLocalizationClientGameLocalizationRolesAssignee
   */
  assigneeType?: RobloxGameLocalizationClientGameLocalizationRolesAssigneeAssigneeTypeEnum;
  /**
   *
   * @type {number}
   * @memberof RobloxGameLocalizationClientGameLocalizationRolesAssignee
   */
  id?: number;
}

/**
 * @export
 * @enum {string}
 */
export enum RobloxGameLocalizationClientGameLocalizationRolesAssigneeAssigneeTypeEnum {
  User = "user",
  Group = "group",
  GroupRole = "groupRole",
}

/**
 *
 * @export
 * @interface RobloxGameLocalizationClientGameLocalizationRolesGameLocalizationRoleAssignment
 */
export interface RobloxGameLocalizationClientGameLocalizationRolesGameLocalizationRoleAssignment {
  /**
   *
   * @type {number}
   * @memberof RobloxGameLocalizationClientGameLocalizationRolesGameLocalizationRoleAssignment
   */
  gameId?: number;
  /**
   *
   * @type {RobloxGameLocalizationClientGameLocalizationRolesAssignee}
   * @memberof RobloxGameLocalizationClientGameLocalizationRolesGameLocalizationRoleAssignment
   */
  assignee?: RobloxGameLocalizationClientGameLocalizationRolesAssignee;
}
/**
 *
 * @export
 * @interface RobloxTranslationRolesApiAssignee
 */
export interface RobloxTranslationRolesApiAssignee {
  /**
   *
   * @type {number}
   * @memberof RobloxTranslationRolesApiAssignee
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof RobloxTranslationRolesApiAssignee
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof RobloxTranslationRolesApiAssignee
   */
  type?: RobloxTranslationRolesApiAssigneeTypeEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum RobloxTranslationRolesApiAssigneeTypeEnum {
  User = "user",
  Group = "group",
  GroupRole = "groupRole",
}

/**
 * Response model containing a list of games and associated role assignment info for the requested user and role.
 * @export
 * @interface RobloxTranslationRolesApiGetGameLocalizationRoleAssignmentsForUserResponse
 */
export interface RobloxTranslationRolesApiGetGameLocalizationRoleAssignmentsForUserResponse {
  /**
   * List of games with associated role assignment info.
   * @type {Array<RobloxGameLocalizationClientGameLocalizationRolesGameLocalizationRoleAssignment>}
   * @memberof RobloxTranslationRolesApiGetGameLocalizationRoleAssignmentsForUserResponse
   */
  games?: Array<RobloxGameLocalizationClientGameLocalizationRolesGameLocalizationRoleAssignment>;
  /**
   * Cursor which can be used for navigating to previous page.
   * @type {string}
   * @memberof RobloxTranslationRolesApiGetGameLocalizationRoleAssignmentsForUserResponse
   */
  previousPageCursor?: string;
  /**
   * Cursor which can be used for navigating to next page.
   * @type {string}
   * @memberof RobloxTranslationRolesApiGetGameLocalizationRoleAssignmentsForUserResponse
   */
  nextPageCursor?: string;
}
/**
 * The request body for update role endpoints
 * @export
 * @interface RobloxTranslationRolesApiUpdateRoleRequest
 */
export interface RobloxTranslationRolesApiUpdateRoleRequest {
  /**
   * The id of the assignee
   * @type {number}
   * @memberof RobloxTranslationRolesApiUpdateRoleRequest
   */
  assigneeId?: number;
  /**
   * The type of the assignee
   * @type {string}
   * @memberof RobloxTranslationRolesApiUpdateRoleRequest
   */
  assigneeType?: RobloxTranslationRolesApiUpdateRoleRequestAssigneeTypeEnum;
  /**
   * The role to be assigned or revoked
   * @type {string}
   * @memberof RobloxTranslationRolesApiUpdateRoleRequest
   */
  role?: RobloxTranslationRolesApiUpdateRoleRequestRoleEnum;
  /**
   * To assign or to revoke
   * @type {boolean}
   * @memberof RobloxTranslationRolesApiUpdateRoleRequest
   */
  revoke?: boolean;
}

/**
 * @export
 * @enum {string}
 */
export enum RobloxTranslationRolesApiUpdateRoleRequestAssigneeTypeEnum {
  User = "user",
  Group = "group",
  GroupRole = "groupRole",
}
/**
 * @export
 * @enum {string}
 */
export enum RobloxTranslationRolesApiUpdateRoleRequestRoleEnum {
  Translator = "translator",
}

/**
 *
 * @export
 * @interface RobloxWebWebAPIModelsApiArrayResponseRobloxTranslationRolesApiAssignee
 */
export interface RobloxWebWebAPIModelsApiArrayResponseRobloxTranslationRolesApiAssignee {
  /**
   *
   * @type {Array<RobloxTranslationRolesApiAssignee>}
   * @memberof RobloxWebWebAPIModelsApiArrayResponseRobloxTranslationRolesApiAssignee
   */
  data?: Array<RobloxTranslationRolesApiAssignee>;
}
/**
 *
 * @export
 * @interface RobloxWebWebAPIModelsApiArrayResponseSystemString
 */
export interface RobloxWebWebAPIModelsApiArrayResponseSystemString {
  /**
   *
   * @type {Array<string>}
   * @memberof RobloxWebWebAPIModelsApiArrayResponseSystemString
   */
  data?: Array<string>;
}

/**
 * GameLocalizationRolesApi - axios parameter creator
 * @export
 */
export const GameLocalizationRolesApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     *
     * @summary Retrieves the list of roles granted to current logged-in user
     * @param {number} gameId The id of the game
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet(
      gameId: number,
      options: any = {}
    ): RequestArgs {
      // verify required parameter 'gameId' is not null or undefined
      if (gameId === null || gameId === undefined) {
        throw new RequiredError(
          "gameId",
          "Required parameter gameId was null or undefined when calling v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet."
        );
      }
      const localVarPath =
        `/v1/game-localization-roles/games/{gameId}/current-user/roles`.replace(
          `{${"gameId"}}`,
          encodeURIComponent(String(gameId))
        );
      const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarUrlObj.query = {
        ...localVarUrlObj.query,
        ...localVarQueryParameter,
        ...options.query,
      };
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...options.headers,
      };

      return {
        url: globalImportUrl.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary Assigns or revokes a role
     * @param {number} gameId The id of the game
     * @param {RobloxTranslationRolesApiUpdateRoleRequest} request The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdPatch(
      gameId: number,
      request: RobloxTranslationRolesApiUpdateRoleRequest,
      options: any = {}
    ): RequestArgs {
      // verify required parameter 'gameId' is not null or undefined
      if (gameId === null || gameId === undefined) {
        throw new RequiredError(
          "gameId",
          "Required parameter gameId was null or undefined when calling v1GameLocalizationRolesGamesGameIdPatch."
        );
      }
      // verify required parameter 'request' is not null or undefined
      if (request === null || request === undefined) {
        throw new RequiredError(
          "request",
          "Required parameter request was null or undefined when calling v1GameLocalizationRolesGamesGameIdPatch."
        );
      }
      const localVarPath = `/v1/game-localization-roles/games/{gameId}`.replace(
        `{${"gameId"}}`,
        encodeURIComponent(String(gameId))
      );
      const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = {
        method: "PATCH",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter["Content-Type"] = "application/json";

      localVarUrlObj.query = {
        ...localVarUrlObj.query,
        ...localVarQueryParameter,
        ...options.query,
      };
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...options.headers,
      };
      const needsSerialization =
        <any>"RobloxTranslationRolesApiUpdateRoleRequest" !== "string" ||
        localVarRequestOptions.headers["Content-Type"] === "application/json";
      localVarRequestOptions.data = needsSerialization
        ? JSON.stringify(request !== undefined ? request : {})
        : request || "";

      return {
        url: globalImportUrl.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary Gets list of users assigned a specific role in a game.
     * @param {number} gameId The id of the game
     * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet(
      gameId: number,
      role: "translator",
      options: any = {}
    ): RequestArgs {
      // verify required parameter 'gameId' is not null or undefined
      if (gameId === null || gameId === undefined) {
        throw new RequiredError(
          "gameId",
          "Required parameter gameId was null or undefined when calling v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet."
        );
      }
      // verify required parameter 'role' is not null or undefined
      if (role === null || role === undefined) {
        throw new RequiredError(
          "role",
          "Required parameter role was null or undefined when calling v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet."
        );
      }
      const localVarPath =
        `/v1/game-localization-roles/games/{gameId}/roles/{role}/assignees`
          .replace(`{${"gameId"}}`, encodeURIComponent(String(gameId)))
          .replace(`{${"role"}}`, encodeURIComponent(String(role)));
      const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarUrlObj.query = {
        ...localVarUrlObj.query,
        ...localVarQueryParameter,
        ...options.query,
      };
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...options.headers,
      };

      return {
        url: globalImportUrl.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary Gets the list of games and associated role assignment info for the requested user and role.
     * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
     * @param {string} [exclusiveStartKey] Part of pagination. Last primary key of returned items in previous operation.
     * @param {number} [pageSize] Part of pagination. Maximum number of items that might be returned in the page.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesRolesRoleCurrentUserGet(
      role: "translator",
      exclusiveStartKey?: string,
      pageSize?: number,
      options: any = {}
    ): RequestArgs {
      // verify required parameter 'role' is not null or undefined
      if (role === null || role === undefined) {
        throw new RequiredError(
          "role",
          "Required parameter role was null or undefined when calling v1GameLocalizationRolesRolesRoleCurrentUserGet."
        );
      }
      const localVarPath =
        `/v1/game-localization-roles/roles/{role}/current-user`.replace(
          `{${"role"}}`,
          encodeURIComponent(String(role))
        );
      const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      if (exclusiveStartKey !== undefined) {
        localVarQueryParameter["exclusiveStartKey"] = exclusiveStartKey;
      }

      if (pageSize !== undefined) {
        localVarQueryParameter["pageSize"] = pageSize;
      }

      localVarUrlObj.query = {
        ...localVarUrlObj.query,
        ...localVarQueryParameter,
        ...options.query,
      };
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...options.headers,
      };

      return {
        url: globalImportUrl.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * GameLocalizationRolesApi - functional programming interface
 * @export
 */
export const GameLocalizationRolesApiFp = function (
  configuration?: Configuration
) {
  return {
    /**
     *
     * @summary Retrieves the list of roles granted to current logged-in user
     * @param {number} gameId The id of the game
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet(
      gameId: number,
      options?: any
    ): (
      axios?: AxiosInstance,
      basePath?: string
    ) => AxiosPromise<RobloxWebWebAPIModelsApiArrayResponseSystemString> {
      const localVarAxiosArgs = GameLocalizationRolesApiAxiosParamCreator(
        configuration
      ).v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet(gameId, options);
      return (
        axios: AxiosInstance = globalAxios,
        basePath: string = BASE_PATH
      ) => {
        const axiosRequestArgs = {
          ...localVarAxiosArgs.options,
          url: basePath + localVarAxiosArgs.url,
        };
        return axios.request(axiosRequestArgs);
      };
    },
    /**
     *
     * @summary Assigns or revokes a role
     * @param {number} gameId The id of the game
     * @param {RobloxTranslationRolesApiUpdateRoleRequest} request The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdPatch(
      gameId: number,
      request: RobloxTranslationRolesApiUpdateRoleRequest,
      options?: any
    ): (axios?: AxiosInstance, basePath?: string) => AxiosPromise<object> {
      const localVarAxiosArgs = GameLocalizationRolesApiAxiosParamCreator(
        configuration
      ).v1GameLocalizationRolesGamesGameIdPatch(gameId, request, options);
      return (
        axios: AxiosInstance = globalAxios,
        basePath: string = BASE_PATH
      ) => {
        const axiosRequestArgs = {
          ...localVarAxiosArgs.options,
          url: basePath + localVarAxiosArgs.url,
        };
        return axios.request(axiosRequestArgs);
      };
    },
    /**
     *
     * @summary Gets list of users assigned a specific role in a game.
     * @param {number} gameId The id of the game
     * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet(
      gameId: number,
      role: "translator",
      options?: any
    ): (
      axios?: AxiosInstance,
      basePath?: string
    ) => AxiosPromise<RobloxWebWebAPIModelsApiArrayResponseRobloxTranslationRolesApiAssignee> {
      const localVarAxiosArgs = GameLocalizationRolesApiAxiosParamCreator(
        configuration
      ).v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet(
        gameId,
        role,
        options
      );
      return (
        axios: AxiosInstance = globalAxios,
        basePath: string = BASE_PATH
      ) => {
        const axiosRequestArgs = {
          ...localVarAxiosArgs.options,
          url: basePath + localVarAxiosArgs.url,
        };
        return axios.request(axiosRequestArgs);
      };
    },
    /**
     *
     * @summary Gets the list of games and associated role assignment info for the requested user and role.
     * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
     * @param {string} [exclusiveStartKey] Part of pagination. Last primary key of returned items in previous operation.
     * @param {number} [pageSize] Part of pagination. Maximum number of items that might be returned in the page.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesRolesRoleCurrentUserGet(
      role: "translator",
      exclusiveStartKey?: string,
      pageSize?: number,
      options?: any
    ): (
      axios?: AxiosInstance,
      basePath?: string
    ) => AxiosPromise<RobloxTranslationRolesApiGetGameLocalizationRoleAssignmentsForUserResponse> {
      const localVarAxiosArgs = GameLocalizationRolesApiAxiosParamCreator(
        configuration
      ).v1GameLocalizationRolesRolesRoleCurrentUserGet(
        role,
        exclusiveStartKey,
        pageSize,
        options
      );
      return (
        axios: AxiosInstance = globalAxios,
        basePath: string = BASE_PATH
      ) => {
        const axiosRequestArgs = {
          ...localVarAxiosArgs.options,
          url: basePath + localVarAxiosArgs.url,
        };
        return axios.request(axiosRequestArgs);
      };
    },
  };
};

/**
 * GameLocalizationRolesApi - factory interface
 * @export
 */
export const GameLocalizationRolesApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  return {
    /**
     *
     * @summary Retrieves the list of roles granted to current logged-in user
     * @param {number} gameId The id of the game
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet(
      gameId: number,
      options?: any
    ) {
      return GameLocalizationRolesApiFp(
        configuration
      ).v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet(gameId, options)(
        axios,
        basePath
      );
    },
    /**
     *
     * @summary Assigns or revokes a role
     * @param {number} gameId The id of the game
     * @param {RobloxTranslationRolesApiUpdateRoleRequest} request The request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdPatch(
      gameId: number,
      request: RobloxTranslationRolesApiUpdateRoleRequest,
      options?: any
    ) {
      return GameLocalizationRolesApiFp(
        configuration
      ).v1GameLocalizationRolesGamesGameIdPatch(
        gameId,
        request,
        options
      )(axios, basePath);
    },
    /**
     *
     * @summary Gets list of users assigned a specific role in a game.
     * @param {number} gameId The id of the game
     * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet(
      gameId: number,
      role: "translator",
      options?: any
    ) {
      return GameLocalizationRolesApiFp(
        configuration
      ).v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet(
        gameId,
        role,
        options
      )(axios, basePath);
    },
    /**
     *
     * @summary Gets the list of games and associated role assignment info for the requested user and role.
     * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
     * @param {string} [exclusiveStartKey] Part of pagination. Last primary key of returned items in previous operation.
     * @param {number} [pageSize] Part of pagination. Maximum number of items that might be returned in the page.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    v1GameLocalizationRolesRolesRoleCurrentUserGet(
      role: "translator",
      exclusiveStartKey?: string,
      pageSize?: number,
      options?: any
    ) {
      return GameLocalizationRolesApiFp(
        configuration
      ).v1GameLocalizationRolesRolesRoleCurrentUserGet(
        role,
        exclusiveStartKey,
        pageSize,
        options
      )(axios, basePath);
    },
  };
};

/**
 * GameLocalizationRolesApi - interface
 * @export
 * @interface GameLocalizationRolesApi
 */
export interface GameLocalizationRolesApiInterface {
  /**
   *
   * @summary Retrieves the list of roles granted to current logged-in user
   * @param {number} gameId The id of the game
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof GameLocalizationRolesApiInterface
   */
  v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet(
    gameId: number,
    options?: any
  ): AxiosPromise<RobloxWebWebAPIModelsApiArrayResponseSystemString>;

  /**
   *
   * @summary Assigns or revokes a role
   * @param {number} gameId The id of the game
   * @param {RobloxTranslationRolesApiUpdateRoleRequest} request The request body
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof GameLocalizationRolesApiInterface
   */
  v1GameLocalizationRolesGamesGameIdPatch(
    gameId: number,
    request: RobloxTranslationRolesApiUpdateRoleRequest,
    options?: any
  ): AxiosPromise<object>;

  /**
   *
   * @summary Gets list of users assigned a specific role in a game.
   * @param {number} gameId The id of the game
   * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof GameLocalizationRolesApiInterface
   */
  v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet(
    gameId: number,
    role: "translator",
    options?: any
  ): AxiosPromise<RobloxWebWebAPIModelsApiArrayResponseRobloxTranslationRolesApiAssignee>;

  /**
   *
   * @summary Gets the list of games and associated role assignment info for the requested user and role.
   * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
   * @param {string} [exclusiveStartKey] Part of pagination. Last primary key of returned items in previous operation.
   * @param {number} [pageSize] Part of pagination. Maximum number of items that might be returned in the page.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof GameLocalizationRolesApiInterface
   */
  v1GameLocalizationRolesRolesRoleCurrentUserGet(
    role: "translator",
    exclusiveStartKey?: string,
    pageSize?: number,
    options?: any
  ): AxiosPromise<RobloxTranslationRolesApiGetGameLocalizationRoleAssignmentsForUserResponse>;
}

/**
 * GameLocalizationRolesApi - object-oriented interface
 * @export
 * @class GameLocalizationRolesApi
 * @extends {BaseAPI}
 */
export class GameLocalizationRolesApi
  extends BaseAPI
  implements GameLocalizationRolesApiInterface
{
  /**
   *
   * @summary Retrieves the list of roles granted to current logged-in user
   * @param {number} gameId The id of the game
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof GameLocalizationRolesApi
   */
  public v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet(
    gameId: number,
    options?: any
  ) {
    return GameLocalizationRolesApiFp(
      this.configuration
    ).v1GameLocalizationRolesGamesGameIdCurrentUserRolesGet(gameId, options)(
      this.axios,
      this.basePath
    );
  }

  /**
   *
   * @summary Assigns or revokes a role
   * @param {number} gameId The id of the game
   * @param {RobloxTranslationRolesApiUpdateRoleRequest} request The request body
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof GameLocalizationRolesApi
   */
  public v1GameLocalizationRolesGamesGameIdPatch(
    gameId: number,
    request: RobloxTranslationRolesApiUpdateRoleRequest,
    options?: any
  ) {
    return GameLocalizationRolesApiFp(
      this.configuration
    ).v1GameLocalizationRolesGamesGameIdPatch(
      gameId,
      request,
      options
    )(this.axios, this.basePath);
  }

  /**
   *
   * @summary Gets list of users assigned a specific role in a game.
   * @param {number} gameId The id of the game
   * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof GameLocalizationRolesApi
   */
  public v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet(
    gameId: number,
    role: "translator",
    options?: any
  ) {
    return GameLocalizationRolesApiFp(
      this.configuration
    ).v1GameLocalizationRolesGamesGameIdRolesRoleAssigneesGet(
      gameId,
      role,
      options
    )(this.axios, this.basePath);
  }

  /**
   *
   * @summary Gets the list of games and associated role assignment info for the requested user and role.
   * @param {'translator'} role The {Roblox.GameLocalization.Client.GameLocalizationRoles.GameLocalizationRoleType}
   * @param {string} [exclusiveStartKey] Part of pagination. Last primary key of returned items in previous operation.
   * @param {number} [pageSize] Part of pagination. Maximum number of items that might be returned in the page.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof GameLocalizationRolesApi
   */
  public v1GameLocalizationRolesRolesRoleCurrentUserGet(
    role: "translator",
    exclusiveStartKey?: string,
    pageSize?: number,
    options?: any
  ) {
    return GameLocalizationRolesApiFp(
      this.configuration
    ).v1GameLocalizationRolesRolesRoleCurrentUserGet(
      role,
      exclusiveStartKey,
      pageSize,
      options
    )(this.axios, this.basePath);
  }
}
