export type TServerCall = {
  entity: string | number | Array<string | number>;
  data?: any;
  method: THttpMethods;
  // method: AXIOS
};
