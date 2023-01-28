import React, { useState, useEffect } from "react";
import { Loading, Button } from "react-style-guide";
import { createItemPurchase } from "roblox-item-purchase";
import { TranslateFunction, withTranslations } from "react-utilities";
import { authenticatedUser } from "header-scripts";
import {
  Thumbnail2d,
  ThumbnailTypes,
  DefaultThumbnailSize,
  ThumbnailFormat,
} from "roblox-thumbnails";
import {
  TPlayabilityStatus,
  TPlayabilityStatuses,
  TGetProductInfo,
  TGetProductDetails,
  TShowAgeVerificationOverlayResponse,
} from "../types/playButtonTypes";
import playButtonService from "../services/playButtonService";
import playButtonConstants from "../constants/playButtonConstants";
import {
  launchGame,
  launchLogin,
  startVerificationFlow,
  startVoiceOptInOverlayFlow,
} from "../utils/playButtonUtils";
import playButtonTranslationConfig from "../../../../translation.config";

const [ItemPurchase, itemPurchaseService] = createItemPurchase();
const { PlayabilityStatus } = playButtonConstants;

export type TPurchaseButtonProps = {
  universeId: string;
  placeId: string;
  iconClassName?: string;
  refetchPlayabilityStatus: () => void;
};

export const PurchaseButton = ({
  translate,
  universeId,
  placeId,
  iconClassName = "icon-robux-white",
  refetchPlayabilityStatus,
}: TPurchaseButtonProps & {
  translate: TranslateFunction;
}): JSX.Element => {
  const [productInfo, setProductInfo] = useState<TGetProductInfo | undefined>(
    undefined
  );
  const [productDetails, setProductDetails] = useState<
    TGetProductDetails | undefined
  >(undefined);

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await playButtonService.getProductInfo([universeId]);
        setProductInfo(response);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchProductDetails = async () => {
      try {
        const response = await playButtonService.getProductDetails([placeId]);
        setProductDetails(response);
      } catch (e) {
        console.log(e);
      }
    };

    // eslint-disable-next-line no-void
    void fetchProductInfo();
    // eslint-disable-next-line no-void
    void fetchProductDetails();
  }, []);

  if (productInfo === undefined || productDetails === undefined) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <Button
        data-testid="play-purchase-button"
        className="btn-full-width btn-common-play-game-lg"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          itemPurchaseService.start();
        }}
      >
        <span className={iconClassName} />
        <span className="btn-text">{productInfo.price}</span>{" "}
      </Button>
      <ItemPurchase
        {...{
          translate,
          productId: productInfo.productId,
          expectedPrice: productInfo.price,
          thumbnail: (
            <Thumbnail2d
              type={ThumbnailTypes.gameIcon}
              size={DefaultThumbnailSize}
              targetId={parseInt(universeId, 10)}
              imgClassName="game-card-thumb"
              format={ThumbnailFormat.jpeg}
            />
          ),
          assetName: productDetails.name,
          assetType: "Place",
          sellerName: productDetails.builder,
          expectedCurrency: 1,
          expectedSellerId: productInfo.sellerId,
          onPurchaseSuccess: refetchPlayabilityStatus,
          isPlace: true,
        }}
      />
    </React.Fragment>
  );
};

export const WithTranslationPurchaseButton =
  withTranslations<TPurchaseButtonProps>(
    PurchaseButton,
    playButtonTranslationConfig
  );

const getShowIdentityVerificationFlow = async (
  universeId: string
): Promise<TShowAgeVerificationOverlayResponse> => {
  if (!authenticatedUser.isAuthenticated) {
    return {
      showAgeVerificationOverlay: false,
      showVoiceOptInOverlay: false,
      requireExplicitVoiceConsent: true,
      useExitBetaLanguage: false,
    };
  }
  const {
    playButtonOverlayWebFlag,
    voiceOptInWebFlag,
    requireExplicitVoiceConsent,
    useExitBetaLanguage,
  } = await playButtonService.getGuacPlayButtonUI();
  if (!playButtonOverlayWebFlag && !voiceOptInWebFlag) {
    return {
      showAgeVerificationOverlay: false,
      showVoiceOptInOverlay: false,
      requireExplicitVoiceConsent,
      useExitBetaLanguage,
    };
  }
  const { showAgeVerificationOverlay, showVoiceOptInOverlay } =
    await playButtonService.getShowAgeVerificationOverlay(universeId);
  return {
    showAgeVerificationOverlay:
      playButtonOverlayWebFlag && showAgeVerificationOverlay,
    showVoiceOptInOverlay: voiceOptInWebFlag && showVoiceOptInOverlay,
    requireExplicitVoiceConsent,
    useExitBetaLanguage,
  };
};

export type TPlayButtonProps = {
  universeId: string;
  placeId: string;
  rootPlaceId?: string;
  privateServerLinkCode?: string;
  gameInstanceId?: string;
  iconClassName?: string;
  eventProperties?: Record<string, string | number | undefined>;
  status:
    | TPlayabilityStatuses["Playable"]
    | TPlayabilityStatuses["GuestProhibited"];
};

