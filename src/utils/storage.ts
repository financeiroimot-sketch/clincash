const userKey = "clin-cash-user-uid";
const empresaKey = "pulsar-leads-empresa-id";

export function setUserUid(uid: string) {
  sessionStorage.setItem(userKey, uid);
}

export function getUserUid() {
  return sessionStorage.getItem(userKey);
}

export function setEmpresaId(id: string) {
  sessionStorage.setItem(empresaKey, id);
}

export function getEmpresaId() {
  return sessionStorage.getItem(empresaKey);
}
