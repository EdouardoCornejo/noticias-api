# Buscador de Noticias

Aplicación en **React + Vite** para consultar los **titulares más recientes por categoría** usando [NewsAPI](https://newsapi.org). La interfaz está construida con **Material UI** y la API key **nunca llega al navegador**: el frontend solo habla con una función serverless propia (`/api/news`) que hace de proxy hacia NewsAPI.

**Demo:** https://noticias-api-woad.vercel.app

![Tech](https://img.shields.io/badge/React-18-61DAFB)
![Tech](https://img.shields.io/badge/Vite-8-646CFF)
![Tech](https://img.shields.io/badge/Material_UI-5-007FFF)
![Tech](https://img.shields.io/badge/Axios-HTTP-5A29E4)
![Tech](https://img.shields.io/badge/Vercel-Functions-black)

---

## Tabla de contenidos

- [Buscador de Noticias](#buscador-de-noticias)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos](#requisitos)
    - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Scripts](#scripts)
    - [Despliegue en Vercel](#despliegue-en-vercel)
  - [Endpoint](#endpoint)
  - [Cómo funciona](#cómo-funciona)
    - [1. `api/news.js`](#1-apinewsjs)
    - [2. `vite.config.js`](#2-viteconfigjs)
    - [3. `src/context/NoticiasProvider.jsx`](#3-srccontextnoticiasproviderjsx)
    - [4. Componentes](#4-componentes)
    - [Flujo de la aplicación](#flujo-de-la-aplicación)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- Muestra los **titulares principales** de NewsAPI filtrados por categoría: General, Negocios, Entretenimiento, Salud, Ciencia, Deportes y Tecnología.
- **Paginación** de 20 noticias por página, limitada a los primeros **100 resultados** (límite del plan gratuito de NewsAPI).
- Cada noticia se muestra en una tarjeta con imagen (si existe), fuente, título, descripción y enlace **"Leer Noticia"** que abre el artículo original en otra pestaña.
- Descarta los artículos que NewsAPI marca como `"[Removed]"`.
- Muestra un mensaje de error si la consulta falla.
- **API key protegida**: vive solo en el servidor, dentro de la función `api/news.js`.
- Puede **incrustarse en un `<iframe>`** (cabecera `frame-ancestors *` en `vercel.json`).

---

## Cómo ejecutar el proyecto

### Requisitos

- **Node.js 20.19+ o 22.12+** (requerido por Vite 8).
- Una API key gratuita de NewsAPI: https://newsapi.org/register

### Instalación

```bash
npm install
cp .env.example .env
```

### Variables de entorno

| Variable       | Descripción                                    |
| -------------- | ---------------------------------------------- |
| `NEWS_API_KEY` | API key de NewsAPI. Solo se lee en el servidor. |

```bash
NEWS_API_KEY=tu_api_key_de_newsapi
```

`.env` está en `.gitignore` y nunca debe subirse al repositorio.

### Scripts

| Comando           | Descripción                                               |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo de Vite (incluye `/api/news`)      |
| `npm run build`   | Build de producción en `dist/`                            |
| `npm run preview` | Previsualiza el build de producción                       |

### Despliegue en Vercel

1. Importa el proyecto en Vercel (preset de framework: Vite).
2. Añade la variable `NEWS_API_KEY` en **Settings → Environment Variables**.
3. Despliega. La carpeta `api/` se publica automáticamente como función serverless.

---

## Endpoint

| Método | Ruta        | Parámetros                                         | Respuesta                      |
| ------ | ----------- | -------------------------------------------------- | ------------------------------ |
| `GET`  | `/api/news` | `category` (por defecto `general`), `page` (`1`–`5`, por defecto `1`) | `{ totalResults, articles }` |

Códigos de error:

| Código | Motivo                                              |
| ------ | --------------------------------------------------- |
| `400`  | Categoría no válida o página fuera de rango         |
| `500`  | `NEWS_API_KEY` no configurada                       |
| otro   | Se reenvía el estado y el mensaje de error de NewsAPI |

Las respuestas correctas se cachean en el CDN con `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`.

---

## Cómo funciona

### 1. `api/news.js`

Función serverless (formato Web `Request`/`Response`) que exporta `GET`:

- Lee `NEWS_API_KEY` de `process.env`; si falta, responde `500`.
- Valida `category` contra la lista `CATEGORIAS` y `page` como entero entre `1` y `MAX_PAGINA`.
- Llama a `https://newsapi.org/v2/top-headlines` con `country = PAIS` y envía la key en la cabecera `X-Api-Key`.
- Devuelve solo `totalResults` y `articles`, con cabeceras de caché.

### 2. `vite.config.js`

Define el plugin `newsApi()`, que en desarrollo monta un middleware en `/api/news` y reutiliza **la misma función `GET`** que usa Vercel. También carga `NEWS_API_KEY` desde `.env` con `loadEnv`, de modo que `npm run dev` funciona sin la CLI de Vercel.

### 3. `src/context/NoticiasProvider.jsx`

Estado global con Context API:

- Estados: `categoria`, `noticias`, `pagina`, `totalNoticias` y `error`.
- Un `useEffect` consulta `/api/news` con **axios** cada vez que cambian `categoria` o `pagina`, y cancela la petición anterior con un `AbortController`.
- `handleChangeCategoria` cambia la categoría y vuelve a la página 1; `handleOnchangePagina` cambia de página.
- El hook `useNoticias` (`src/hooks/useNoticias.jsx`) expone el contexto a los componentes.

### 4. Componentes

- **`Formulario`**: `Select` de Material UI con las 7 categorías (etiquetas en español).
- **`ListadoNoticias`**: título, mensaje de error, paginación arriba y abajo (`Math.ceil(Math.min(totalNoticias, 100) / 20)` páginas) y la cuadrícula de noticias.
- **`Noticia`**: tarjeta (`Card`) con imagen, fuente, título, descripción y enlace al artículo.

### Flujo de la aplicación

```
main.jsx
  └─ <App>
       └─ <NoticiasProvider>            → estado: categoria, pagina, noticias…
            ├─ <Formulario>             → handleChangeCategoria() (pagina = 1)
            └─ <ListadoNoticias>        → handleOnchangePagina()
                 └─ <Noticia> × N

useEffect([categoria, pagina])
  └─ axios.get('/api/news?category=…&page=…')
        ↓
   api/news.js → GET()
     ├─ valida category y page
     ├─ fetch newsapi.org/v2/top-headlines (X-Api-Key)
     └─ { totalResults, articles }
        ↓
   setNoticias() / setTotalNoticias()  → re-render de la lista
```

---

## Tecnologías

- **React 18** — componentes funcionales, hooks y Context API.
- **Vite 8** — servidor de desarrollo y build, con un plugin propio para `/api/news`.
- **Material UI 5** (+ Emotion) — `Container`, `Grid`, `Select`, `Card`, `Pagination`…
- **Axios** — peticiones HTTP con cancelación vía `AbortController`.
- **Vercel Functions** — proxy serverless hacia NewsAPI.
- **NewsAPI** — fuente de los titulares.

---

## Estructura del proyecto

```
noticias-api/
├── api/
│   └── news.js                  # Función serverless: proxy a NewsAPI
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Formulario.jsx       # Selector de categoría
│   │   ├── ListadoNoticias.jsx  # Lista + paginación
│   │   └── Noticia.jsx          # Tarjeta de una noticia
│   ├── context/
│   │   └── NoticiasProvider.jsx # Estado global y consulta a /api/news
│   ├── hooks/
│   │   └── useNoticias.jsx      # Acceso al contexto
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .vercelignore
├── index.html
├── package.json
├── vercel.json                  # Cabeceras (iframe y seguridad)
└── vite.config.js               # Plugin que sirve /api/news en desarrollo
```

---

## Personalización

| Dónde                          | Constante    | Significado                                        | Valor actual |
| ------------------------------ | ------------ | -------------------------------------------------- | ------------ |
| `api/news.js`                  | `CATEGORIAS` | Categorías aceptadas por el proxy                  | 7 categorías |
| `api/news.js`                  | `PAIS`       | País de los titulares                              | `"us"`       |
| `api/news.js`                  | `MAX_PAGINA` | Página máxima permitida                            | `5`          |
| `src/components/Formulario.jsx`| `CATEGORIAS` | Opciones del selector (valor + etiqueta)           | 7 categorías |

> NewsAPI ya no devuelve titulares para México (`country=mx`), por eso se usa `"us"`. Si añades una categoría, hazlo en ambas listas `CATEGORIAS`. El plan Developer de NewsAPI está pensado para desarrollo; revisa sus [precios](https://newsapi.org/pricing) antes de usarlo en producción.

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
