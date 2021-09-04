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
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-text>
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
function resolveGauss(A, b) {
  let tamanho = Number(A.length);

  for (let linha_pivo = 0; linha_pivo < tamanho - 1; linha_pivo++) {
    // console.log(`Pivo: Matriz[${linha_pivo}][${linha_pivo}]`);

    for (let linha = linha_pivo + 1; linha < tamanho; linha++) {
      let multiplicador = A[linha][linha_pivo] / A[linha_pivo][linha_pivo];

      for (let col = linha_pivo; col < tamanho; col++) {
        A[linha][col] = A[linha][col] - multiplicador * A[linha_pivo][col];
      }

      b[linha] = b[linha] - multiplicador * b[linha_pivo];
    }
  }

  return {
    matriz: A,
    coeficientes: b,
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
    resultadoMatriz: [],
    resultadoCoeficientes: [],
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
      const { matriz, coeficientes } = resultadoGauss;
      const resultadoSistema = resolveSistema(matriz, coeficientes);

      this.resultadoMatriz = matriz;
      this.resultadoCoeficientes = coeficientes;
      this.resultadoSistema = resultadoSistema;
    },
  },
};
</script>
