import {
    ThumbnailStates,
    DefaultThumbnailSize,
    DefaultThumbnailFormat
} from '../../../../ts/2d/constants/thumbnail2dConstant';
import thumbnailsModule from '../thumbnailsModule';

function twoDThumbnailController($scope, thumbnailService) {
    'ngInject';

    const ctrl = this;
    let lastThumbnail = '';
    const thumbnailStates = ThumbnailStates;

    ctrl.getCssClasses = () => {
        if (ctrl.isThumbnailRequestSending) {
            return 'shimmer';
        }
        return thumbnailService.getCssClass(ctrl.thumbnailState);
    };

    ctrl.setThumbnailLoadFailed = function() {
        // TODO: Get design approval
        // ctrl.thumbnailState = thumbnailStates.error;
        // ctrl.thumbnailUrl = null;
        // $scope.$digest();
    };

    ctrl.isLazyLoadingEnabled = function() {
        return ctrl.thumbnailOptions && ctrl.thumbnailOptions.isLazyLoading;
    };

    const init = function() {
        const debounceKey = `${ctrl.thumbnailType}:${ctrl.thumbnailTargetId}`;

        if (lastThumbnail === debounceKey) {
            return;
        }

        lastThumbnail = debounceKey;
        ctrl.thumbnailState = thumbnailStates.loading;

        const thumbnailSize = ctrl.thumbnailOptions ? .size || DefaultThumbnailSize;
        const thumbnailFormat = ctrl.thumbnailOptions ? .format || DefaultThumbnailFormat;
        ctrl.isThumbnailRequestSending = true;
        thumbnailService
            .getThumbnailImage(ctrl.thumbnailType, ctrl.thumbnailTargetId, thumbnailSize, thumbnailFormat)
            .then(({
                thumbnail: {
                    state,
                    imageUrl
                },
                performance
            }) => {
                ctrl.thumbnailState = state;
                ctrl.thumbnailUrl = imageUrl;
                if (ctrl.onSuccess) {
                    ctrl.onSuccess(performance);
                }
            })
            .catch(error => {
                ctrl.thumbnailState = thumbnailStates.error;
                if (ctrl.onFailure) {
                    ctrl.onFailure(error);
                }
            })
            .finally(() => {
                ctrl.isThumbnailRequestSending = false;
            });
    };

    ctrl.$onInit = init;
    ctrl.$onChanges = init;
}

thumbnailsModule.controller('2dThumbnailController', twoDThumbnailController);

export default twoDThumbnailController;