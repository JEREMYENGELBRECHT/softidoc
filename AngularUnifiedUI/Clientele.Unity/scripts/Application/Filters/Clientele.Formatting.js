
function allowOnlyNumbersLettersAndPeriod(e) {
    var k;
    document.getElementById("*") ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || k === 46 || (k >= 48 && k <= 57));
}

angular.module('Clientele.Formatting', ['ReferenceNumbers'])
.filter('groupResults', ['$parse', function ($parse) {
    return function (list, group_by) {

        var filtered = [];
        var prev_item = null;
        var group_changed = false;
        // this is a new field which is added to each item where we append "_CHANGED"
        // to indicate a field change in the list
        //was var new_field = group_by + '_CHANGED'; - JB 12/17/2013
        var new_field = 'group_by_CHANGED';

        // loop through each item in the list
        angular.forEach(list, function (item) {

            group_changed = false;

            // if not the first item
            if (prev_item !== null) {

                // check if any of the group by field changed

                //force group_by into Array
                group_by = angular.isArray(group_by) ? group_by : [group_by];

                //check each group by parameter
                for (var i = 0, len = group_by.length; i < len; i++) {
                    if ($parse(group_by[i])(prev_item) !== $parse(group_by[i])(item)) {
                        group_changed = true;
                    }
                }


            }// otherwise we have the first item in the list which is new
            else {
                group_changed = true;
            }

            // if the group changed, then add a new field to the item
            // to indicate this
            if (group_changed) {
                item[new_field] = true;
            } else {
                item[new_field] = false;
            }

            filtered.push(item);
            prev_item = item;

        });

        return filtered;
    };
}])
.filter('fileSize', function () {
    var formatFileSizeUnits = function (bytes) {
        var i = -1;
        var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 1024);

        if (i > 7) {
            return "Too large..";
        }
        return Math.max(bytes, 0.1).toFixed(1) + byteUnits[i];
    };

    return function (input) {
        // input will be the string we pass in
        if (input) {
            return formatFileSizeUnits(input);
        }
    };
})
.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
})
.filter('saCurrency', function () {
    return function (input) {
        if (input === null) {
        	return 'R ' + parseFloat(0).toFixed(2);
        };
        return 'R ' + parseFloat(input).toFixed(2);
    };
})
.filter('saCurrencyWithSpaces', function() {
			return function (input) {
				if (input === null || typeof input === "undefined")
					input = 0;

				input = parseFloat(input).toFixed(2);

				var delimiter = " ";
				var a = input.split('.', 2);
				var d = a[1];
				var i = parseInt(a[0]);
				if (isNaN(i)) { return ''; }
				var minus = '';
				if (i < 0) { minus = '-'; }
				i = Math.abs(i);
				var n = new String(i);
				var a = [];
				while (n.length > 3) {
					var nn = n.substr(n.length - 3);
					a.unshift(nn);
					n = n.substr(0, n.length - 3);
				}
				if (n.length > 0) { a.unshift(n); }
				n = a.join(delimiter);
				if (d.length < 1) { input = n; }
				else { input = n + '.' + d; }
				input = minus + input;
				return 'R ' + input;
			};
	})
    .filter('stdDateTimeFromUtc', function ($filter) {
        return function (input) {
            if (input == null) { return ""; }

            var date = $filter('date')(convertUTCDateToLocalDate(new Date(input)), 'dd MMMM yyyy hh:mm:ss a');

            return date;
        };
    })
.filter('stdDateFromUtc', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }

        var date = $filter('date')(convertUTCDateToLocalDate(new Date(input)), 'dd MMMM yyyy');

        return date;
    };
})
.filter('stdDateTime', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }

        var date = $filter('date')(convertUTCDateToLocalDate(new Date(input)), 'dd MMMM yyyy hh:mm:ss a');

        return date;
    };
})
.filter('stdDate', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }

        var date = $filter('date')(convertUTCDateToLocalDate(new Date(input)), 'dd MMMM yyyy');

        return date;
    };
})
.filter('boolYesNo', function () {
    return function (input) {
        if (input === true) {
            return "Yes";
        } else if (input === false) {
            return "No";
        } else {
            return "Invalid Input";
        }

    };
})
.filter('emptyString', function () {
    return function (input) {
        if (input !== undefined && input !== "") {
            return input;
        } else {
            return "Empty";
        }
    };
})
.filter('total', ['$parse', function ($parse) {
    return function (input, property) {
        var i = input instanceof Array ? input.length : 0,
            p = $parse(property);

        if (typeof property === 'undefined' || i === 0) {
            return i;
        }
        else if (isNaN(p(input[0]))) {
            throw 'filter total can count only numeric values';
        } else {
            var total = 0;
            while (i--) {
                total += p(input[i]);
            }
            return total;
        }
    };
}]);

angular.module('ReferenceNumbers', [])
    .filter('referenceNumber', function () {

        return function (input, format) {
            if (input) {
                if (format.prefix == "undefined" || format.prefix == undefined) {
                    format.prefix = "";
                }

                if (format.length == "undefined" || format.length == undefined) {
                    format.length = 8;
                }

                var formattedString = String(input);
                formattedString = formattedString.replace(format.prefix.toLowerCase(), "");
                formattedString = formattedString.replace(format.prefix.toUpperCase(), "");

                if (formattedString.length < format.length) {
                    var leadingZeroCount = format.length - formattedString.length;
                    for (var i = 0; i < leadingZeroCount; i++) {
                        formattedString = "0" + formattedString;
                    }
                }

                formattedString = format.prefix + formattedString;

                return formattedString;
            }

            return "";
        };
    })
    .filter('titleCase', function () {
        return function (str) {
            return (str == undefined || str === null) ? '' : str.replace(/_|-/, ' ').replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    });


function convertUTCDateToLocalDate(date) {

    var realDate = date;

    var convertdLocalTime = new Date(realDate);

    var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

    if (navigator.userAgent.toLowerCase().indexOf('chrome') === -1) {

        hourOffset = 0;

        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            hourOffset = 0;
        }

        if (navigator.userAgent.toLowerCase().indexOf('msie') > -1) {
            hourOffset = 0;
        }

        if (navigator.userAgent.toLowerCase().indexOf('mozilla') > -1) {
            hourOffset = 0;
        }
    }

    convertdLocalTime = convertdLocalTime.setHours(convertdLocalTime.getHours() + hourOffset);

    return convertdLocalTime;
}