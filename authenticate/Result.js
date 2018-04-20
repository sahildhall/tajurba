module.exports = function(status,data,errObj){
    let result ={};
    result.status = status
    result.data = data

    if(errObj instanceof Error)
        result.errorData = {code : errObj.code, message : errObj.message}
    else {
        result.errorData = errObj
        if(result.errorData)
            result.errorData.message = errObj.message || 'Some Error';
    }
    return result;
}