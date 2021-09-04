<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model.number="ordem"
          type="number"
          label="Ordem do sistema"
          outlined
          hide-details
        />
        <div class="d-flex justify-space-between">
          <v-btn class="mt-4" outlined @click="gerarMatriz">
            Limpar matriz
          </v-btn>
          <v-btn class="mt-4" outlined @click="calcular">Calcular</v-btn>
        </div>
      </v-col>
    </v-row>

    <h1 class="mt-8">Sistema</h1>
    <v-row>
      <v-col>
        <v-row v-for="(row, irow) in valores" :key="irow">
          <v-col v-for="(col, icol) in valores[irow]" :key="icol">
            <v-text-field
              v-model.number="row[icol]"
              type="number"
              outlined
              hide-details
            />
          </v-col>
          <v-divider class="mx-8" vertical />
          <v-col>
            <v-text-field
              v-model.number="coeficientes[irow]"
              type="number"
              outlined
              hide-details
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <h1 class="mt-8">Resultado - {{ resultadoSistema }}</h1>
    <v-row v-for="(etapa, index) in etapas" :key="index">
      <v-col>
        <v-card outlined>
          <v-card-title>
            <div class="d-flex flex-column">
              <span> Pivo: {{ etapa.pivo }} </span>
              <span> Equação: {{ etapa.acao }} </span>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row v-for="(row, irow) in etapa.matriz" :key="irow">
              <v-col v-for="(col, icol) in etapa.matriz[irow]" :key="icol">
                <v-text-field
                  v-model.number="row[icol]"
                  outlined
                  hide-details
                  disabled
                />
              </v-col>
              <v-divider class="mx-8" vertical />
              <v-col>
                <v-text-field
                  v-model.number="etapa.coeficientes[irow]"
                  outlined
                  hide-details
                  disabled
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import cloneDeep from "lodash.clonedeep";

function normalizaMatriz(lista) {
  const tamanho = Number(lista.length);

  for (let row = 0; row < tamanho; row++) {
    for (let col = 0; col < tamanho; col++) {
      if (lista[row][col] === "") {
        lista[row][col] = 0;
      }
    }
  }

  return lista;
}

function normalizaCoeficientes(lista) {
  const tamanho = Number(lista.length);

  for (let row = 0; row < tamanho; row++) {
    if (lista[row] === "") {
      lista[row] = 0;
    }
  }

  return lista;
}

function resolveGauss(A, b) {
  A = cloneDeep(normalizaMatriz(A));
  b = cloneDeep(normalizaCoeficientes(b));
  let etapas = [];
  let tamanho = Number(A.length);

  for (let linha_pivo = 0; linha_pivo < tamanho - 1; linha_pivo++) {
    let pivo_atual = A[linha_pivo][linha_pivo];

    for (let linha = linha_pivo + 1; linha < tamanho; linha++) {
      let multiplicador = A[linha][linha_pivo] / A[linha_pivo][linha_pivo];

      let acao = `L${linha + 1} = L${linha_pivo + 1} - M(${
        A[linha][linha_pivo]
      } / ${A[linha_pivo][linha_pivo]}) * L${linha + 1}`;

      for (let col = linha_pivo; col < tamanho; col++) {
        A[linha][col] = A[linha][col] - multiplicador * A[linha_pivo][col];
      }

      b[linha] = b[linha] - multiplicador * b[linha_pivo];

      etapas.push({
        pivo: pivo_atual,
        acao: acao,
        matriz: cloneDeep(A),
        coeficientes: b,
      });
    }
  }

  return {
    matriz: A,
    coeficientes: b,
    etapas,
  };
}

function resolveSistema(A, b) {
  let tamanho = Number(A.length);
  let resultado = [];

  for (let i = tamanho - 1; i >= 0; i--) {
    resultado[i] = b[i];

    for (let j = i + 1; j < tamanho; j++) {
      resultado[i] = resultado[i] - resultado[j] * A[i][j];
    }

    resultado[i] = resultado[i] / A[i][i];
  }

  return resultado;
}

export default {
  name: "Home",

  data: () => ({
    ordem: 3,
    valores: [],
    coeficientes: [],
    etapas: [],
    resultadoSistema: [],
  }),

  watch: {
    ordem() {
      this.gerarMatriz();
    },
  },

  mounted() {
    this.gerarMatriz();
  },

  methods: {
    gerarMatriz() {
      this.valores = [];
      this.coeficientes = [];
      this.etapas = [];
      this.resultadoSistema = [];
      let tamanho = Number(this.ordem);
      let valores = [];
      let coeficientes = [];

      for (let i = 0; i < tamanho; i++) {
        let linha = [];
        for (let j = 0; j < tamanho; j++) {
          linha.push(0);
        }
        coeficientes.push(0);
        valores.push(linha);
      }

      this.coeficientes = coeficientes;
      this.valores = valores;
    },

    calcular() {
      const resultadoGauss = resolveGauss(this.valores, this.coeficientes);
      const { matriz, coeficientes, etapas } = resultadoGauss;
      const resultadoSistema = resolveSistema(matriz, coeficientes);

      this.etapas = etapas;
      this.resultadoSistema = resultadoSistema;
    },
  },
};
</script>
