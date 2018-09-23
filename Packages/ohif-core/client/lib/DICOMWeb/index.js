import getAttribute from './getAttribute.js';
import getModalities from './getModalities.js';
import getName from './getName.js';
import getNumber from './getNumber.js';
import getString from './getString.js';

const DICOMWeb = {
    getAttribute,
    getModalities,
    getName,
    getNumber,
    getString,
};

OHIF.DICOMWeb = DICOMWeb;
