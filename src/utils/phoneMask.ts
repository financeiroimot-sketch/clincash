export function maskPhone(phone: string) {
  const value = phone.toString().replace(/\D/g, "");
  let foneFormatado: string = "";

  if (value.length > 10) {
    foneFormatado = value.replace(/(\d{2})?(\d{5})?(\d{4})/, "($1) $2-$3");
  } else if (value.length > 9) {
    foneFormatado = value.replace(/(\d{2})?(\d{4})?(\d{4})/, "($1) $2-$3");
  } else if (value.length > 5) {
    foneFormatado = value.replace(/^(\d{2})?(\d{4})?(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 1) {
    foneFormatado = value.replace(/^(\d{2})?(\d{0,5})/, "($1) $2");
  } else if (phone !== "") {
    foneFormatado = value.replace(/^(\d*)/, "($1");
  }

  return foneFormatado;
}

export function unmaskPhone(phone: string): string {
  return phone.replace(/[()-\s]/g, "");
}
