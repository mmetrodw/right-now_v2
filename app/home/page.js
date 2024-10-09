import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Logout from "@/components/Logout";

const HomePage = async () => {
	const session = await auth();
	if(session) console.log(session)

	if(!session?.user) redirect('/');
	return (
		<div>
			<h1>Home Page</h1>
			<h2>{session.user?.name}</h2>
			<p>Home page content</p>
			<Logout />
		</div>
	)
}

export default HomePage;