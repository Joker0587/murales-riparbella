import { Redis } from '@upstash/redis';

const VISIT_KEY = 'murales-riparbella:public-visits';
const COOKIE_NAME = 'mr_visit_counted';

function hasRedisConfig() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function hasVisitCookie(req) {
  const cookie = req.headers.cookie || '';
  return cookie.split(';').some((item) => item.trim().startsWith(`${COOKIE_NAME}=`));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!hasRedisConfig()) {
    return res.status(200).json({
      configured: false,
      count: null,
      message: 'Upstash Redis non configurato'
    });
  }

  try {
    const redis = Redis.fromEnv();
    let count;

    if (req.method === 'POST') {
      if (!hasVisitCookie(req)) {
        count = await redis.incr(VISIT_KEY);
        res.setHeader(
          'Set-Cookie',
          `${COOKIE_NAME}=1; Max-Age=86400; Path=/; SameSite=Lax; Secure`
        );
      } else {
        count = Number(await redis.get(VISIT_KEY) || 0);
      }
    } else if (req.method === 'GET') {
      count = Number(await redis.get(VISIT_KEY) || 0);
    } else {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ configured: true, error: 'Metodo non consentito' });
    }

    return res.status(200).json({ configured: true, count });
  } catch (error) {
    console.error('Counter error', error);
    return res.status(500).json({
      configured: true,
      count: null,
      error: 'Errore contatore'
    });
  }
}
