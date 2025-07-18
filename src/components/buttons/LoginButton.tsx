export default function LoginButton() {
  return (
    <a href="/api/auth/login/github">
      <button className="button text-white shadow-solid">
        <span>Log in with GitHub</span>
      </button>
    </a>
  );
}
