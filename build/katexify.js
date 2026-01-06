#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as cheerio from 'cheerio';
import * as katex from 'katex';
import * as fs from 'node:fs';
import * as path from 'node:path';

function withSuffix(/**@type{string}*/p, /**@type{string}*/ext) {
  return path.format({...path.parse(p), base: void 0, ext})
}

export function transformFileToString(
  /**@type{string}*/infile, 
  /**@type{Omit<katex.KatexOptions, "displayMode">}*/opts={}
) {
  /** @type {PromiseWithResolvers<string>} */
  let {resolve, reject, promise} = Promise.withResolvers/**@template{string}*/();
  fs.createReadStream(infile, {encoding: 'utf8'}).pipe(cheerio.stringStream({}, (err, $) => {
    if(err) return reject(err);
    $('.math').each(function() {
      let self = $(this);
      let displayMode =
        self.hasClass("display") ? true
        : self.hasClass("inline") ? false
        : null;
      if(displayMode == null) return;  // What is this?
      let texIn = self.text();
      let newHtml = katex.renderToString(texIn, {
        throwOnError: false, displayMode, output: "mathml", 
        strict: false, 
        ...opts
      });
      self.html(newHtml);
    });
    // // Step 2: remove annotations that make pandoc want to jump off a bridge
    // // (maybe it's trying to convert the Tex annotations to HTML??)
    // $('annotation[encoding="application/x-tex"]').remove();
    // Step 3: Firefox doesn't handle the standard <mspace linebreak="newline">
    // so try to emulate it using a table...
    $(':has(> mspace[linebreak="newline"])').each(function() {
      let self = $(this);
      let /**@type{cheerio.Cheerio<Element>[][]}*/all = [];
      let /**@type{cheerio.Cheerio<Element>[]}*/curr = [];
      self.children().each(function() {
        let ch = $(this);
        if(ch.is('mspace[linebreak="newline"]')) {
          all.push(curr);
          curr = [];
        } else {
          curr.push(ch);
        }
      });
      all.push(curr);
      self.children().remove();
      let mtable = $('<mtable></mtable>');
      for (const rowElems of all) {
        let mtr = $('<mtr></mtr>');
        let mtd = $('<mtd></mtd>').attr('style', 'padding: 0').appendTo(mtr);
        for (const elem of rowElems) {
          if(elem.is('annotation' || elem.is('annotation-xml'))) {
            elem.appendTo(self);  // Keep them were they were
          } else {
            elem.wrap('<mtd></mtd>').appendTo(mtd);
          }
        }
        mtr.appendTo(mtable);
      }
      mtable.prependTo(self);  // before annotations
    });
    resolve($.html());
  }));
  return promise;
}
async function writeTransformedHtml(
  /**@type{string}*/h, /**@type{string}*/infile, /**@type{string}*/outfile
) {
  outfile ??= withSuffix(infile, '.katex.html');
  return await fs.promises.writeFile(outfile, h, {encoding: 'utf8'});
}

export async function main(
  /**@type{string}*/infile, /**@type{string?}*/outfile,
  /**@type{Omit<katex.KatexOptions, "displayMode">?}*/opts={}
) {
  const h = await transformFileToString(infile, opts);
  return await writeTransformedHtml(h, infile, outfile);
}

export async function cli() {
  const scriptName = 'katexify.js';
  const usage = `${scriptName} <infile> [-o outfile]`;
  const desc = (
    "Convert the HTML source with Pandoc's broken --katex output that doesn't" + 
    "actually contain KaTeX to a fixed version");

  const argv = yargs(hideBin(process.argv))
    .scriptName(scriptName)
    .command(
      "$0 <infile>",  // yargs is so bizarre - this string is some formal specification here?!!
      desc,
      (yargs) => {
        yargs
          .positional("infile", {
            describe: "The markdown file to use as input",
            type: "string",
          })
          .option('out', {
            describe: "The file to output it to",
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
