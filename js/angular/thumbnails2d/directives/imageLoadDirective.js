import thumbnailsModule from "../thumbnailsModule";

function imageLoad() {
  "ngInject";

  return {
    restrict: "A",
    link: (scope, element) => {
      element.bind("load", () => {
        scope.$evalAsync(() => {
          scope.isLoaded = true;
        });
      });
    },
  };
}

thumbnailsModule.directive("imageLoad", imageLoad);

export default imageLoad;
