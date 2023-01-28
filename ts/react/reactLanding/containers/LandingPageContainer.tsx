import React, { useState, useEffect } from "react";
import { createModal } from "react-style-guide";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { landingTranslationConfig } from "../translation.config";
import ActionBar from "../components/ActionBar";
import SignupHeader from "../components/SignupHeader";
import SignupFormContainer from "./SignupFormContainer";
import CountryRatingLogos from "../components/CountryRatingLogos";
import AppStoreContainer from "../components/AppStoreContainer";
import { getContentRatingLogoPolicy } from "../services/landingService";
import { sendAppClickEvent } from "../services/eventService";
import {
  urlConstants,
  landingPageStrings,
} from "../constants/landingConstants";

export const LandingPageContainer = ({
  translate,
}: WithTranslationsProps): JSX.Element => {
  const [shouldDisplayBrazilRatingLogo, setShouldDisplayBrazilRatingLogo] =
    useState(false);
  const [shouldDisplayItalyRatingLogo, setShouldDisplayItalyRatingLogo] =
    useState(false);
  const [ContentRatingModal, modalService] = createModal();

  const handleContentRatingModalAction = (): void => {
    let ratingGuideUrl = "";
    if (shouldDisplayBrazilRatingLogo) {
      ratingGuideUrl = urlConstants.brazilContentRatingGuide;
    } else if (shouldDisplayItalyRatingLogo) {
      ratingGuideUrl = urlConstants.italyContentRatingGuide;
    }
    window.open(ratingGuideUrl, "_blank");
  };

  const handleContentRatingLogoPolicy = async () => {
    const contentRatingLogoPolicy = await getContentRatingLogoPolicy();
    if (contentRatingLogoPolicy) {
      setShouldDisplayBrazilRatingLogo(
        contentRatingLogoPolicy.displayBrazilRatingLogo
      );
      setShouldDisplayItalyRatingLogo(
        contentRatingLogoPolicy.displayItalyRatingLogo
      );
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-void
    void handleContentRatingLogoPolicy();
  }, []);

  return (
    <div id="landing-page-container dark-theme">
      <section
        className="row full-height-section rollercoaster-background"
        id="RollerContainer"
      >
        <div
          className="col-md-12 inner-full-height-section"
          id="InnerRollerContainer"
        >
          <ActionBar />
          <div
            className={`${
              shouldDisplayBrazilRatingLogo || shouldDisplayItalyRatingLogo
                ? "lower-logo-container-with-content-rating-logo"
                : ""
            } lower-logo-container`}
          >
            <div id="signup-container">
              <SignupHeader />
              <SignupFormContainer />
              <CountryRatingLogos
                shouldDisplayBrazilRatingLogo={shouldDisplayBrazilRatingLogo}
                shouldDisplayItalyRatingLogo={shouldDisplayItalyRatingLogo}
                onContentRatingLogoClick={() => modalService.open()}
                translate={translate}
              />
              {(shouldDisplayBrazilRatingLogo ||
                shouldDisplayItalyRatingLogo) && (
                <ContentRatingModal
                  title={translate(landingPageStrings.leavingRoblox)}
                  body={
                    <p>
                      {translate(landingPageStrings.externalWebsiteRedirect)}
                    </p>
                  }
                  actionButtonShow
                  actionButtonText={translate(landingPageStrings.continue)}
                  neutralButtonText={translate(landingPageStrings.cancel)}
                  onNeutral={() => modalService.close()}
                  onAction={handleContentRatingModalAction}
                />
              )}
            </div>
            <AppStoreContainer
              onAppClick={sendAppClickEvent}
              translate={translate}
            />
            <div id="otp-container" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default withTranslations(LandingPageContainer, landingTranslationConfig);
