// Puts the whole practice page essay into the global, including the Process
// section, which the global could not express until it gained a heading per
// paragraph.
//
// The words are the practice's own, transcribed exactly from the page as
// built, which in turn took them from the old About page. The double angle is
// stored as the character it is; the page turns it into the accent mark.
//
// Idempotent.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- npx tsx tools/seed-practice-copy.mjs

import { getPayload } from 'payload';
import config from '../payload.config.ts';

const PARAGRAPHS = [
  {
    text:
      'We are an RIBA Chartered and ARB registered architecture practice. We have a lot of experience in working on sites with complex and particular constraints. A lot of the work we have undertaken has been modification and retrofitting of existing buildings: rear extensions, basement extensions, loft extensions, internal reconfigurations and fitouts.',
  },
  {
    text:
      'It can be an extremely rewarding experience to see through the transformation of an existing building and unlock new possibilities within it. There are particular stages within a project when things are stripped back and alternative spaces can be seen beyond what is existing at the time. It is the job of your architect to reveal these possibilities to you in advance, within a process that allows you to make good decisions and get the most out of what for most people is a once in a lifetime project.',
  },
  {
    heading: 'Process',
    text:
      'All projects are developed through a collaborative process. At the outset it is about developing the brief through conversation » a back and forth of design concepts and critique in relation to functional and design aspirations, as well as understanding site context and regulatory environment. This is followed by design development through drawing, modelling and visualisation.',
  },
  {
    text:
      'We can handle submission of plans to the council for planning approval. On approvals, technical design and production information is undertaken for the purpose of pricing, building control and tendering the building contract. Once on site we can undertake contract administration to ensure that works are carried out in accordance with the designs and satisfy building regulations. At all stages you the client are invited into the process to comment, steer and ultimately sign off proposals.',
  },
  {
    text:
      'Ultimately we have an interest in developing robust, well considered, environmentally conscious and beautiful buildings which leave our clients both satisfied and happy in their new environment.',
  },
];

const payload = await getPayload({ config });

await payload.updateGlobal({
  slug: 'practice-page',
  data: { paragraphs: PARAGRAPHS },
});

const after = await payload.findGlobal({ slug: 'practice-page' });
console.log(`practice page now holds ${after.paragraphs.length} paragraphs:`);
for (const p of after.paragraphs) {
  console.log(`  ${p.heading ? `[${p.heading}] ` : ''}${p.text.slice(0, 62)}...`);
}
