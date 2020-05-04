import { IFullOptions, json2csvAsync } from "json-2-csv";

const converterOptions: IFullOptions = {
  sortHeader: true,
  emptyFieldValue: "",
};

export function toCsvAsync(dataObject: any): Promise<string> {
  return json2csvAsync(dataObject, converterOptions);
}
