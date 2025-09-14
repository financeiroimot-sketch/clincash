export default function useGetUser() {
  const email = sessionStorage.getItem("clin-cash-user-email");
  return email;
}
