'use strict';

const { escapeXml } = require('./utils');

function generateXmpMetadata(xmpConfig) {
  if (!xmpConfig || !xmpConfig.enabled) return null;

  const creator = escapeXml(xmpConfig.creator || '');
  const copyright = escapeXml(xmpConfig.copyright || '');
  const rights = escapeXml(xmpConfig.rights || '');
  const license = escapeXml(xmpConfig.license || '');
  const description = escapeXml(xmpConfig.description || '');
  const title = escapeXml(xmpConfig.title || '');
  const source = escapeXml(xmpConfig.source || '');
  const nowIso = new Date().toISOString();

  let customProps = '';
  if (xmpConfig.customProperties && typeof xmpConfig.customProperties === 'object') {
    for (const [k, v] of Object.entries(xmpConfig.customProperties)) {
      customProps += `        <ext:${escapeXml(k)}>${escapeXml(String(v))}</ext:${escapeXml(k)}>\n`;
    }
  }

  const xmpXml = `<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:xmp="http://ns.adobe.com/xap/1.0/"
        xmlns:cc="http://creativecommons.org/ns#"
        xmlns:ext="http://example.org/xmp/extension/">
      ${title ? `<dc:title><rdf:Alt><rdf:li xml:lang="x-default">${title}</rdf:li></rdf:Alt></dc:title>` : ''}
      ${creator ? `<dc:creator><rdf:Seq><rdf:li>${creator}</rdf:li></rdf:Seq></dc:creator>` : ''}
      ${description ? `<dc:description><rdf:Alt><rdf:li xml:lang="x-default">${description}</rdf:li></rdf:Alt></dc:description>` : ''}
      ${copyright ? `<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${copyright}</rdf:li></rdf:Alt></dc:rights>` : ''}
      ${rights ? `<cc:morePermissions>${rights}</cc:morePermissions>` : ''}
      ${license ? `<cc:license rdf:resource="${license}"/>` : ''}
      ${source ? `<dc:source>${source}</dc:source>` : ''}
      <xmp:CreateDate>${nowIso}</xmp:CreateDate>
${customProps}    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>`;

  return {
    metadata: [
      {
        ':@': {
          '@_id': 'xmp-metadata'
        }
      },
      {
        '#text': xmpXml
      }
    ]
  };
}

module.exports = { generateXmpMetadata };