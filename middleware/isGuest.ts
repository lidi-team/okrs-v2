import { getTokenCookie } from '@/utils/cookies';

export default function ({ redirect }) {
  const token = getTokenCookie();
  if (token) {
    return redirect('/');
  }
}
