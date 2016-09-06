/**********************************************************************************************/
/* Module Definition - directives                                                             */
/**********************************************************************************************/

//var buildNumber = configuration.BuildNumber;

angular.module('Clientele.Directives', ['Clientele.Directives.FormFields'])
    .directive('applicationMode', function (runningMode) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            template: runningMode == "Production" ? '<div class="alert-info well-sm" align="center">You are currently in ' + runningMode + ' Mode</div>' : '<div class="alert-danger well-sm" align="center">You are currently in ' + runningMode + ' Mode</div>'
        };
    })
    .directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined
                    if (inputValue == undefined) return '';
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    })
    .directive('dropdown', function ($compile) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'A',
            replace: false,
            transclude: true,
            template: '<ui-select ng-model="dropdownModel.selectedItem">' +
                '<ui-select-match placeholder="Select">{{$select.selected.Text}}</ui-select-match>' +
                '<ui-select-choices repeat="item in dropdownModel.options | filter: $select.search">' +
                '<div ng-bind-html="item.Text | highlight: $select.search"></div>' +
                '</ui-select-choices>' +
                '</ui-select>',
            priority: 1000,
            scope: {
                dropdownModel: '=',
            },
            link: link
        };
    })
    .directive('multipledropdown', function ($compile) {

        function link(scope, element, attrs) {
            var placeholder = attrs.placeholder;
            if (placeholder != undefined && placeholder.length > 0) {
                scope.defaultText = placeholder;
            } else {
                scope.defaultText = "Select";
            }

        }

        return {
            restrict: 'A',
            replace: false,
            transclude: true,
            template: '<ui-select multiple ng-model="dropdownModel.selectedItems" style="width:300px;" on-remove="removeFn({item: $item})" >' +
                '<ui-select-match placeholder="{{defaultText}}">{{$item.Text}}</ui-select-match>' +
                '<ui-select-choices repeat="item in dropdownModel.options | filter: $select.search" >' +
                '<div ng-bind-html="item.Text | highlight: $select.search"></div>' +
                '</ui-select-choices>' +
                '</ui-select>',
            priority: 1000,
            scope: {
                dropdownModel: '=',
                removeFn: '&'
            },

            link: link
        };

    })
    .directive('emptyResults', function ($compile, $parse) {
        return {
            restrict: 'AE',
            replace: false,
            terminal: true,
            priority: 1000,

            compile: function ($element) {

                $element.html("<div ng-hide='isEmpty'>" + $element.html() + "</div>");

                var emptyResultSetHtml = "<div ng-show='isEmpty'><h4>{{emptyMessage}}</h4></div>";

                $element.html(emptyResultSetHtml + $element.html());

                $element.removeAttr("empty-results"); //remove the attribute to avoid infinite loop
                $element.removeAttr("data-empty-results"); //remove the attribute to avoid infinite loop

                var checkIfEmpty = function (collection) {
                    if (collection == undefined) {
                        return true;
                    } else if (collection.length == 0) {
                        return true;
                    }
                    return false;
                }

                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {

                        if (iAttrs["emptyMessage"]) {
                            scope.emptyMessage = iAttrs["emptyMessage"];
                        }

                        if (iAttrs["emptyCollection"]) {
                            var coll = iAttrs["emptyCollection"];

                            scope.isEmpty = checkIfEmpty(eval('scope.' + coll));

                            scope.$watch(iAttrs["emptyCollection"], function () {
                                scope.isEmpty = checkIfEmpty(eval('scope.' + coll));
                            });
                        }

                    },
                    post: function postLink(scope, iElement, iAttrs, controller) {
                        $compile(iElement)(scope);
                    }
                };
            }
        };
    })
    .directive('loadingWidget', function ($compile) {
        return {
            restrict: 'AE',
            replace: false,
            terminal: true,
            priority: 1000,

            compile: function ($element) {

                $element.html("<div ng-show='showContent'>" + $element.html() + "</div>");

                var errorAndLoadHtml = "<div ng-show='loadError'>There was an error loading your content, please contact an administrator.</div>";
                errorAndLoadHtml += '<div ng-show="loading" class="row-fluid ui-corner-all" style="padding: 0 .7em;">';
                errorAndLoadHtml += '<div class="loadingContent"><p><img alt="Loading  Content" src="/Content/ajax-loader.gif" />&nbsp;{{LoadingMessage}}</p></div>';
                errorAndLoadHtml += '</div>';

                $element.html(errorAndLoadHtml + $element.html());

                $element.removeAttr("loading-widget"); //remove the attribute to avoid infinite loop
                $element.removeAttr("data-loading-widget"); //remove the attribute to avoid infinite loop

                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        var realScope = scope;

                        if (iAttrs["isInclude"]) {
                            realScope = scope.$parent;
                        }

                        realScope.showContent = false;

                        if (iAttrs["showContent"]) {
                            if (eval(iAttrs["showContent"])) {
                                realScope.showContent = true;
                            }
                        }

                        realScope.loadEmpty = false;
                        realScope.loading = false;
                        realScope.loadError = false;
                    },
                    post: function postLink(scope, iElement, iAttrs, controller) {

                        $compile(iElement)(scope);
                    }
                };
            }
        };
    })
    .directive('manualLoadingWidget', function ($compile) {
        return {
            restrict: 'AE',
            replace: false,
            terminal: true,
            priority: 1000,

            compile: function ($element) {

                $element.html("<div ng-show='manualShowContent'>" + $element.html() + "</div>");

                var errorAndLoadHtml = "<div ng-show='loadError'>There was an error loading your content, please contact an administrator.</div>";
                errorAndLoadHtml += '<div ng-show="manualLoading" class="row-fluid ui-corner-all" style="padding: 0 .7em;">';
                errorAndLoadHtml += '<div class="loadingContent"><p><img alt="Loading  Content" src="/Content/ajax-loader.gif" />&nbsp;{{LoadingMessage}}</p></div>';
                errorAndLoadHtml += '</div>';

                $element.html(errorAndLoadHtml + $element.html());

                $element.removeAttr("manual-loading-widget");

                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        var realScope = scope;

                        realScope = scope.$parent;

                        realScope.manualShowContent = false;

                        realScope.manualLoading = false;
                        realScope.loadError = false;
                    },
                    post: function postLink(scope, iElement, iAttrs, controller) {

                        $compile(iElement)(scope);
                    }
                };
            }
        };
    })
    .directive('authoriseAccess', function (authenticationService) {
        var hasAccessCheck = function (requiredClaims) {

            for (var i = 0; i < requiredClaims.length; i++) {
                if (authenticationService.HasClaim(requiredClaims[i])) {
                    return true;
                }
            }

            return false;
        };

        return {
            restrict: 'AE',
            scope: {},
            link: function ($scope, element, attrs) {

                if (attrs.claimRequired == "")
                    return;

                var claims = attrs.claimRequired.split(",");

                var hasAccess = hasAccessCheck(claims);

                if (!hasAccess) {
                    if (eval(attrs.redirect)) {
                        authenticationService.RedirectToNoAccessPage();
                        return;
                    }

                    var accessMessage = "";

                    if (!eval(attrs.suppressMessage)) {
                        accessMessage = "<b>You do not have access to " + attrs.sectionname + ", please contact an administrator.</b>";
                    }

                    element.replaceWith(accessMessage);

                    $scope.$$nextSibling.$destroy();
                }
            }
        };
    })
    .directive('unityAddressView', function () {
        return {
            restrict: 'E',
            templateUrl: "Views/UnityAddress/View.html",
            scope: {
                addressType: '=?',
                addressLine1: '=?',
                addressLine2: '=?',
                addressLine3: '=?',
                addressLine4: '=?',
                isValid: '=?',
                postalCode: '=?',
                enableEdit: '=?',
                loadEvent: '=?',
                cacheData: '=?',
                dataLoadedEmitEvent: '=?',
                overrideTemplate: '=?'
            },
            controller: 'UnityAddressViewController',
            compile: function (tElement, tAtrrs) {
                if (!angular.isUndefined(tAtrrs.overrideTemplate)) {
                    if (tAtrrs.overrideTemplate != "") {
                        if (eval(tAtrrs.overrideTemplate)) {
                            tElement.html("");
                        }
                    }
                }
            }
        };
    })
    .directive('unityBankDetailView', function () {
        return {
            restrict: 'E',
            templateUrl: 'Views/UnityBankDetails/View.html',
            scope: {
                bankAccountId: '=?',
                accountType: '=?',
                accountTypeId: '=?',
                accountName: '=?',
                accountNumber: '=?',
                bankName: '=?',
                branchCode: '=?',
                branchCodeName: '=?',
                warningHeaderMessage: "=?",
                enableEdit: '=?',
                enableEditAvsr: '=?',
                isPayable: '=?',
                loadEvent: '=?',
                cacheData: '=?',
                dataLoadedEmitEvent: '=?',
                overrideTemplate: '=?',
                checkSoftyComp: '=?',
                checkFraudster: '=?',
                checkD3: '=?',
                allowDebitsStoppedOnAccount: '=?',
                skipD3ForDebitsStoppedOnAccount: '=?'
            },
            controller: 'UnityBankDetailViewController',
            compile: function (tElement, tAtrrs) {
                if (!angular.isUndefined(tAtrrs.overrideTemplate)) {
                    if (tAtrrs.overrideTemplate !== "") {
                        if (eval(tAtrrs.overrideTemplate)) {
                            tElement.html("");
                        }
                    }
                }
            }
        };
    })
    .directive("outsideClick", [
        '$document', '$parse', function ($document, $parse) {
            return {
                link: function ($scope, $element, $attributes) {
                    var scopeExpression = $attributes.outsideClick,
                        onDocumentClick = function (event) {
                            var isChild = $element.find(event.target).length > 0;

                            if (!isChild) {
                                $scope.$apply(scopeExpression);
                            }
                        };

                    $document.on("click", onDocumentClick);

                    $element.on('$destroy', function () {
                        $document.off("click", onDocumentClick);
                    });
                }
            }
        }
    ])
    .directive('governmentDepartmentNameSelect', [
        function () {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    sourceDepartment: '='
                },
                controller: 'Clientele.Gsd.Controllers.DepartmentNameSelectController',
                template: '<div class="btn btn-default input-group-addon" ng-click="open()"><b>...</b></div>'
            }
        }
    ])
    .directive('dateValidator', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ctrl) {

                    function validate(value) {
                        var today = new Date("1900", "01", "01");

                        if (new Date(value) > today) {
                            ctrl.$setValidity('dateValidator', true);
                            return value;
                        }
                        ctrl.$setValidity('dateValidator', false);
                        return value;
                    }
                    ctrl.$parsers.unshift(validate);
                    ctrl.$formatters.unshift(validate);
                }
            };
        }
    ])

    .directive('selectValidator', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, iElement, iAttrs, ctrl) {

                    var validate = function (value) {

                        if (ctrl.$isEmpty(value)) {
                            ctrl.$setValidity('selectValidator', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('selectValidator', true);
                            return value;
                        }

                    }
                    ctrl.$parsers.unshift(validate);
                    ctrl.$formatters.unshift(validate);
                }
            };
        }
    ])
        .directive('selectKeyValueValidator', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, iElement, iAttrs, ctrl) {

                    var validate = function (value) {

                        if (value == undefined || ctrl.$isEmpty(value.Key)) {
                            ctrl.$setValidity('selectKeyValueValidator', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('selectKeyValueValidator', true);
                            return value;
                        }

                    }
                    ctrl.$parsers.unshift(validate);
                    ctrl.$formatters.unshift(validate);
                }
            };
        }
        ])

    .directive('textValidator', [
        function () {
            return {
                require: "?ngModel",
                link: function (scope, elm, attrs, ctrl) {

                    var validate = function ($value) {
                        var result = $value.length > 0;

                        if (result) {
                            ctrl.$setValidity('textValidator', true);

                            return $value;
                        }

                        ctrl.$setValidity('textValidator', false);

                        return undefined;
                    };
                    ctrl.$parsers.unshift(validate);
                    ctrl.$formatters.unshift(validate);
                }
            };
        }
    ])
    .directive('date', function (dateFilter) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {

                var dateFormat = attrs['date'] || 'yyyy-MM-dd';

                ctrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, dateFormat);
                });
            }
        };
    })
     .directive("easyModalField", function ($compile) {
         return {
             compile: function (iElement) {

                 iElement.removeAttr('easy-modal-field');

                 function getValidationDirective(validatorName) {
                     switch (validatorName) {
                         case "TextLength":
                             return "text-validator";
                         case "Date":
                             return "date-validator";
                         case "SelectValue":
                             return "select-validator";
                         case "SelectKeyValue":
                             return "select-key-value-validator";

                         default: return "";
                     }
                 }

                 return {
                     pre: function preLink(scope, iElement, iAttrs, controller) {
                         var fieldType = scope.field.Type;
                         var placeHolder = scope.field.PlaceHolder;

                         if (placeHolder == undefined) {
                             placeHolder = 'dd/MM/yyyy';
                         }

                         var validationType = getValidationDirective(scope.field.ValidationType);

                         var el;

                         if (fieldType === "ReadonlyTable") {
                             el = "";

                         } else {
                             el = "<div ng-if='field.Type != \"Hidden\"' class='form-group'>" +
                                 "<label class='col-sm-3 control-label'>{{field.DisplayName}}</label>" +
                                 "<div class='col-sm-9' ng-class='{\"has-error\": innerForm.fieldControl.$invalid || field.$Invalid}'>" +
                                 "{{fieldControl}}" +
                                 "</div>" +
                                 "</div>";
                         }

                         switch (fieldType) {
                             case "File":
                                 el = el.replace("{{fieldControl}}", "<input name='fieldControl' class='control-label' type='file' ng-file-select='onFileSelect(field,$files)'>");
                                 break;

                             case "Number":
                                 el = el.replace("{{fieldControl}}", '<input type="number" name="fieldControl" class="form-control" ng-model="field.Value">');
                                 break;

                             case "Label":
                                 el = el.replace("{{fieldControl}}", "<label class='control-label'>{{field.Value}}</label>");
                                 break;

                             case "Date":
                                 el = el.replace("{{fieldControl}}", "<input " + validationType + " name='fieldControl' type='text' placeholder='" + placeHolder + "' class='form-control input-sm' min='minDate' datepicker-popup='dd/MM/yyyy' ng-model='field.Value' close-text='Close'/>");
                                 break;

                             case "DateTime":

                                 el = el.replace("{{fieldControl}}", "<input " + validationType + " name='fieldControl' type='text' ng-change='dateChanged(field)' placeholder='dd/MM/yyyy' class='form-control input-sm' min='minDate' datepicker-popup='dd/MM/yyyy' ng-model='field.Value' close-text='Close' ></input>" +
                                      "<timepicker ng-change='dateChanged(field)' ng-model='field.Value'></timepicker>");
                                 break;

                             case "Select":
                                 el = el.replace("{{fieldControl}}", "<select " + validationType + " name='fieldControl' class='form-control input-sm' ng-model='field.Value' ng-options='option for option in field.Options'></select>");
                                 break;

                             case "SelectKeyValue":

                                 el = el.replace("{{fieldControl}}", "<ui-select " + validationType + " ng-model='field.Value' name='fieldControl' reset-search-input='true'>" +
                                     "<ui-select-match placeholder='Select'>{{$select.selected.Value}}</ui-select-match>" +
                                     "<ui-select-choices repeat='option.Key as option in field.Options | filter: $select.search'>" +
                                         "<small ng-bind-html='option.Value | highlight: $select.search'></small>" +
                                     "</ui-select-choices>" +
                                 "</ui-select>");
                                 break;

                             case "SelectTagging":

                                 el = el.replace("{{fieldControl}}", "<ui-select tagging " + validationType + " on-select='addItemToDropdown($item,$model,field)' ng-model='field.Value' name='fieldControl'>" +
                                 "<ui-select-match placeholder='Select'>{{$select.selected}}</ui-select-match>" +
                                 "<ui-select-choices repeat='option in field.Options | filter: $select.search | limitTo: 5'>" +
                                 "<small ng-bind-html='option | highlight: $select.search'></small>" +
                                 "</ui-select-choices>" +
                                 "</ui-select>");
                                 break;

                             case "TextArea":
                                 el = el.replace("{{fieldControl}}", '<textarea msd-elastic=/"\n/" ' + validationType + ' name="fieldControl" class="form-control" ng-model="field.Value">');
                                 break;

                             case "UiGrid":

                                 el = el.replace("{{fieldControl}}", ' <div id="grid1" ui-grid="field.gridOptions" ui-grid-edit class="grid"></div>');
                                 break;

                             case "ReadonlyTable":
                                 el = "<div ng-if='field.Filter != null' class='form-group'><label class='col-sm-3 control-label'>{{field.Filter.DisplayName}}</label><div class='col-sm-9'><select name='fieldControl' class='form-control input-sm' ng-model='field.SelectedFilter' ng-options='option for option in field.Filter.Options'></select></div></div>" +
                                 "<br/>" +
                                 "<div style='max-height: 420px; overflow-y: auto;'>" +
                                 "<table class='table table-condensed' style='margin-bottom:100px;'>" +
                                 "<thead>" +
                                     "<tr class='active text-muted'>" +
                                         "<th ng-repeat='column in field.Columns'>" +
                                             "<div ng-switch='column.Type'>" +
                                             "<div ng-switch-when='Hidden'></div>" +
                                             "<div ng-if='column.DisplayName == null' ng-switch-default>{{column.Name}}</div>" +
                                             "<div ng-if='column.DisplayName != null' ng-switch-default>{{column.DisplayName}}</div>" +
                                             "</div>" +
                                         "</th>" +
                                     "</tr>" +
                                 "</thead>" +
                                 "<tbody>" +
                                     "<tr ng-repeat='row in field.Rows | filter: field.SelectedFilter'>" +
                                         "<td ng-repeat='column in field.Columns'>" +
                                             "<div ng-switch='column.Type'>" +
                                              "<div ng-switch-when='InlineButton'>" +
                                             "<div class='btn-group'>" +
                                                 "<div class='btn btn-sm btn-default' ng-click='inlineButtonClicked(column,row)'><span ng-class='column.Glyphicon'></span></div>" +
                                                 "</div>" +
                                                 "</div>" +
                                             "<div ng-switch-when='Button'>" +
                                             "<div class='btn-group'>" +
                                                 "<div class='btn btn-sm btn-default' ng-click='buttonClicked(column,row)'><span ng-class='column.Glyphicon'></span></div>" +
                                                 "</div>" +
                                                 "</div>" +
                                                 "<div ng-switch-when='Hidden'>" +
                                                 "</div>" +
                                                 "<div ng-switch-when='Checkbox'>" +
                                                    "<input type='Checkbox' class='form-control input-sm' ng-model='row[column.Name]'/>" +
                                                 "</div>" +
                                                 "<div ng-switch-when='DateTime'>" +
                                                    "<span ng-bind='(row[column.Name] | date :\"yyyy-MM-dd HH:mm\" )'></span>" +
                                                 "</div>" +
                                                 "<div ng-switch-when='Date'>" +
                                                    "<span ng-bind='(row[column.Name] | date :\"dd-MM-yyyy\" )'></span>" +
                                                 "</div>" +
												 "<div ng-switch-when='Time'>" +
                                                    "<span ng-bind='(row[column.Name] | date : \"HH:mm:ss\")'></span>" +
                                                 "</div>" +
                                                 "<div ng-switch-when='Text'>" +
                                                     "<input type='text' class='form-control input-sm' ng-model='row[column.Name]'/>" +
                                                 "</div>" +
                                                  "<div ng-switch-when='SelectKeyValue' style='min-width=50px;'>" +
                                                     "<ui-select ng-model='row[column.Name]' style='width:200px;' name='fieldControl' reset-search-input='true'>" +
                                                         "<ui-select-match placeholder='Select'>{{$select.selected.Value}}</ui-select-match>" +
                                                         "<ui-select-choices repeat='option.Key as option in column.Options | filter: $select.search'>" +
                                                         "<small ng-bind-html='option.Value | highlight: $select.search'></small>" +
                                                         "</ui-select-choices>" +
                                                     "</ui-select>" +
                                                 "</div>" +
                                                 "<div ng-switch-when='SelectTagging'>" +
                                                     "<ui-select tagging ng-model='row[column.Name]' on-select='addItemToDropdown($item,$model,column)' name='fieldControl' ng-click='clearOptions(column)'>" +
                                                         "<ui-select-match placeholder='Select'>{{$select.selected}}</ui-select-match>" +
                                                         "<ui-select-choices repeat='option in column.FilteredOptions | filter: $select.search | limitTo: 5' refresh='refreshOptions($select.search,column)' refresh-delay='0'>" +
                                                         "<small ng-bind-html='option | highlight: $select.search'></small>" +
                                                         "</ui-select-choices>" +
                                                     "</ui-select>" +
                                                 "</div>" +
                                                 "<div ng-switch-default>{{row[column.Name]}}</div>" +
                                             "</div>" +
                                         "</td>" +
                                     "</tr>" +
                                 "</tbody>" +
                                 "</table>" +
                                 "</div>";
                                 break;

                             default:
                                 el = el.replace("{{fieldControl}}", '<input type="text" ' + validationType + ' name="fieldControl" class="form-control" ng-model="field.Value">');
                         }

                         iElement.html(el);
                     },
                     post: function postLink(scope, iElement, iAttrs, controller) {
                         $compile(iElement)(scope);
                     }
                 };
             }
         }
     });