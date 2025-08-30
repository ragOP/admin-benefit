export const isAdmin = (id) => {
  console.log("id >>>", id);
  const role = localStorage.getItem("role");
  console.log("role >>>", role);

  // prod
  // return role === "admin";

  // hot fix
  return id === "68b2e2f6254442f9db4ae935";
};
