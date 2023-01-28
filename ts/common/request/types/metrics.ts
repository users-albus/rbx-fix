import { EnvironmentUrls } from "Roblox";
import UrlConfig from "../../../../../../Roblox.CoreScripts.WebApp/Roblox.CoreScripts.WebApp/js/core/http/interfaces/UrlConfig";

const URL_NOT_FOUND = "URL_NOT_FOUND";
const apiGatewayUrl = EnvironmentUrls.apiGatewayUrl ?? URL_NOT_FOUND;

const accountSecurityServiceUrl = `${apiGatewayUrl}/account-security-service`;

export enum MetricsError {
  UNKNOWN = 1,
  REQUEST_TYPE_WAS_INVALID = 2,
  INVAID_METRIC_NAME = 3,
  INVALID_METRIC_LABELS = 4,
}

export enum MetricName {
  Event2sv = "event_2sv",
  SolveTime2sv = "solve_time_2sv",
  EventCaptcha = "event_captcha",
  SolveTimeCaptcha = "solve_time_captcha",
  EventPow = "event_pow",
  PuzzleComputeTimePow = "puzzle_compute_time_pow",
  SolveTimePow = "solve_time_pow",
}

export type Metric =
  | {
      name: MetricName.Event2sv;
      value: number;
      labelValues: {
        // eslint-disable-next-line camelcase
        action_type: string;
        // eslint-disable-next-line camelcase
        event_type: string;
        // `application_type` is the app type of the client
        // such as iOS, Android, etc.
        // eslint-disable-next-line camelcase
        application_type: string;
      };
    }
  | {
      name: MetricName.SolveTime2sv;
      value: number;
      labelValues: {
        // eslint-disable-next-line camelcase
        action_type: string;
        // eslint-disable-next-line camelcase
        event_type: string;
        // `application_type` is the app type of the client
        // such as iOS, Android, etc.
        // eslint-disable-next-line camelcase
        application_type: string;
      };
    }
  | {
      name: MetricName.EventCaptcha;
      value: number;
      labelValues: {
        // eslint-disable-next-line camelcase
        action_type: string;
        // eslint-disable-next-line camelcase
        event_type: string;
        // `application_type` is the app type of the client
        // such as iOS, Android, etc.
        // eslint-disable-next-line camelcase
        application_type: string;
        // eslint-disable-next-line camelcase
        version: string;
      };
    }
  | {
      name: MetricName.SolveTimeCaptcha;
      value: number;
      labelValues: {
        // eslint-disable-next-line camelcase
        action_type: string;
        // eslint-disable-next-line camelcase
        event_type: string;
        // `application_type` is the app type of the client
        // such as iOS, Android, etc.
        // eslint-disable-next-line camelcase
        application_type: string;
        // eslint-disable-next-line camelcase
        version: string;
      };
    }
  | {
      name: MetricName.EventPow;
      value: number;
      labelValues: {
        // eslint-disable-next-line camelcase
        event_type: string;
        // `application_type` is the app type of the client
        // such as iOS, Android, etc.
        // eslint-disable-next-line camelcase
        application_type: string;
      };
    }
  | {
      name: MetricName.PuzzleComputeTimePow;
      value: number;
      labelValues: {
        // eslint-disable-next-line camelcase
        event_type: string;
        // `application_type` is the app type of the client
        // such as iOS, Android, etc.
        // eslint-disable-next-line camelcase
        application_type: string;
      };
    }
  | {
      name: MetricName.SolveTimePow;
      value: number;
      labelValues: {
        // eslint-disable-next-line camelcase
        event_type: string;
        // `application_type` is the app type of the client
        // such as iOS, Android, etc.
        // eslint-disable-next-line camelcase
        application_type: string;
      };
    };

/**
 * Request Type: `POST`.
 */
export const RECORD_METRICS_CONFIG: UrlConfig = {
  withCredentials: true,
  url: `${accountSecurityServiceUrl}/v1/metrics/record`,
  timeout: 10000,
};
