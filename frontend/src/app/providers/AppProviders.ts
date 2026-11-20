import { loginUser } from '../../modules/users/application/login-user.use-case';
import { registerUser } from '../../modules/users/application/register-user.use-case';
import { userHttpAdapter } from '../../modules/users/infrastructure/adapters/user-http.adapter';
import { getProductDetail, getProducts } from '../../modules/catalog/application/get-products.use-case';
import { productHttpAdapter } from '../../modules/catalog/infrastructure/adapters/product-http.adapter';
import {
  addToCart, changeCartItem, checkout, getCart, getOrderDetail, listOrders, removeCartItem,
} from '../../modules/orders/application/orders.use-cases';
import { ordersHttpAdapter } from '../../modules/orders/infrastructure/adapters/order-http.adapter';
import type { AddToCartInput } from '../../modules/orders/domain/model/order.entity';
import type { Credentials, Registration } from '../../modules/users/domain/ports/auth.port';

export const services = {
  login: (credentials: Credentials) => loginUser(userHttpAdapter, credentials),
  register: (registration: Registration) => registerUser(userHttpAdapter, registration),
  session: (signal: AbortSignal) => userHttpAdapter.session(signal),
  logout: () => userHttpAdapter.logout(),
  listProducts: (category: string, signal: AbortSignal) => getProducts(productHttpAdapter, category, signal),
  productDetail: (id: string, signal: AbortSignal) => getProductDetail(productHttpAdapter, id, signal),
  getCart: (signal: AbortSignal) => getCart(ordersHttpAdapter, signal),
  addToCart: (producto: AddToCartInput) => addToCart(ordersHttpAdapter, producto),
  changeCartItem: (productoId: string, cantidad: number) => changeCartItem(ordersHttpAdapter, productoId, cantidad),
  removeCartItem: (productoId: string) => removeCartItem(ordersHttpAdapter, productoId),
  checkout: () => checkout(ordersHttpAdapter),
  listOrders: (signal: AbortSignal) => listOrders(ordersHttpAdapter, signal),
  orderDetail: (id: string, signal: AbortSignal) => getOrderDetail(ordersHttpAdapter, id, signal),
};
