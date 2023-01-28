import { ExperimentationService } from "Roblox";
import { UpsellExpMetadata } from "../../constants/serviceTypeDefinitions";

export default async function fetchExperimentVariant(
  experimentMetadataStr: string | undefined
): Promise<boolean> {
  let upsellExpMetadata: UpsellExpMetadata;
  if (!experimentMetadataStr) {
    return false;
  }
  try {
    upsellExpMetadata = JSON.parse(experimentMetadataStr) as UpsellExpMetadata;
  } catch (e) {
    return false;
  }

  try {
    const experimentalVariants =
      (await ExperimentationService.getAllValuesForLayer(
        upsellExpMetadata.LayerName
      )) as {
        [p: string]: boolean;
      };
    const variantValue: boolean | undefined | null =
      experimentalVariants[upsellExpMetadata.Parameter];
    return variantValue ?? false;
  } catch (e) {
    return false;
  }
}
