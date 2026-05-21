export interface YearPreset {
  id: string;
  label: string;
  fromDate?: string;
  toDate?: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const startOf = (year: number) => `${year}-01-01`;
const endOf = (year: number) => `${year}-12-31`;

export function buildPresets(referenceYear: number): YearPreset[] {
  return [
    { id: "anytime", label: "Anytime" },
    { id: "this-year", label: `This year`, fromDate: startOf(referenceYear), toDate: today() },
    { id: "last-year", label: `${referenceYear - 1}`, fromDate: startOf(referenceYear - 1), toDate: endOf(referenceYear - 1) },
    { id: "last-3", label: `Last 3 years`, fromDate: startOf(referenceYear - 2), toDate: today() },
    { id: "last-5", label: `Last 5 years`, fromDate: startOf(referenceYear - 4), toDate: today() },
    { id: "last-10", label: `Last 10 years`, fromDate: startOf(referenceYear - 9), toDate: today() },
  ];
}
