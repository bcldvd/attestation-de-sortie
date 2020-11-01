import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { v4 as uuid } from 'uuid';
import { Readable } from 'stream';
import * as fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import * as rmfr from 'rmfr';
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
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async downloadPdf(options: CreateAttestationOptions) {
    const path = covidUrl;
    const page = await this.browser.newPage();
    console.log('new page');
    await page.goto(path, { waitUntil: 'networkidle2' });
    console.log('go to');

    const id = uuid();
    const downloadPath = `./tmp/${id}`;
    const cdpsession = await page.target().createCDPSession();
    await cdpsession.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath,
    });
    console.log('set download');

    await this.fillFields(page, options);
    console.log('fill fields');

    const btnId = 'generate-btn';
    await page.click(`button#${btnId}`);
    console.log('generate clicked');

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
    await this.fillField(page, '#field-placeofbirth', options.placeOfBirth);
    await this.fillField(page, '#field-address', options.address);
    await this.fillField(page, '#field-city', options.town);
    await this.fillField(page, '#field-zipcode', options.zipCode);
    await this.fillCheckbox(page, options.reason);
    await this.fillField(page, '#field-datesortie', options.date);
    if (!options.time) {
      options.time = this.getCurrentTime();
      console.log('time', options.time);
    }
    await this.fillField(page, '#field-heuresortie', options.time);
  }

  private getCurrentTime() {
    const date = new Date();
    let currentHours = '' + date.getHours();
    currentHours = ('0' + currentHours).slice(-2);
    let currentMinutes = '' + date.getMinutes();
    currentMinutes = ('0' + currentMinutes).slice(-2);
    return `${currentHours}:${currentMinutes}`;
  }

  async fillField(page, field, value) {
    if (value) {
      return page.type(field, value);
    }
  }

  async fillCheckbox(page, choice: MotifDeSortie) {
    if (!choice) choice = MotifDeSortie.achats;
    await page.evaluate(choice => {
      (document.querySelector(`#checkbox-${choice}`) as any).click();
    }, choice);
  }

  async waitForFileToDownload(downloadPath) {
    let filename;

    while (!filename || filename.endsWith('.crdownload')) {
      let dirExist = await exists(downloadPath);
      console.log(dirExist, downloadPath, fs.readdirSync('./tmp'));
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
