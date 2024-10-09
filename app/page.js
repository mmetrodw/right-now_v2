import { auth } from "@/auth"
import LoginFrom from "@/components/LoginForm";

export default async function Home() {
	const session = await auth();
	if(session) console.log(session)
  return (
    <div>
      <h1>Home</h1>
      <LoginFrom />
			<h2>{session?.user?.name}</h2>
    </div>
  );
}
