import { ITINERARIES, Itinerary } from "./itineraries";

export interface MatchInputs {
  destination: string;
  days: number;
  budget: number;
  month?: string;
  from?: string;
}

export function matchItinerary(inputs: MatchInputs): Itinerary | null {
  const { destination, days, budget, month } = inputs;

  // Step 1: Filter by destination (case-insensitive exact match)
  const destNormalized = destination.trim().toLowerCase();
  const destinationMatches = ITINERARIES.filter(
    (it) => it.destination.toLowerCase() === destNormalized
  );

  if (destinationMatches.length === 0) {
    return null; // No match for this destination
  }

  // Step 2: Find closest duration
  let closestByDays = destinationMatches[0];
  let minDaysDiff = Math.abs(destinationMatches[0].duration_days - days);

  for (const it of destinationMatches) {
    const diff = Math.abs(it.duration_days - days);
    if (diff < minDaysDiff) {
      minDaysDiff = diff;
      closestByDays = it;
    }
  }

  // Step 3: Among same-destination matches, prefer ones within budget range
  const budgetMatches = destinationMatches.filter(
    (it) => budget >= it.budget_min && budget <= it.budget_max
  );

  if (budgetMatches.length > 0) {
    // Find closest duration within budget matches
    let best = budgetMatches[0];
    let bestDiff = Math.abs(budgetMatches[0].duration_days - days);

    for (const it of budgetMatches) {
      const diff = Math.abs(it.duration_days - days);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = it;
      }
    }

    // Step 4: If month provided, prefer itineraries with matching best_months
    if (month) {
      const monthMatches = budgetMatches.filter((it) =>
        it.best_months.some((m) => m.toLowerCase().startsWith(month.toLowerCase()))
      );
      if (monthMatches.length > 0) {
        let bestMonth = monthMatches[0];
        let bestMonthDiff = Math.abs(monthMatches[0].duration_days - days);
        for (const it of monthMatches) {
          const diff = Math.abs(it.duration_days - days);
          if (diff < bestMonthDiff) {
            bestMonthDiff = diff;
            bestMonth = it;
          }
        }
        return bestMonth;
      }
    }

    return best;
  }

  // If no budget match, return closest by days
  return closestByDays;
}

export function getTransportInfo(itinerary: Itinerary, from?: string): string {
  if (!from || from.trim() === "") {
    return itinerary.transport_from["default"] || "Check train/bus/flight options.";
  }

  const fromNormalized = from.trim().toLowerCase();
  
  // Try exact match first
  for (const [city, info] of Object.entries(itinerary.transport_from)) {
    if (city.toLowerCase() === fromNormalized) {
      return info;
    }
  }

  // Try partial match
  for (const [city, info] of Object.entries(itinerary.transport_from)) {
    if (city.toLowerCase().includes(fromNormalized) || fromNormalized.includes(city.toLowerCase())) {
      return info;
    }
  }

  return itinerary.transport_from["default"] || "Check train/bus/flight options.";
}
