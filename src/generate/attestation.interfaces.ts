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
}

// Sample = http://localhost:3000/generate?firstName=Emmanuel&lastName=Macron&birthday=21/12/1977&placeOfBirth=Amiens&address=55 Rue du Faubourg Saint-Honoré&town=Paris&zipCode=75008
