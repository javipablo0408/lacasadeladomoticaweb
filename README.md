# La Casa de la Domótica

Web corporativa premium para captación de clientes. Instalaciones de domótica a medida con Home Assistant en Madrid.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- next-intl (ES / EN)
- Vercel

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Variables de entorno

Copia `.env.example` a `.env.local` y configura cuando tengas email corporativo:

- `RESEND_API_KEY` — API key de [Resend](https://resend.com)
- `CONTACT_EMAIL` — Email que recibe formularios y newsletter
- `EMAIL_FROM` — Remitente de los emails

Sin estas variables, los formularios funcionan y los datos se registran en consola del servidor.

## Despliegue en Vercel

1. Sube el repositorio a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Añade el dominio `lacasadeladomotica.es`
4. Configura las variables de entorno

```bash
npx vercel
```

## Estructura

- `/` — Inicio (español)
- `/en` — Inicio (inglés)
- `/servicios` — Servicios
- `/home-assistant` — Home Assistant
- `/sobre-nosotros` — Sobre nosotros
- `/contacto` — Formulario de contacto
