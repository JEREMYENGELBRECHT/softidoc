function Dropdown(options, defaultText, selectedValue) {
    this.options = options;
    this.selectedItem = { Text: defaultText };

    if (angular.isDefined(selectedValue)) {
        for (var i = 0; i < options.length; i++) {
            if (options[i].Value == selectedValue) {
                this.selectedItem = options[i];
            }
        }
        return this;
    }

    for (var i = 0; i < options.length; i++) {
        if (options[i].Text == defaultText) {
            this.selectedItem = options[i];
        }
    }

    return this;
}

function MultipleDropdown(options) {

    this.options = options;
    this.selectedItems = [];
    this.placeholder = "" ;

    return this;
}

function SendIFrameData(eventName, data) {
    var unityScope = angular.element($("html")).scope();
    unityScope.$broadcast(eventName, data);
}