"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const toolrunner_1 = require("@actions/exec/lib/toolrunner");
const exec = require('@actions/exec');
const userName = core.getInput('userName');
const authUrl = core.getInput('authUrl');
const projectDomainName = core.getInput('projectDomainName');
const userPassword = core.getInput('userPassword');
const userDomainName = core.getInput('userDomainName');
const projectName = core.getInput('projectName');
const clusterName = core.getInput('clusterName');
function pipInstall() {
    return __awaiter(this, void 0, void 0, function* () {
        let args1 = ['install', 'wheel'];
        let pipPath = "pip";
        let openstackPath = "openstack";
        const toolRunner1 = new toolrunner_1.ToolRunner(pipPath, args1);
        yield toolRunner1.exec();
        core.debug(`pip install wheel`);
        let args2 = ['install', 'python-openstackclient'];
        const toolRunner2 = new toolrunner_1.ToolRunner(pipPath, args2);
        yield toolRunner2.exec();
        core.debug(`pip install openstack-client`);
        let args3 = ['install', 'python-magnumclient'];
        const toolRunner3 = new toolrunner_1.ToolRunner(pipPath, args3);
        yield toolRunner3.exec();
        core.debug(`pip install python-magnumclient`);
        let args4 = ['coe', 'cluster', 'config', clusterName, '--os-auth-url', authUrl, '--os-identity-api-version', '3', '--os-project-name', projectName, '--os-project-domain-name', projectDomainName, '--os-username', userName, '--os-user-domain-name', userDomainName, '--os-password', userPassword];
        const toolRunner4 = new toolrunner_1.ToolRunner(openstackPath, args4, { failOnStdErr: false, ignoreReturnCode: true, silent: false });
        yield toolRunner4.exec();
        core.debug(`openstack coe cluster config`);
    });
}
function createCluster() {
    return __awaiter(this, void 0, void 0, function* () {
        let openstackPath = "openstack";
        let args5 = ['coe', 'cluster', 'create', clusterName, '--cluster-template k8s_1.14.1', '--master-count 1', '--node-count 1', '--master-flavor VC-2', '--flavor VC-2', '--keypair mykey', '--labels cloud_provider_tag=v1.14.0,coredns_tag=1.5.2,kube_tag=v1.14.1,heat_container_agent_tag=stein-stable'];
        const toolRunner5 = new toolrunner_1.ToolRunner(openstackPath, args5, { failOnStdErr: false, ignoreReturnCode: true, silent: false });
        yield toolRunner5.exec();
        core.debug(`openstack coe cluster create`);
    });
}
function exportKubeconfig() {
    return __awaiter(this, void 0, void 0, function* () {
        yield delay(600);
        core.exportVariable('KUBECONFIG', './config');
    });
}
// test run: kubectl cluster-info
function kubectl() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec('kubectl cluster-info');
    });
}
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield pipInstall();
        yield createCluster();
        yield exportKubeconfig();
        yield kubectl();
    });
}
run();
