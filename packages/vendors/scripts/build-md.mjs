import { readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";

const data = await readFile(path.join(import.meta.dirname, '../data.json'), 'utf8');
const vendors = JSON.parse(data);

const output = path.join(import.meta.dirname, '../VENDORS.md')
const file = createWriteStream(output);

const formatAsList = (array) => {
  if (!array || array.length === 0) return '';
  if (typeof array === 'string') {
    return array.split(',').map(item => `- ${item.trim()}`).join('\n');
  }
  return array.map(item => `- ${item}`).join('\n');
};

file.write('# Vendors\n\n');

for (const vendor of vendors) {
  // Vendor name and description
  file.write(`## ${vendor.name}\n\n`);
  if (vendor.description) {
    file.write(`${vendor.description}\n\n`);
  }
  
  if (vendor.legalName) {
    file.write(`**Legal Name:** ${vendor.legalName}\n\n`);
  }
  
  if (vendor.headquarterAddress) {
    file.write(`**Headquarters:** ${vendor.headquarterAddress}\n\n`);
  }
  
  file.write('### Links\n\n');
  file.write('| Resource | Link |\n');
  file.write('|----------|------|\n');
  
  if (vendor.websiteUrl) {
    file.write(`| Website | [Link](${vendor.websiteUrl}) |\n`);
  }
  
  if (vendor.privacyPolicyUrl) {
    file.write(`| Privacy Policy | [Link](${vendor.privacyPolicyUrl}) |\n`);
  }
  
  if (vendor.termsOfServiceUrl && vendor.termsOfServiceUrl !== 'undefined') {
    file.write(`| Terms of Service | [Link](${vendor.termsOfServiceUrl}) |\n`);
  }
  
  if (vendor.serviceLevelAgreementUrl && vendor.serviceLevelAgreementUrl !== 'undefined') {
    file.write(`| Service Level Agreement | [Link](${vendor.serviceLevelAgreementUrl}) |\n`);
  }
  
  if (vendor.securityPageUrl && vendor.securityPageUrl !== 'undefined') {
    file.write(`| Security Page | [Link](${vendor.securityPageUrl}) |\n`);
  }
  
  if (vendor.trustPageUrl && vendor.trustPageUrl !== 'undefined') {
    file.write(`| Trust Page | [Link](${vendor.trustPageUrl}) |\n`);
  }
  
  if (vendor.statusPageUrl && vendor.statusPageUrl !== 'undefined') {
    file.write(`| Status Page | [Link](${vendor.statusPageUrl}) |\n`);
  }
  
  if (vendor.dataProcessingAgreementUrl && vendor.dataProcessingAgreementUrl !== 'undefined') {
    file.write(`| Data Processing Agreement | [Link](${vendor.dataProcessingAgreementUrl}) |\n`);
  }
  
  if (vendor.businessAssociateAgreementUrl && vendor.businessAssociateAgreementUrl !== 'undefined') {
    file.write(`| Business Associate Agreement | [Link](${vendor.businessAssociateAgreementUrl}) |\n`);
  }
  
  if (vendor.serviceSoftwareAgreementUrl && vendor.serviceSoftwareAgreementUrl !== 'undefined') {
    file.write(`| Service Software Agreement | [Link](${vendor.serviceSoftwareAgreementUrl}) |\n`);
  }
  
  if (vendor.subprocessorsListUrl && vendor.subprocessorsListUrl !== 'undefined') {
    file.write(`| Subprocessors List | [Link](${vendor.subprocessorsListUrl}) |\n`);
  }
  
  file.write('\n');
  
  if (vendor.categories && vendor.categories !== 'undefined') {
    file.write(`**Categories:** ${vendor.categories}\n\n`);
  } else if (vendor.category && vendor.category !== 'undefined') {
    file.write(`**Category:** ${vendor.category}\n\n`);
  }
  
  if (vendor.certifications && vendor.certifications !== 'undefined') {
    file.write('### Certifications\n\n');
    file.write(formatAsList(vendor.certifications));
    file.write('\n\n');
  }
  
  if (vendor.subprocessors && vendor.subprocessors !== 'undefined') {
    file.write('### Subprocessors\n\n');
    file.write(formatAsList(vendor.subprocessors));
    file.write('\n\n');
  }
  
  file.write('---\n\n');
}

file.end();
