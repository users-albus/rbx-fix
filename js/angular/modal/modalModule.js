import { Lang } from "Roblox";
import angular from "angular";

const modal = angular
  .module("modal", ["ui.bootstrap", "modalHtmlTemplate"])
  .config([
    "$uibModalProvider",
    "$injector",
    ($uibModalProvider, $injector) => {
      $uibModalProvider.options.openedClass = "modal-open-noscroll";
      $uibModalProvider.options.animation = false;
      if (Lang && Lang.ControlsResources) {
        const languageResourceProvider = $injector.get(
          "languageResourceProvider"
        );
        languageResourceProvider.setLanguageKeysFromFile(
          Lang.ControlsResources
        );
      }
    },
  ])
  .run([
    "modalOptions",
    "$uibModalStack",
    "$rootScope",
    (modalOptions, $uibModalStack, $rootScope) => {
      const bindMousedownEventPerEachModal = $rootScope.$watch(
        () => {
          return document.querySelectorAll(
            modalOptions.layoutParams.modalSelector
          ).length;
        },
        (val) => {
          if (val > 0) {
            if (window.NodeList && !NodeList.prototype.forEach) {
              NodeList.prototype.forEach = Array.prototype.forEach;
            }
            document
              .querySelectorAll(modalOptions.layoutParams.modalSelector)
              .forEach((eachModal) => {
                const topModal = $uibModalStack.getTop();
                if (
                  topModal &&
                  topModal.value.backdrop !== modalOptions.backdropStatus.static
                ) {
                  eachModal.addEventListener(
                    modalOptions.userInteraction.mouseDown,
                    (e) => {
                      if (
                        e.button === modalOptions.mainButtonPressed &&
                        $uibModalStack.getTop().key
                      ) {
                        // bind mouse down event and only dismiss when click happens
                        $uibModalStack.getTop().key.dismiss();
                      }
                    }
                  );
                  eachModal
                    .querySelector(
                      modalOptions.layoutParams.modalContentSelector
                    )
                    .addEventListener(
                      modalOptions.userInteraction.mouseDown,
                      (e) => {
                        e.stopPropagation();
                      }
                    );
                }
              });

            if ($uibModalStack.getTop()) {
              $uibModalStack.getTop().value.backdrop =
                modalOptions.backdropStatus.static; // disable dismiss
            }
          }
        }
      );
      $rootScope.$on("$destroy", () => {
        bindMousedownEventPerEachModal();
      });
    },
  ]);

export default modal;
