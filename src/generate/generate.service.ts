import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Readable } from 'stream';
import { covidUrl } from './generate.constants';
import {
  CreateAttestationOptions,
  MotifDeSortie,
} from './attestation.interfaces';

@Injectable()
export class GenerateService {
  browser;

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      dumpio: true,
    });
  }

  async downloadPdf(options: CreateAttestationOptions) {
    const path = covidUrl;
    const page = await this.browser.newPage();
    await page.goto(path, { waitUntil: 'networkidle2' });
    await page.setBypassCSP(true);

    const downloadPath = process.cwd();
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath,
    });

    await this.fillFields(page, options);

    const btnId = 'generate-btn';
    await page.click(`button#${btnId}`);
    await page.waitFor(5000);

    const { buffer, fileName } = await this.getFileBuffer(page);

    page.close();

    const stream = this.getReadableStream(buffer);

    return {
      stream,
      fileName,
    };
  }

  async getFileBuffer(page) {
    const { stringifiedBuffer, fileName, url } = await page.evaluate(
      async () => {
        function ab2str(buf) {
          return String.fromCharCode.apply(null, new Uint8Array(buf));
        }

        const elems = document.getElementsByTagName('a');
        const a = elems[elems.length - 1];
        const url = a['href'];
        const fileName = a['download'];

        console.log('url', url, 'fileName', fileName);

        const buff = await fetch(url).then(r => r.arrayBuffer());

        return {
          stringifiedBuffer: ab2str(buff),
          fileName,
          url,
        };
      },
    );

    console.log('blob url :', url);

    return {
      buffer: Buffer.from(this.str2ab(stringifiedBuffer)),
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
    }
    await this.fillField(page, '#field-heuresortie', options.time);
  }

  private getCurrentTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
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

  getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  private str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
