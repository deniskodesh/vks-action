import * as core from '@actions/core';
import { ToolRunner, argStringToArray } from "@actions/exec/lib/toolrunner";

const exec = require('@actions/exec');
const userName = core.getInput('userName');
const authUrl = core.getInput('authUrl');
const projectDomainName = core.getInput('projectDomainName');
const userPassword = core.getInput('userPassword');
const userDomainName = core.getInput('userDomainName');
const projectName = core.getInput('projectName');
const clusterName = core.getInput('clusterName');


async function pipInstall() {
  


    let args1 = ['install', 'wheel'];
    let pipPath = "pip";
    let openstackPath = "openstack";

    const toolRunner1 = new ToolRunner(pipPath, args1);
    await toolRunner1.exec();
    core.debug(`pip install wheel`);


    let args2 = ['install', 'python-openstackclient'];
    const toolRunner2 = new ToolRunner(pipPath, args2);
    await toolRunner2.exec();
    core.debug(`pip install openstack-client`);

    let args3 = ['install', 'python-magnumclient'];
    const toolRunner3 = new ToolRunner(pipPath, args3);
    await toolRunner3.exec();
    core.debug(`pip install python-magnumclient`);
    
    let args4 = ['coe', 'cluster', 'config', clusterName, '--os-auth-url', authUrl, '--os-identity-api-version', '3', '--os-project-name', projectName, '--os-project-domain-name', projectDomainName, '--os-username', userName, '--os-user-domain-name', userDomainName, '--os-password', userPassword];
    const toolRunner4 = new ToolRunner(openstackPath, args4, { failOnStdErr: false, ignoreReturnCode: true, silent: false });
    await toolRunner4.exec();
    core.debug(`openstack coe cluster config`);    
    }

async function createCluster() {
    let openstackPath = "openstack";
    let args5 = ['coe', 'cluster', 'create', clusterName, '--cluster-template k8s_1.14.1', '--master-count 1', '--node-count 1', '--master-flavor VC-2', '--flavor VC-2', '--keypair mykey', '--labels cloud_provider_tag=v1.14.0,coredns_tag=1.5.2,kube_tag=v1.14.1,heat_container_agent_tag=stein-stable'];
    const toolRunner5 = new ToolRunner(openstackPath, args5, { failOnStdErr: false, ignoreReturnCode: true, silent: false });
    await toolRunner5.exec();
    core.debug(`openstack coe cluster create`);  
  }

async function exportKubeconfig() {
    core.exportVariable('KUBECONFIG', './config');
  }

// test run: kubectl cluster-info
async function kubectl() {
    await exec.exec('kubectl cluster-info');
    }

async function run() {
    await pipInstall();
    await createCluster();
    await exportKubeconfig();
    await kubectl();
}

run();
