const core = require('@actions/core');
const github = require('@actions/github');
var AWS = require('aws-sdk');
const { SSM } = require("@aws-sdk/client-ssm");

try {
    // Set the region 
    AWS.config.update({ region: core.getInput('aws-region') });
    // Load the AWS Region to use in SSM
    const ssm = new SSM()

    var params = {
        Name: core.getInput('ssm-path', { required: true }),
        Value: core.getInput('ssm-value', { required: true }),
        Type: core.getInput('ssm-value-type', { required: true }),
        Overwrite: core.getInput('ssm-value-overwrite', { required: true }),
        KeyId: core.getInput('ssm-kms-key-id'),
        Description: core.getInput('ssm-value-description')
    }
    ssm.putParameter({ params }).then(value => {
        console.log(`Storing Variable in path [${ssm_path_name}]`);
    }).catch(reason => {
        core.setFailed(reason);
    })

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
} catch (error) {
    core.setFailed(error.message);
}