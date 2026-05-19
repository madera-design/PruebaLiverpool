# Prueba Liverpool - Pokemon Browse

Aplicacion React en JavaScript que simula una experiencia de browse/search para productos de Liverpool usando PokeAPI como servicio REST.

## Tecnologias

- React con Vite
- JavaScript
- React Router
- Redux Toolkit y React Redux
- CSS responsivo sin framework UI
- Vitest, Jest y Testing Library
- PokeAPI: https://pokeapi.co/
- json-server para backend simulado opcional

## Funcionalidades Implementadas

- Catalogo inicial de productos al entrar a `/products`.
- Busqueda por nombre de Pokemon.
- Grid responsive con tarjetas de producto.
- Tarjeta con nombre, imagen y precio simulado en MXN.
- Navegacion al detalle con `/products/:productName`.
- Detalle con imagen grande, precio, tipos, altura, peso y habilidades.
- Estado global con Redux.
- Cache en Redux para evitar llamadas repetidas a PokeAPI.
- Scroll infinito para cargar siguientes paginas del catalogo inicial.
- Loaders, skeletons, empty states y manejo de errores con reintento.
- Login local con sesion persistida en `localStorage`.
- Rutas protegidas para catalogo y detalle.
- Backend simulado con `json-server` para enriquecer productos destacados.
- Pruebas automatizadas con Vitest y Jest para auth, rutas protegidas y componentes clave.
- Formulario dinamico consumido desde Mocki con inputs generados por configuracion.
- Ruta 404.

## Instalacion

```bash
npm install
```

## Ejecucion En Desarrollo

```bash
npm run dev
```

La aplicacion queda disponible normalmente en:

```bash
http://127.0.0.1:5173
```

Para activar informacion personalizada del backend simulado, abre otra terminal y ejecuta:

```bash
npm run server
```

El servidor queda disponible en:

```bash
http://localhost:3001/productExtras
```

## Scripts

```bash
npm run dev
npm run server
npm run build
npm run lint
npm run test
npm run test:jest
npm run test:watch
npm run preview
```

## Rutas

- `/` redirige a `/login`
- `/login` muestra el inicio de sesion
- `/products` muestra el catalogo y busqueda, requiere sesion
- `/products/:productName` muestra el detalle del producto, requiere sesion
- `/formulario` muestra el formulario dinamico, requiere sesion
- `*` muestra pagina 404

## Acceso De Prueba

El login es local para fines de la prueba tecnica. Puedes usar los valores precargados:

```bash
Correo: usuario@liverpool.com
Contrasena: liverpool123
```

Solo esas credenciales son validas para ingresar. La sesion se conserva con `localStorage` para simular persistencia basica, y las rutas protegidas rechazan accesos sin sesion valida.

## Decisiones Tecnicas

PokeAPI no incluye precios, por lo que la aplicacion genera un precio estable usando datos del Pokemon como experiencia base y altura. Esto permite cumplir el requerimiento de mostrar titulo y precio sin depender de datos inventados manualmente.

El estado de productos vive en Redux Toolkit. Se guardan los productos visibles, un mapa normalizado por nombre y metadata de ultima actualizacion. Con esto, las busquedas y el detalle reutilizan datos previamente cargados cuando existen en cache.

La autenticacion vive en un slice independiente de Redux. Las rutas de catalogo y detalle usan un componente `ProtectedRoute` para redirigir a `/login` cuando el usuario no tiene sesion.

El scroll infinito se implementa con `IntersectionObserver` y la paginacion nativa de PokeAPI. Durante busquedas exactas por nombre se desactiva, ya que ese flujo devuelve un unico producto.

`json-server` se usa como backend simulado en `db.json` para enriquecer algunos productos con descripcion comercial, marca, categoria, rating, stock y etiquetas. La integracion es tolerante a fallos: si el servidor local no esta activo, la app sigue funcionando con PokeAPI.

El formulario dinamico consume la configuracion desde Mocki y renderiza campos segun `type`. Soporta `text`, `number`, `date`, `select` y `checkbox`; ademas valida los campos marcados como `required` o `mandatory` antes de simular el envio.

La capa de acceso a PokeAPI esta aislada en `src/services/pokeApi.js`, mientras que los componentes visuales se mantienen reutilizables en `src/components`.

## Estructura Principal

