import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';

export default function CookiePolicyRedirect() {
  redirect(routes.cookies());
}
