// NOTE(jcountryman, 11/17/22): Future versions of @rbx/core has code
// incompatible with IE11. Please do not bump the version of this package.
// eslint-disable-next-line no-restricted-imports
import {
  regex,
  uuidService,
  PagingParameters,
  PagerError,
  PageResponse,
  SortOrder,
  CursorPager as CoreCursorPager,
} from "@rbx/core";
import accessibility from "./utils/accessibility/accessibility";
import batchRequestFactory, {
  BatchRequestFactory,
} from "./services/batchRequestService/batchRequestFactory";

import clipboard from "./utils/clipboard/clipboard";
import cursorPaginationConstants from "./cursorPagination/cursorPaginationConstants";
import CursorPager from "./cursorPagination/CursorPager";
import dateService from "./services/dateService";
import defer from "./utils/deferred";
import { getCurrentBrowser } from "./utils/getCurrentBrowser";
import downloadFile from "./utils/downloadFile";
import {
  httpRequestMethods,
  httpResponseCodes,
  httpService,
} from "./http/http";
import ListFilterProvider from "./utils/ListFilterProvider";
import PaginationCache from "./cursorPagination/PaginationCache";
import pageName from "./pageNames/pageNameProvider";
import ready from "./utils/ready";
import urlService from "./services/urlService";
import abbreviateNumber from "./utils/abbreviate/abbreviateNumber";
import quote from "./utils/textFormat/quote";
import concatTexts from "./utils/textFormat/concatTexts";
import numberFormat from "./utils/numberFormat/numberFormat";
import seoName from "./utils/seo/seoName";
import escapeHtml from "./utils/escapeHtml";

window.CoreUtilities = {
  abbreviateNumber,
  accessibility,
  BatchRequestFactory,
  batchRequestFactory, // deprecated remove after rollout
  clipboard,
  concatTexts,
  CoreCursorPager,
  CursorPager,
  cursorPaginationConstants,
  dateService,
  defer,
  downloadFile,
  escapeHtml,
  getCurrentBrowser,
  httpRequestMethods,
  httpResponseCodes,
  httpService,
  ListFilterProvider,
  numberFormat,
  pageName,
  PagerError,
  PageResponse,
  PaginationCache,
  PagingParameters,
  quote,
  ready,
  regex,
  seoName,
  SortOrder,
  urlService,
  uuidService,
};
