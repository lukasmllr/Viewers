import { dcmjs } from 'meteor/ohif:cornerstone';
import retrieveDataFromSR from './retrieveDataFromSR';
import retrieveDataFromMeasurements from './retrieveDataFromMeasurements';

import DICOMwebClient from 'dicomweb-client';

const retrieveMeasurementFromSR = async (series) => {
    const server = OHIF.servers.getCurrentServer();
    const url = WADOProxy.convertURL(server.wadoRoot, server);

    // TODO: URL is most likely wrong
    // TODO: Move this elsewhere so it's not duplicated.
    // TODO: Fix HTTP Basic Auth
    let headers = {}
    const apiToken = OHIF.user.getAccessToken();
    if (apiToken) {
        headers.Authorization = `Bearer ${apiToken}`;
    }

    const config = {
        url,
        headers
    };

    const dicomWeb = new DICOMwebClient.api.DICOMwebClient(config);

    const instance = series.getFirstInstance();
    const options = {
        studyInstanceUID: instance.getStudyInstanceUID(),
        seriesInstanceUID: instance.getSeriesInstanceUID(),
        sopInstanceUID: instance.getSOPInstanceUID(),
    };

    return dicomWeb.retrieveInstance(options).then(retrieveDataFromSR);
};

const stowSRFromMeasurements = async (measurements) => {
    const server = OHIF.servers.getCurrentServer();
    const url = WADOProxy.convertURL(server.wadoRoot, server);
    const reportDataset = retrieveDataFromMeasurements(measurements);
    const denaturalizedMetaheader = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset._meta);
    const dicomDict = new dcmjs.data.DicomDict(denaturalizedMetaheader);

    dicomDict.dict = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset);

    const part10Buffer = dicomDict.write();

    // TODO: Move this elsewhere so it's not duplicated.
    // TODO: Fix HTTP Basic Auth
    let headers = {}
    const apiToken = OHIF.user.getAccessToken();
    if (apiToken) {
        headers.Authorization = `Bearer ${apiToken}`;
    }

    const config = {
        url,
        headers
    };

    const dicomWeb = new DICOMwebClient.api.DICOMwebClient(config);
    const options = {
        datasets: [part10Buffer]
    };

    return dicomWeb.storeInstances(options);
};

export {
    retrieveMeasurementFromSR,
    stowSRFromMeasurements
}
