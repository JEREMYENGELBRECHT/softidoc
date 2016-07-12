var encodePolicyNumberWithPipe = function (policyNumber) {

    var index = policyNumber.indexOf(".");
    if (index !== -1) {
        policyNumber = policyNumber.substring(0, index) + "|" + policyNumber.substring(index + 1);
    }

    return policyNumber;
};