import {
  BatchRequestFactory,
  BatchItemProcessor,
  BatchRequestProperties,
  BatchRequestProcessor,
} from "core-utilities";
import { metricsService } from "core-roblox-utilities";
import thumbnailMetaData from "../services/thumbnailMetaData";
import thumbnailUtil from "./thumbnailUtil";
import {
  ThumbnailTypes,
  DefaultBatchSize,
  ThumbnailCooldown,
  BatchRequestError,
  ThumbnailRequesters,
  ThumbnailDataItem,
  FeatureName,
  LoadFailureName,
  LoadSuccessMetricsType,
  LoadSuccessName,
  LoadRetrySuccessName,
  LoadFailureMetricsType,
  RetryPerThumbnailType,
  MetaData,
  ThumbnailQueueItem,
  CustomThumbnailQueueItem,
  Thumbnail,
} from "../constants/thumbnail2dConstant";

const { getThumbnailMetaData } = thumbnailMetaData;
const { getCachePropertiesFromMetaData, shouldLogMetrics } = thumbnailUtil;

export class ThumbnailRequester<QueueItem> {
  private batchRequestFactory: BatchRequestFactory<
    QueueItem,
    ThumbnailDataItem
  >;

  private thumbnailProcessorKeySerializer: (item: QueueItem) => string;

  private thumbnailItemIdSerializer: (item: QueueItem) => string;

  private thumbnailRequesters: ThumbnailRequesters<
    QueueItem,
    ThumbnailDataItem
  > = {};

  constructor(
    thumbnailItemIdSerializer: (item: QueueItem) => string,
    thumbnailProcessorKeySerializer: (item: QueueItem) => string
  ) {
    this.batchRequestFactory = new BatchRequestFactory<
      QueueItem,
      ThumbnailDataItem
    >();
    this.thumbnailItemIdSerializer = thumbnailItemIdSerializer;
    this.thumbnailProcessorKeySerializer = thumbnailProcessorKeySerializer;
  }

  getThumbnailRequesterProperties(metaData?: MetaData): BatchRequestProperties {
    if (!metaData)
      return {
        getFailureCooldown:
          this.batchRequestFactory.createExponentialBackoffCooldown(
            ThumbnailCooldown.minCooldown,
            ThumbnailCooldown.maxCooldown
          ),
        maxRetryAttempts: ThumbnailCooldown.maxRetryAttempts,
        batchSize: DefaultBatchSize,
        debugMode: true,
      };
    return {
      getFailureCooldown:
        this.batchRequestFactory.createExponentialBackoffCooldown(
          metaData.requestMinCooldown,
          metaData.requestMaxCooldown
        ),
      maxRetryAttempts: metaData.requestMaxRetryAttempts,
      batchSize: metaData.requestBatchSize,
      concurrentRequestCount: metaData.concurrentThumbnailRequestCount,
      debugMode: true,
    };
  }

  getThumbnailRequester(
    thumbnailRequestProcessor: BatchItemProcessor<QueueItem>,
    thumbnailRequesterKey: string,
    metaData?: MetaData
  ): BatchRequestProcessor<QueueItem, ThumbnailDataItem> {
    if (thumbnailRequesterKey in this.thumbnailRequesters) {
      return this.thumbnailRequesters[thumbnailRequesterKey];
    }
    const processor = this.batchRequestFactory.createRequestProcessor(
      thumbnailRequestProcessor,
      (item) => this.thumbnailItemIdSerializer(item),
      this.getThumbnailRequesterProperties(metaData)
    );
    this.thumbnailRequesters[thumbnailRequesterKey] = processor;
    return processor;
  }

  processThumbnailBatchRequest(
    item: QueueItem & { type: string },
    thumbnailRequestProcessor: BatchItemProcessor<QueueItem>,
    thumbnailRequesterKey: string = this.thumbnailProcessorKeySerializer(item),
    clearCachedValue?: boolean
  ): Promise<ThumbnailDataItem> {
    const { type = "custom" } = item;
    const metaData = getThumbnailMetaData();
    const batchRequester = this.getThumbnailRequester(
      thumbnailRequestProcessor,
      thumbnailRequesterKey,
      metaData
    );
    if (clearCachedValue) {
      batchRequester.invalidateItem(item);
    }

    const cacheProperties = getCachePropertiesFromMetaData(metaData);
    return batchRequester
      .queueItem(item, undefined, cacheProperties)
      .then((data: ThumbnailDataItem) => {
        if (metricsService && data.performance && shouldLogMetrics(metaData)) {
          const {
            performance: { duration, retryAttempts },
          } = data;
          if (retryAttempts > 0) {
            // log load success with retry
            metricsService
              .logMeasurement({
                featureName: FeatureName,
                measureName: LoadRetrySuccessName,
                metricsType: LoadSuccessMetricsType,
                excludeCountry: true,
                value: duration,
              })
              // eslint-disable-next-line no-console
              .catch(console.debug);

            // log retry attempts by type
            metricsService
              .logMeasurement({
                featureName: FeatureName,
                measureName: `${type}_${RetryPerThumbnailType}`,
                metricsType: LoadSuccessMetricsType,
                excludeCountry: true,
                value: retryAttempts,
              })
              // eslint-disable-next-line no-console
              .catch(console.debug);
          } else {
            // load success without retry
            metricsService
              .logMeasurement({
                featureName: FeatureName,
                measureName: LoadSuccessName,
                metricsType: LoadSuccessMetricsType,
                excludeCountry: true,
                value: duration,
              })
              // eslint-disable-next-line no-console
              .catch(console.debug);
          }
        }
        return data;
      })
      .catch((error: BatchRequestError) => {
        // eslint-disable-next-line no-console
        console.debug({ error });
        if (
          metricsService &&
          shouldLogMetrics(metaData) &&
          error === BatchRequestError.maxAttemptsReached
        ) {
          metricsService
            .logMeasurement({
              featureName: FeatureName,
              measureName: LoadFailureName,
              metricsType: LoadFailureMetricsType,
              excludeCountry: true,
            })
            // eslint-disable-next-line no-console
            .catch(console.debug);
        }

        // chain the rejection so that other listeners get triggered.
        return Promise.reject(error);
      });
  }
}

function defaultThumbnailProcessorKeySerializer({
  targetId = 0,
  token,
  type,
  size,
  format,
  isCircular,
}: ThumbnailQueueItem): string {
  return `${targetId.toString()}:${token}:${type}:${size}:${format}:${
    isCircular ? "circular" : "regular"
  }`;
}

export default {
  defaultThumbnailRequester: new ThumbnailRequester<ThumbnailQueueItem>(
    (item: ThumbnailQueueItem) => {
      const { type, targetId = 0 } = item;
      if (
        type === ThumbnailTypes.universeThumbnail ||
        type === ThumbnailTypes.universeThumbnails
      ) {
        return targetId.toString();
      }
      return defaultThumbnailProcessorKeySerializer(item);
    },
    defaultThumbnailProcessorKeySerializer
  ),
  customThumbnailRequester: new ThumbnailRequester<CustomThumbnailQueueItem>(
    (item: CustomThumbnailQueueItem) => item.key,
    () => "customThumbnailRequester"
  ),
};
