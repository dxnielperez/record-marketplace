export type Product = {
  recordId: number;
  imageSrc: string;
  artist: string;
  albumName: string;
  genreId: number;
  condition: string;
  price: number;
  info: string;
  sellerId: number;
  genre: string;
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
