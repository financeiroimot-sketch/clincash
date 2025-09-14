export function maskCPF(cpf: string): string {
  const value = cpf.toString().replace(/\D/g, '').slice(0, 11);
  let cpfFormatado = '';

  if (value.length > 9) {
    cpfFormatado = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (value.length > 6) {
    cpfFormatado = value.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (value.length > 3) {
    cpfFormatado = value.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
  } else {
    cpfFormatado = value;
  }

  return cpfFormatado;
}

export function maskCNPJ(cnpj: string): string {
  const value = cnpj.toString().replace(/\D/g, '').slice(0, 14);
  let cnpjFormatado = '';

  if (value.length > 12) {
    cnpjFormatado = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  } else if (value.length > 8) {
    cnpjFormatado = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
  } else if (value.length > 5) {
    cnpjFormatado = value.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (value.length > 2) {
    cnpjFormatado = value.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
  } else {
    cnpjFormatado = value;
  }

  return cnpjFormatado;
}

export function unmask(document: string): string {
  return document.replace(/[.\-\/]/g, '');
}

