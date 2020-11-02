import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ghPagesUrl = 'https://bcldvd.github.io/attestation-de-sortie/';

  redirectGHPages(res) {
    res.redirect(this.ghPagesUrl);
  }
}
