/* eslint-disable no-console */
const fs = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');
const axios = require('axios');
const csvtojson = require('csvtojson');

const parse = async (url) => {
  try {
    console.log(`Download the csv data from ${url} and process file...`);

    const response = await axios.get(url);
    const data = await csvtojson().fromString(response.data);
    const output = [];

    for (const entry of data) {
      const pem = entry['PEM Info'].slice(1, -1);
      const name = entry['Common Name or Certificate Name'] ?? entry['Certificate Subject Common Name'];

      console.log(`Processing ${name}...`);

      output.push([
        name,
        '==================',
        pem,
        '',
      ].join('\r\n'));
    }

    console.log(`The certificates from ${url} have been processed!`);

    return output.join('\r\n');
  } catch (error) {
    console.log(error);
    return '';
  }
};

const build = async () => {
  const caIntermediateBundle = await parse('https://ccadb-public.secure.force.com/mozilla/PublicAllIntermediateCertsWithPEMCSV');
  const caRootBundle = await parse('https://ccadb-public.secure.force.com/mozilla/IncludedCACertificateReportPEMCSV');
  const caBundle = path.join(process.cwd(), '/src/main/src/ca-bundle');

  await fs.writeFile(path.join(caBundle, 'ca_intermediate_bundle.pem'), caIntermediateBundle);
  await fs.writeFile(path.join(caBundle, 'ca_root_bundle.pem'), caRootBundle);
  await fs.writeFile(path.join(caBundle, 'ca_intermediate_root_bundle.pem'), caIntermediateBundle + caRootBundle);

  console.log('All certificates have been saved successfully!');
};

build();
