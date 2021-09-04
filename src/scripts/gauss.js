let matrizA = [
  [2, 3, -1, 4],
  [-1, 2, 7, 6],
  [4, 9, 8, 7],
  [1, 1, 2, 2],
];

let b = [5, 3, 9, -1];

function resolveGauss(A, b) {
  let tamanho = Number(A.length);

  for (let linha_pivo = 0; linha_pivo < tamanho - 1; linha_pivo++) {
    console.log(`Pivo: Matriz[${linha_pivo}][${linha_pivo}]`);

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

    resultado[i] = resultado[i] / matriz[i][i];
  }

  return resultado;
}

const { matriz, coeficientes } = resolveGauss(matrizA, b);

console.table(matriz);
console.table(coeficientes);
console.table(resolveSistema(matriz, coeficientes));
