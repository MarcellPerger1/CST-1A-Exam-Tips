#!/usr/bin/env node
import puppeteer from 'puppeteer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import fs from 'node:fs';
import {pathToFileURL} from 'node:url';


function withSuffix(/**@type{string}*/p, /**@type{string}*/ext) {
  return path.format({...path.parse(p), base: void 0, ext})
}

export async function main(/**@type{string}*/infile, /**@type{string}*/outfile) {
  outfile ??= withSuffix(infile, '.pdf');
  console.log('(1/5) Launching Firefox');
  const browser = await puppeteer.launch({browser: 'firefox'});  // plz work, don't crash!
  try {
    const page = await browser.newPage();
    console.log('(2/5) Opening file');
    await page.goto(pathToFileURL(infile));
    await page.bringToFront();
    console.log("(3/5) Printing to PDF");
    const pdfStream = await page.pdf({
      format: 'A4', waitForFonts: true, 
      margin: {
        bottom: '0.5in',
        top: '0.5in',
        left: '0.5in',
        right: '0.5in',
      }
    });
    console.log("(4/5) Writing file");
    await fs.promises.writeFile(outfile, pdfStream);
    console.log("(5/5) Closing Firefox")
  } finally {
    await browser.close();
  }
  console.log("Done");
}

export async function cli() {
  const scriptName = 'ffhtmltopdf.js';
  const usage = `${scriptName} <infile> [-o outfile]`;
  const desc = "Convert the HTML source to a PDF using Firefox + Puppeteer";

  const argv = yargs(hideBin(process.argv))
    .scriptName(scriptName)
    .command(
      "$0 <infile>",  // yargs is so bizarre - this string is some formal specification here?!!
      desc,
      (yargs) => {
        yargs
          .positional("infile", {
            describe: "The HTML file to use as input",
            type: "string",
          })
          .option('out', {
            describe: "The PDF file to output it to",
            type: 'string',
            alias: 'o'
          })
          .strict();
      }
    )
    .usage(usage + "\n\n" + desc)
    .alias('h', 'help')
    .version('0.1.0')
    .alias('V', 'version')
    .strict()
    .showHelpOnFail(false, usage)
    .parse();
  return await main(argv.infile, argv.out);
}

if(import.meta.main || process.argv[1] === import.meta.filename) {
  await cli();
}

