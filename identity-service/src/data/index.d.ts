interface SignUpInput {
  username: string;
  email: string;
  password: string;
  profileUrl?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export { SignUpInput, LoginInput };
