export interface LineChart {
  id: number;
  name: string;
  series: { name: number | string; value: number }[];
}
