# El esqueleto del dragón (`dragon-rig.bin`)

El dragón del landing (`app/components/journey/SnakeCanvas.tsx`) vuela con un
**esqueleto de 24 huesos**. El GLB (`public/models/dragon2-opt.glb`) es una sola
malla densa de Tripo: **no trae armature, ni skin, ni clips de animación**, así
que el esqueleto se deriva de la geometría.

Ese rig es el mismo que se diseñó en el proyecto de Claude Design
**"Ximo Dragon Rigged"**; aquí está portado al landing.

## Por qué hay un `.bin` y no se calcula en el navegador

Derivar el esqueleto es caro. Medido sobre esta malla (193.382 vértices):

| etapa | ms |
|---|---|
| voxelizar | 44 |
| flood fill exterior | 255 |
| BFS de profundidad | 378 |
| BFS geodésico | 50 |
| centerline → 24 joints | 9 |
| pesos de skin | 633 |
| **total** | **~1.369 ms** |

1,4 s de main thread bloqueado en escritorio (y 4–8 s en un móvil de gama media)
para un resultado que es **idéntico para todos los visitantes**, porque la malla
es un asset fijo. Así que se hornea una sola vez, offline.

## Qué contiene el `.bin` (~190 KB)

No guarda los pesos de skin (serían 4,6 MB). Guarda solo lo mínimo del que los
pesos son función pura, así que el cliente los reconstruye **idénticos** en
~145 ms:

```
"XRIG" | version u32 | vertexCount u32 | jointCount u32 | bodyLength f32
       | joints  f32[jointCount * 3]
       | seedJoint u8[vertexCount]
```

El `seedJoint` es la única pieza que el cliente no puede recalcular barato: sale
del campo geodésico y ancla la ventana de 11 joints candidatos de cada vértice.
Con eso, `joints` y `bodyLength`, el cliente saca los 4 joints más cercanos, les
aplica el peso gaussiano (sigma = 1,5 segmentos) y normaliza — exactamente lo
mismo que hizo el horneado.

> `seedJoint` va indexado **por vértice**, así que el `.bin` solo sirve para la
> malla exacta contra la que se horneó. Si cambias el GLB hay que rehornear;
> `buildRiggedDragon` lanza un error explícito si los conteos no coinciden.

## Cómo rehornear

```bash
node scripts/dragon-rig/serve-bake.js
```

Abre <http://localhost:4322/bake.html>. Corre el pipeline completo contra
`public/models/dragon2-opt.glb` y escribe `public/models/dragon-rig.bin`
directo en disco. La página imprime los joints, el histograma de seeds y los
tiempos por etapa.

Si cambias de modelo, actualiza `MODEL_URL` en `bake.html` **y** en
`SnakeCanvas.tsx`.

## La animación

"Follow-the-leader": la cabeza recorre un bucle cerrado Catmull-Rom (1,65 largos
de cuerpo) y cada joint detrás se ancla a su distancia de reposo exacta del que
va delante, así ningún segmento se estira ni se amontona. Encima corre una onda
serpentina que baja por el cuerpo (cabeza → cuello → torso → cola).

Todo esto vive dentro del grupo del dragón, así que **la espiral del viaje y la
entrada cinemática siguen intactas**: el dragón vuela su bucle mientras el bucle
entero desciende con el scroll.

Constantes en `SnakeCanvas.tsx`: `FLIGHT_AMP`, `FLIGHT_WAV`, `FLIGHT_FIT`
(tamaño del bucle en unidades de mundo) y `RIG_ROOT`.
