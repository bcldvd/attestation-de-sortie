<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/5/50/Bloc_Marianne.svg/440px-Bloc_Marianne.svg.png" width="320" alt="Marianne" />
</p>

  <p align="center">Générateur d'attestation de déplacement dérogatoire</p>
  <br>
    <!-- <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a> -->

## Description

Ce générateur remplit [le générateur officiel](https://media.interieur.gouv.fr/deplacement-covid-19/) via puppeteer et expose cela via un endpoint REST.\
De cette façon, plusieurs usages s'offrent à vous :

- Automatiser la génération de **votre** attestation
- Générer l'attestation via un assistant vocal

<br>

## Utilisation

Cette application n'expose qu'un module : `/generate`.\
Vos données sont à passer en query parameter, la liste exhaustive se trouve ici : [generate.controller.ts](https://github.com/bcldvd/attestation-de-sortie/blob/master/src/generate/generate.controller.ts)

Les parametres suivants se remplissent automatiquement si non définis :

- date
- time
- reason

`reason` correspond au motif de sortie, dont la liste se trouve ici : [attestation.interfaces.ts](https://github.com/bcldvd/attestation-de-sortie/blob/master/src/generate/attestation.interfaces.ts#L14-L24)

### Exemples d'URLs :

```
http://localhost:3000/generate?firstName=Emmanuel&lastName=Macron&birthday=21/12/1977&placeOfBirth=Amiens&address=55%20Rue%20du%20Faubourg%20Saint-Honor%C3%A9&town=Paris&zipCode=75008&reason=achats
```

```
https://attestation-de-sortie.herokuapp.com/generate?firstName=Emmanuel&lastName=Macron&birthday=21/12/1977&placeOfBirth=Amiens&address=55%20Rue%20du%20Faubourg%20Saint-Honor%C3%A9&town=Paris&zipCode=75008
```

## Installation

```bash
$ npm install
```

## Lancer l'application

```bash
# development
$ npm run dev

# production mode
$ npm run start:prod
```

## Déployer sur Heroku

Dans les settings d'Heroku :

- Ajouter la **Config Var** `TZ` -> `Europe/Paris`
- Ajouter le **buildpack** [jontewks/puppeteer](https://github.com/jontewks/puppeteer-heroku-buildpack)

## Support

Ce projet est "open source" et sous la licence MIT. N'hésitez pas à contribuer pour le rendre encore meilleur 🤗.

## Licence

Ce projet est licencié [MIT](LICENSE).
