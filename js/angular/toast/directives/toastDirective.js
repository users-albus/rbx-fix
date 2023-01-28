import toastModule from "../toastModule";

function toast($timeout) {
  "ngInject";

  return {
    restrict: "A",
    replace: true,
    scope: {
      toastLayout: "=",
    },
    templateUrl: "toast",
    link: function (scope, element, attrs) {
      scope.layout = {
        isEnabled: false,
        isVisible: false,
        isNeeded: false,
        text: "",
        timeout: null,
        animationDuration: 200,
        visibilityDelay: 50,
      };
      scope.$watch(
        "toastLayout.isNeeded",
        function (newValue, oldValue) {
          if (newValue !== oldValue && newValue && !scope.layout.timeout) {
            scope.layout.text = scope.toastLayout.text;
            scope.layout.isEnabled = newValue;
            scope.toastLayout.isNeeded = false;
            $timeout(function () {
              scope.layout.isVisible = true;
            }, scope.layout.visibilityDelay);
            scope.layout.timeout = $timeout(function () {
              scope.layout.isVisible = false;
              $timeout(function () {
                scope.layout.isEnabled = false;
                scope.layout.timeout = null;
                scope.toastLayout.isNeeded = false;
              }, scope.layout.animationDuration);
            }, scope.toastLayout.timeout);
            scope.toastLayout.isNeeded = false;
          }
        },
        true
      );
    },
  };
}

toastModule.directive("toast", toast);

export default toast;
