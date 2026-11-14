import { loginUser } from '../../modules/users/application/login-user.use-case';
import { registerUser } from '../../modules/users/application/register-user.use-case';
import { userHttpAdapter } from '../../modules/users/infrastructure/adapters/user-http.adapter';
import { getProductDetail, getProducts } from '../../modules/catalog/application/get-products.use-case';
import { productHttpAdapter } from '../../modules/catalog/infrastructure/adapters/product-http.adapter';
import type { Credentials, Registration } from '../../modules/users/domain/ports/auth.port';

export const services = {
  login: (credentials: Credentials) => loginUser(userHttpAdapter, credentials),
  register: (registration: Registration) => registerUser(userHttpAdapter, registration),
  session: (signal: AbortSignal) => userHttpAdapter.session(signal),
  logout: () => userHttpAdapter.logout(),
  listProducts: (category: string, signal: AbortSignal) => getProducts(productHttpAdapter, category, signal),
  productDetail: (id: string, signal: AbortSignal) => getProductDetail(productHttpAdapter, id, signal),
};
