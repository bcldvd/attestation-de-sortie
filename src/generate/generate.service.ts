import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { v4 as uuid } from 'uuid';
import { Readable } from 'stream';
import * as fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import * as rmfr from 'rmfr';
import { DateTime } from 'luxon';
import { covidUrl } from './generate.constants';
import {
  CreateAttestationOptions,
  MotifDeSortie,
} from './attestation.interfaces';
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

@Injectable()
export class GenerateService {
  browser;

  async init() {
    if (process.env.NOW_SH) {
      const puppeteerCore = require('puppeteer-core');
      const chrome = require('chrome-aws-lambda');
      this.browser = await puppeteerCore.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      });
    } else {
      this.browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }

  async downloadPdf(options: CreateAttestationOptions) {
    const path = covidUrl;
    const page = await this.browser.newPage();
    await page.goto(path, { waitUntil: 'networkidle2' });

    const id = uuid();
    const downloadPath = `./tmp/${id}`;
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath,
    });

    await this.fillFields(page, options);

    const btnId = 'generate-btn';
    await page.click(`button#${btnId}`);

    const fileName = await this.waitForFileToDownload(downloadPath);

    page.close();

    const filePath = join(downloadPath, fileName);
    const buffer = await readFile(filePath);
    await rmfr(downloadPath);
    const stream = this.getReadableStream(buffer);

    return {
      stream,
      fileName,
    };
  }

  async fillFields(page, options) {
    await this.fillField(page, '#field-firstname', options.firstName);
    await this.fillField(page, '#field-lastname', options.lastName);
    await this.fillField(page, '#field-birthday', options.birthday);
    await this.fillField(page, '#field-lieunaissance', options.placeOfBirth);
    await this.fillField(page, '#field-address', options.address);
    await this.fillField(page, '#field-town', options.town);
    await this.fillField(page, '#field-zipcode', options.zipCode);
    await this.fillCheckbox(page, options.reason);
    await this.fillField(page, '#field-datesortie', options.date);
    await this.fillField(
      page,
      '#field-heuresortie',
      options.time || this.getCurrentTime(),
    );
  }

  private getCurrentTime() {
    const now = DateTime.local().setZone('France/Paris');
    if (process.env.HEROKU) {
      now.plus({ hours: 2 });
    }
    return `${now.hours}:${now.minutes}`;
  }

  async fillField(page, field, value) {
    if (value) {
      return page.type(field, value);
    }
  }

  async fillCheckbox(page, choice: MotifDeSortie) {
    if (!choice) choice = MotifDeSortie.courses;
    await page.evaluate(choice => {
      (document.querySelector(`#checkbox-${choice}`) as any).click();
    }, choice);
  }

  async waitForFileToDownload(downloadPath) {
    let filename;

    while (!filename || filename.endsWith('.crdownload')) {
      let dirExist = await exists(downloadPath);
      if (dirExist) {
        filename = fs.readdirSync(downloadPath)[0];
      }
      await this.delay(200);
    }

    return filename;
  }

  async delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
  }

  getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }
}
