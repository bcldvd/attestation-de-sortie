import { Controller, Get, Res, Header, Query } from '@nestjs/common';
import { Response } from 'express';
import { GenerateService } from './generate.service';
import { MotifDeSortie } from './attestation.interfaces';

@Controller('generate')
export class GenerateController {
  constructor(private generateService: GenerateService) {}

  @Get()
  //@Header('content-type', 'application/pdf')
  @Header('content-type', 'image/png')
  async get(
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
    @Query('birthday') birthday: string,
    @Query('placeOfBirth') placeOfBirth: string,
    @Query('address') address: string,
    @Query('town') town: string,
    @Query('zipCode') zipCode: string,
    @Query('reason') reason: MotifDeSortie,
    @Query('date') date: string,
    @Query('time') time: string,
    @Res() res: Response,
  ) {
    const { stream, fileName } = await this.generateService.downloadPdf({
      firstName,
      lastName,
      birthday,
      placeOfBirth,
      address,
      town,
      zipCode,
      reason,
      date,
      time,
    });
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    stream.pipe(res);
  }
}
