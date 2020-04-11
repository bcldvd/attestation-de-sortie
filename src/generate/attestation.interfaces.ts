export interface CreateAttestationOptions {
  firstName: string;
  lastName: string;
  birthday: string;
  placeOfBirth: string;
  address: string;
  town: string;
  zipCode: string;
  date?: string;
  time?: string;
  reason?: MotifDeSortie;
}

export enum MotifDeSortie {
  courses = 'courses',
  sport = 'sport',
  missions = 'missions',
  famille = 'famille',
  travail = 'travail',
  sante = 'sante',
  judiciaire = 'judiciaire',
}

// Sample = http://localhost:3000/generate?firstName=Emmanuel&lastName=Macron&birthday=21/12/1977&placeOfBirth=Amiens&address=55%20Rue%20du%20Faubourg%20Saint-Honor%C3%A9&town=Paris&zipCode=75008&reason=courses
// Sample = https://attestation-sortie.herokuapp.com/generate?firstName=Emmanuel&lastName=Macron&birthday=21/12/1977&placeOfBirth=Amiens&address=55%20Rue%20du%20Faubourg%20Saint-Honor%C3%A9&town=Paris&zipCode=75008
