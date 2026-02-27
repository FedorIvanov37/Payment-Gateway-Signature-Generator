/*
 * Payment Gateway Call Signature Generator
 * 
 * Purpose: Automatic payment gateway call signature generation in Postman
 * 
 * See more about the Signature: https://docs.payabl.com/docs/signature-calculation
 *
 * Note: Put the code below to the "Pre-request script" tab of the Postman
 * After inserting the code to the "Pre-request script" tab you will not have to use the "signature" param in the URL anymore, because the signature will be generated automatically 
 * If the URL contains a "signature" param script does nothing. In other words, the "signature" param from the URL has a priority.
 *
 * The "Script configuration" block in the code below is the only way to set the script execution parameters correctly
 * 
 * This code is a New Year gift for Katerina. Good luck and happy New Year!
 *  
 */
 
// Start of Script configuration block
 
var secret = 'b185' // The "secret" is known only by you and the payment gateway. It must be exchanged by email or by phone.
var enabled = true  // The script execution is enabled. Put "true" or "false" after the equal sign 
 
// End of Script configuration block
 
if (!enabled) {
    console.log('Pre-request script "Signature generator" execution disabled. The signature should be set in another way')
    return
}
 
var CryptoJS = require("crypto-js");
var signature = ''
var url_params = {} 
var error_signature_exists = new Error('Signature Generator: Signature already set in URL params. The URL signature has a priority')
 
try { 
    Object.keys(pm.request.url.query.members).forEach(  
        url_param_index => {
            url_param_set = pm.request.url.query.members[url_param_index]
            
            if(url_param_set.key == 'signature') {
                if(!url_param_set.disabled) {
                    throw error_signature_exists
                }
                return
            }
            url_params[url_param_set.key] = decodeURIComponent(url_param_set.value)
        }
    )
}
catch(error_signature_exists) {
    console.log(error_signature_exists.message)
    return
}
 
Object.keys(url_params).sort().forEach(
    url_param => {
        signature += url_params[url_param]
    }
)
 
signature += secret
signature = CryptoJS.SHA1(signature)
signature = CryptoJS.enc.Hex.stringify(signature)
pm.request.url.query.add('signature=' +  signature)
console.log('signature = ' +  signature)
