export interface IProducts {
  id: number;
  title: string;
  price: number;
  image?: string;
  configure: IProductConfig;
  year: number;
  quantity: number;
}

export interface IProductConfig {
  chip: string;
  ssd: string;
  memory: string;
  display: string;
}
