import { ItemPurchaseAjaxDataObject } from "../../constants/serviceTypeDefinitions";

export const isCurrentUserInExpAllowList = (
  itemPurchaseAjaxData?: ItemPurchaseAjaxDataObject
): boolean =>
  itemPurchaseAjaxData?.gamePassUpsellExperimentBypass?.toLowerCase() ===
    "true" ||
  itemPurchaseAjaxData?.bundleItemUpsellExperimentBypass?.toLowerCase() ===
    "true";

export const isUpsellExperimentEnabled = (
  itemPurchaseAjaxData?: ItemPurchaseAjaxDataObject
): boolean =>
  itemPurchaseAjaxData?.isCatalogUpsellExperimentEnabled?.toLowerCase() ===
    "true" ||
  itemPurchaseAjaxData?.isGamePassUpsellExperimentEnabled?.toLowerCase() ===
    "true" ||
  itemPurchaseAjaxData?.isBundleItemUpsellExperimentEnabled?.toLowerCase() ===
    "true";

export const isUpsellExperimentMetadataGiven = (
  itemPurchaseAjaxData?: ItemPurchaseAjaxDataObject
): boolean =>
  !!itemPurchaseAjaxData?.catalogUpsellExperimentSerializedMetadata ||
  !!itemPurchaseAjaxData?.gamePassUpsellExperimentSerializedMetadata ||
  !!itemPurchaseAjaxData?.bundleItemUpsellExperimentSerializedMetadata;

export const upsellExperimentMetadata = (
  itemPurchaseAjaxData?: ItemPurchaseAjaxDataObject
): string | undefined =>
  itemPurchaseAjaxData?.catalogUpsellExperimentSerializedMetadata ||
  itemPurchaseAjaxData?.gamePassUpsellExperimentSerializedMetadata ||
  itemPurchaseAjaxData?.bundleItemUpsellExperimentSerializedMetadata;