```bash
src/
  app/
    store.js
  components/
    Loader.jsx
    DynamicForm.jsx
    Modal.jsx
    ProductCard.jsx
    ProductGridSkeleton.jsx
    ProtectedRoute.jsx
    SearchBar.jsx
    StatusMessage.jsx
  features/
    auth/
      authSlice.js
    products/
      productsSlice.js
  pages/
    FormPage.jsx
    LoginPage.jsx
    NotFoundPage.jsx
    ProductDetailPage.jsx
    ProductListPage.jsx
  services/
    dynamicFormApi.js
    pokeApi.js
    productExtrasApi.js
```

Tambien existe `db.json` en la raiz del proyecto para los datos del backend simulado.

## Validacion

Antes de entregar, ejecutar:

```bash
npm run lint
npm run test
npm run test:jest
npm run build
```

La suite actual de Vitest cubre:

- Reducer de autenticacion.
- Redireccion de rutas protegidas.
- Render de tarjeta de producto.
- Interacciones basicas del buscador.

La suite adicional de Jest + React Testing Library cubre:

- Reducer de autenticacion.
- Redireccion de rutas protegidas.
- Render de tarjeta de producto.
- Interacciones y estado deshabilitado del buscador.

## Analisis De Cumplimiento

### Requerimientos Obligatorios

| Requerimiento | Estado | Implementacion |
| --- | --- | --- |
| App React con JavaScript | Completo | Vite + React, sin TypeScript |
| Lista de productos | Completo | `/products` carga catalogo inicial desde PokeAPI |
| Busqueda de productos | Completo | Busqueda exacta por nombre de Pokemon |
| Grid de tarjetas | Completo | `ProductCard` muestra imagen, titulo y precio |
| Click a detalle | Completo | React Router navega a `/products/:productName` |
| Detalle de producto | Completo | Imagen grande, precio, tipos, medidas, habilidades y extras |
| Integracion REST API | Completo | PokeAPI y backend local opcional con json-server |
| Manejo de errores API | Completo | Mensajes de error y acciones de reintento |
| UI responsive | Completo | CSS adaptable para mobile y desktop |
| Uso de Redux | Completo | Store con slices de auth y products |
| Documentacion | Completo | README con instalacion, ejecucion, rutas y decisiones |

### Deseables Evaluados

| Deseable | Estado | Implementacion |
| --- | --- | --- |
| Home/Login | Completo | `/login` como primera vista |
| Bloqueo a usuarios no logueados | Completo | `ProtectedRoute` protege catalogo y detalle |
| Modularidad | Completo | Componentes, pages, services, slices y helpers separados |
| Seguridad y roles | Parcial | Login local con credenciales validadas, sesion persistida y rol `viewer`; no hay permisos diferenciados por pantalla |
| Performance | Completo | Cache normalizada en Redux y reutilizacion de resultados |
| Feedback UX | Completo | Loaders, skeletons, empty states y errores |
| Scroll infinito | Completo | `IntersectionObserver` + paginacion de PokeAPI |
| json-server | Completo | `db.json` agrega datos personalizados |
| Pruebas | Parcial | Unit/component tests con Vitest y Jest; faltan mocks de integracion PokeAPI |

## Tareas Sugeridas Para Cerrar Al 100%

1. **Roles de usuario**
   - Agregar rol `admin` y `viewer` al login local.
   - Mostrar acciones distintas segun rol, por ejemplo ver stock solo como admin.
   - Proteger rutas futuras con permisos por rol.

2. **Mocks de integracion**
   - Mockear `fetch` para PokeAPI y json-server.
   - Probar flujo completo de catalogo: carga inicial, busqueda, error y detalle.
   - Cubrir scroll infinito con `IntersectionObserver` mockeado.

3. **Mejora de busqueda**
   - Soportar busqueda parcial usando el catalogo cacheado.
   - Agregar debounce para busquedas futuras.
   - Mostrar sugerencias cuando no exista coincidencia exacta.

4. **Persistencia avanzada**
   - Guardar cache de productos en `localStorage` o `sessionStorage`.
   - Invalidar cache por tiempo.
   - Evitar recargar primeras paginas si el usuario vuelve al catalogo.

5. **Calidad visual final**
   - Revisar contraste y accesibilidad con Lighthouse.
   - Validar navegacion por teclado.
   - Revisar capturas mobile y desktop antes de entrega.

## Mejoras Deseables Pendientes

- Ampliar pruebas de integracion con mocks de PokeAPI.
