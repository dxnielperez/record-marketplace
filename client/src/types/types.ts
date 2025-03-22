export type Product = {
  recordId: number;
  images: string[];
  albumName: string;
  genreId: number;
  condition: string;
  price: number;
  info: string;
  sellerId: number;
  genre: string;
  artist: string;
};

export type CartItemsProps = {
  albumName: string;
  artist: string;
  cartId: number;
  condition: string;
  genreId: number;
  imageSrc: string;
  info: string;
  itemsId: number;
  price: number;
  quantity: number;
  recordId: number;
  sellerId: number;
  userId: number;
};

export type User = {
  userId: number;
  username: string;
};

export type Products = {
  recordId: number;
  images: string[];
  artist: string;
  albumName: string;
  genreId: number;
  condition: string;
  price: number;
  info: string;
  sellerId: number;
};

export type Genre = {
  name: string;
  genreId: number;
};
