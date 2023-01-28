import React, { useState, useEffect, useMemo } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";
import thumbnailService from "../../../../ts/2d/services/thumbnail2d";
import { ThumbnailRequester } from "../../../../ts/2d/util/thumbnailRequester";
import { ThumbnailBatchHandler } from "../../../../ts/2d/util/thumbnailHandler";
import { ThumbnailStates } from "../../../../ts/2d/constants/thumbnail2dConstant";
import Thumbnail from "../components/Thumbnail";

const customThumbnailRequester = new ThumbnailRequester(
  (item) => item.targetId,
  () => "customThumbnailRequester"
);

function Thumbnail2dContainer({
  type,
  targetId,
  token,
  size,
  imgClassName,
  containerClass,
  format,
  altName,
  onLoad,
  getThumbnail,
}) {
  const [thumbnailStatus, setImageStatus] = useState(null);
  const [thumbnailUrl, setImageUrl] = useState(null);
  const errorIconClass = ClassNames(
    thumbnailService.getCssClass(thumbnailStatus)
  );
  const [shimmerClass, setShimmerClass] = useState("shimmer");

  const customHandler = useMemo(
    () =>
      new ThumbnailBatchHandler(
        () =>
          new Promise((resolve, reject) => {
            getThumbnail()
              .then((response) => {
                resolve({ data: { data: [{ ...response.data, targetId }] } });
              })
              .catch(reject);
          }),
        (responseItem) => responseItem.targetId,
        (requestItem) => requestItem.key,
        (responseItem) => responseItem.state !== ThumbnailStates.pending,
        (responseItem) => ({ thumbnail: responseItem })
      ),
    [targetId, getThumbnail]
  );

  useEffect(() => {
    setShimmerClass("shimmer");
    setImageStatus(null);
    setImageUrl(null);

    let isUnmounted = false;
    let requestThumbnail = thumbnailService.getThumbnailImage(
      type,
      size,
      format,
      targetId,
      token
    );
    if (getThumbnail) {
      requestThumbnail = customThumbnailRequester.processThumbnailBatchRequest(
        { targetId },
        (items) => customHandler.handle(items)
      );
    }

    requestThumbnail
      .then(({ thumbnail: { state, imageUrl } }) => {
        if (!isUnmounted) {
          setImageStatus(state);
          setImageUrl(imageUrl);
          setShimmerClass("");
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.debug(err);
        if (!isUnmounted) {
          setShimmerClass("");
        }
      });

    return () => {
      isUnmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, targetId, token, size, imgClassName, getThumbnail]);

  return (
    <Thumbnail
      {...{
        thumbnailUrl,
        errorIconClass,
        imgClassName,
        altName,
        onLoad,
        containerClass: ClassNames(shimmerClass, containerClass),
      }}
    />
  );
}
Thumbnail2dContainer.defaultProps = {
  targetId: 0,
  token: "",
  size: "150x150",
  imgClassName: "",
  containerClass: "",
  format: "png",
  altName: "",
  onLoad: () => {},
  getThumbnail: null,
};

Thumbnail2dContainer.propTypes = {
  type: PropTypes.string.isRequired,
  targetId: PropTypes.number,
  token: PropTypes.string,
  size: PropTypes.string,
  format: PropTypes.string,
  imgClassName: PropTypes.string,
  containerClass: PropTypes.string,
  altName: PropTypes.string,
  onLoad: PropTypes.func,
  getThumbnail: PropTypes.func,
};

export default Thumbnail2dContainer;