export const PlayButton = ({
  universeId,
  placeId,
  rootPlaceId,
  privateServerLinkCode,
  gameInstanceId,
  status,
  eventProperties = {},
  iconClassName = "icon-common-play",
}: TPlayButtonProps): JSX.Element => {
  const [showVerification, setShowVerification] = useState<boolean | undefined>(
    undefined
  );
  const [showVoiceOptIn, setShowVoiceOptIn] = useState<boolean | undefined>(
    undefined
  );
  const [requireExplicitVoiceConsent, setRequireExplicitVoiceConsent] =
    useState<boolean | undefined>(undefined);
  const [useExitBetaLanguage, setUseExitBetaLanguage] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    const fetchShowIdentityVerificationFlow = async () => {
      try {
        const showIdentityVerificationFlow =
          await getShowIdentityVerificationFlow(universeId);
        setShowVerification(
          showIdentityVerificationFlow.showAgeVerificationOverlay
        );
        setShowVoiceOptIn(showIdentityVerificationFlow.showVoiceOptInOverlay);
        setRequireExplicitVoiceConsent(
          showIdentityVerificationFlow.requireExplicitVoiceConsent
        );
        setUseExitBetaLanguage(
          showIdentityVerificationFlow.useExitBetaLanguage
        );
      } catch (e) {
        console.error(e);
        setShowVerification(false);
        setShowVoiceOptIn(false);
        setUseExitBetaLanguage(false);
      }
    };

    // eslint-disable-next-line no-void
    void fetchShowIdentityVerificationFlow();
  }, []);

  if (showVerification === undefined) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <Button
        data-testid="play-button"
        className="btn-full-width btn-common-play-game-lg"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (status === PlayabilityStatus.Playable) {
            if (showVerification) {
              const [_, didVerifyAge] = await startVerificationFlow();
              if (didVerifyAge) {
                setShowVerification(false);
              }
            } else if (showVoiceOptIn) {
              const success = await startVoiceOptInOverlayFlow(
                requireExplicitVoiceConsent ?? true,
                useExitBetaLanguage ?? false
              );
              if (success) {
                setShowVoiceOptIn(false);
              }
            }
            launchGame(
              placeId,
              rootPlaceId,
              privateServerLinkCode,
              gameInstanceId,
              eventProperties
            );
          } else if (status === PlayabilityStatus.GuestProhibited) {
            launchLogin(placeId);
          }
        }}
      >
        <span className={iconClassName} />
      </Button>
      <div id="id-verification-container" />
    </React.Fragment>
  );
};

export type TErrorProps = {
  playabilityStatus: Exclude<
    TPlayabilityStatus,
    | TPlayabilityStatuses["Playable"]
    | TPlayabilityStatuses["GuestProhibited"]
    | TPlayabilityStatuses["PurchaseRequired"]
  >;
};

export const Error = ({
  translate,
  playabilityStatus,
}: TErrorProps & {
  translate: TranslateFunction;
}): JSX.Element => (
  <span data-testid="play-error" className="error-message">
    {translate(playButtonConstants.playButtonTranslationMap[playabilityStatus])}
  </span>
);

export const WithTranslationError = withTranslations<TErrorProps>(
  Error,
  playButtonTranslationConfig
);

export type TDefaultPlayButtonProps = {
  placeId: string;
  rootPlaceId?: string;
  universeId: string;
  privateServerLinkCode?: string;
  gameInstanceId?: string;
  refetchPlayabilityStatus: () => Promise<void>;
  playabilityStatus: TPlayabilityStatus | undefined;
  eventProperties?: Record<string, number | string | undefined>;
};

export const DefaultPlayButton = ({
  placeId,
  rootPlaceId,
  universeId,
  privateServerLinkCode,
  gameInstanceId,
  refetchPlayabilityStatus,
  playabilityStatus,
  eventProperties = {},
}: TDefaultPlayButtonProps): JSX.Element => {
  switch (playabilityStatus) {
    case undefined:
      return <Loading />;
    case PlayabilityStatus.Playable:
    case PlayabilityStatus.GuestProhibited:
      return (
        <PlayButton
          universeId={universeId}
          placeId={placeId}
          rootPlaceId={rootPlaceId}
          privateServerLinkCode={privateServerLinkCode}
          gameInstanceId={gameInstanceId}
          status={playabilityStatus}
          eventProperties={eventProperties}
        />
      );
    case PlayabilityStatus.PurchaseRequired:
      return (
        <WithTranslationPurchaseButton
          refetchPlayabilityStatus={refetchPlayabilityStatus}
          universeId={universeId}
          placeId={placeId}
        />
      );
    default:
      return <WithTranslationError playabilityStatus={playabilityStatus} />;
  }
};
