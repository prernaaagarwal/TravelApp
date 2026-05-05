export type Buddy = {
  id: string;
  firstName: string;
  ageRange: string;
  homeCity: string;
  tripCount: number;
  destinationSlug: string;
  travelDates: { start: string; end: string };
  budgetRange: string;
  travelStyle: string[];
  styleTags: string[];
  idVerified: boolean;
  photoUrl: string;
};
