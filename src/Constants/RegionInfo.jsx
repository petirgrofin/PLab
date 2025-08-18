import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

export const RegionInfo = {
  "AuB": {
    notation: <InlineMath math={"A \\cup B = \\{ x \\mid x \\in A \\text{ o } x \\in B \\}"}/>,
    explanation: (
      <span>
        La <b>unión</b> de dos conjuntos incluye a todos los elementos que están en <InlineMath math={"A"} />, en <InlineMath math={"B"} /> o en ambos. En el contexto de la encuesta, <InlineMath math={"A"} /> representa a quienes practican atletismo y <InlineMath math={"B"} /> a quienes practican baloncesto; entonces <InlineMath math={"A \\cup B"} /> contiene a todas las personas que practican <b>atletismo o baloncesto (o ambos)</b>. Gráficamente, corresponde a las dos circunferencias completas del diagrama de Venn, excluyendo solo la región exterior.
      </span>
    )
  },

  "AiB": {
    notation: <InlineMath math={"A \\cap B = \\{ x \\mid x \\in A \\text{ y } x \\in B \\}"}/>,
    explanation: (
      <span>
        La <b>intersección</b> reúne únicamente los elementos que pertenecen simultáneamente a <InlineMath math={"A"} /> y a <InlineMath math={"B"} />. En la encuesta, <InlineMath math={"A \\cap B"} /> son las personas que practican <b>tanto atletismo como baloncesto</b>. En el diagrama de Venn, es la región de superposición (el lente) entre los dos círculos.
      </span>
    )
  },

  "A": {
    notation: <InlineMath math={"A"}/>,
    explanation: (
      <span>
        En la encuesta, <InlineMath math={"A"} /> es el conjunto de personas que practican <b>atletismo</b> (incluye tanto quienes también practican baloncesto como quienes no).
      </span>
    )
  },

  "B": {
    notation: <InlineMath math={"B"}/>,
    explanation: (
      <span>
        En la encuesta, <InlineMath math={"B"} /> reúne a las personas que practican <b>baloncesto</b> (incluye tanto quienes también practican atletismo como quienes no).
      </span>
    )
  },

  "U": {
    notation: <InlineMath math={"U"}/>,
    explanation: (
      <span>
        En teoría de conjuntos, <InlineMath math={"U"} /> denota el <b>universo</b>: el conjunto de <i>todos los elementos bajo estudio</i>. En la encuesta, <InlineMath math={"U"} /> corresponde a todas las personas encuestadas, sin importar si practican atletismo, baloncesto, ambos o ninguno. En un diagrama de Venn, se dibuja como el rectángulo que contiene los círculos.
      </span>
    )
  },

  "AdB": {
    notation: <InlineMath math={"A \\setminus B = \\{ x \\mid x \\in A \\text{ y } x \\notin B \\}"}/>,
    explanation: (
      <span>
        En teoría de conjuntos, la <b>diferencia</b> <InlineMath math={"A \\setminus B"} /> es el conjunto de elementos que están en <InlineMath math={"A"} /> y <b>no</b> están en <InlineMath math={"B"} />. En la encuesta, esto representa a las personas que practican <b>solo atletismo</b>. En el diagrama de Venn, es la parte exclusiva del círculo de <InlineMath math={"A"} />.
      </span>
    )
  },

  "BdA": {
    notation: <InlineMath math={"B \\setminus A = \\{ x \\mid x \\in B \\text{ y } x \\notin A \\}"}/>,
    explanation: (
      <span>
        En teoría de conjuntos, <InlineMath math={"B \\setminus A"} /> contiene los elementos que están en <InlineMath math={"B"} /> y <b>no</b> están en <InlineMath math={"A"} />. En la encuesta, son las personas que practican <b>solo baloncesto</b>. En el diagrama de Venn, corresponde a la parte exclusiva del círculo de <InlineMath math={"B"} />.
      </span>
    )
  },

  "A'": {
    notation: <InlineMath math={"A' = U \\setminus A = \\{ x \\mid x \\notin A \\}"}/>,
    explanation: (
      <span>
        En teoría de conjuntos, el <b>complemento</b> de <InlineMath math={"A"} /> (en <InlineMath math={"U"} />) es el conjunto de todos los elementos que <b>no</b> pertenecen a <InlineMath math={"A"} />. En la encuesta, <InlineMath math={"A'"} /> incluye a quienes practican solo baloncesto o a quienes no practican ninguno de los dos deportes. Gráficamente, es todo lo que queda fuera del círculo de <InlineMath math={"A"} />.
      </span>
    )
  },

  "B'": {
    notation: <InlineMath math={"B' = U \\setminus B = \\{ x \\mid x \\notin B \\}"}/>,
    explanation: (
      <span>
        En teoría de conjuntos, el <b>complemento</b> de <InlineMath math={"B"} /> (en <InlineMath math={"U"} />) es el conjunto de elementos que <b>no</b> están en <InlineMath math={"B"} />. En la encuesta, <InlineMath math={"B'"} /> incluye a quienes practican solo atletismo o a quienes no practican ninguno de los dos deportes. En el diagrama, es todo lo que queda fuera del círculo de <InlineMath math={"B"} />.
      </span>
    )
  },

  "(AuB)'": {
    notation: <InlineMath math={"(A \\cup B)'"}/>,
    explanation: (
      <span>
        En teoría de conjuntos, el <b>complemento de la unión</b> <InlineMath math={"(A \\cup B)'"} /> está formado por los elementos que no pertenecen ni a <InlineMath math={"A"} /> ni a <InlineMath math={"B"} />. Por las leyes de De Morgan: <InlineMath math={"(A \\cup B)' = A' \\cap B'"} />. En la encuesta, representa a las personas que <b>no practican ni atletismo ni baloncesto</b>. En el diagrama de Venn, es la región exterior a ambos círculos.
      </span>
    )
  },

  "(AiB)'": {
    notation: <InlineMath math={"(A \\cap B)'"}/>,
    explanation: (
      <span>
        El <b>complemento de la intersección</b> <InlineMath math={"(A \\cap B)'"} /> contiene todos los elementos que <b>no</b> están simultáneamente en <InlineMath math={"A"} /> y <InlineMath math={"B"} />. Por las leyes de De Morgan: <InlineMath math={"(A \\cap B)' = A' \\cup B'"} />. En la encuesta, representa a las personas que <b>no practican ambos deportes</b> (pueden practicar solo uno o ninguno). En el diagrama de Venn, es todo excepto la región de superposición.
      </span>
    )
  },

  "(AdB)'": {
    notation: <InlineMath math={"(A \\setminus B)'"}/>,
    explanation: (
      <span>
        El <b>complemento de la diferencia</b> <InlineMath math={"(A \\setminus B)'"} /> contiene todos los elementos que <b>no</b> están en <InlineMath math={"A \\setminus B"} />. Esto incluye a las personas que <b>solo practican baloncesto o ambos deportes o ninguno</b>. En el diagrama de Venn, es la región fuera de la parte exclusiva de <InlineMath math={"A"} />.
      </span>
    )
  },

  "(BdA)'": {
    notation: <InlineMath math={"(B \\setminus A)'"}/>,
    explanation: (
      <span>
        El <b>complemento de la diferencia</b> <InlineMath math={"(B \\setminus A)'"} /> incluye todos los elementos que <b>no</b> están en <InlineMath math={"B \\setminus A"} />. Esto abarca a las personas que <b>solo practican atletismo, ambos deportes o ninguno</b>. En el diagrama de Venn, es la región fuera de la parte exclusiva de <InlineMath math={"B"} />.
      </span>
    )
  },

  "empty": {
    notation: <InlineMath math={"\\varnothing"}/>,
    explanation: (
      <span>
        En teoría de conjuntos, <InlineMath math={"\\varnothing"} /> es el <b>conjunto vacío</b>: no contiene elementos. En la encuesta, aparecería si ninguna persona cumple cierta condición (por ejemplo, si no hay nadie que practique exactamente ambos deportes y además satisfaga otra restricción adicional).
      </span>
    )
  }
};
