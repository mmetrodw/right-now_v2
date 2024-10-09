'use client';

import { doLogin, doSocialLogin } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react"; 
import Logout from "@/components/Logout";

const LoginFrom = () => {
	const [error, setError] = useState(null);
	const router = useRouter();

	const handleOnSubmit = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData(event.currentTarget);
			const response = await doLogin(formData);
			if(!!response?.error) {
				setError(response.error.message);
			} else {
				router.push('/home');
			}
		} catch (error) {
			setError("Check your Credentials");
			console.log(error)
		}
	}

	return (
		<>
			{error && <p>{error}</p>}
			<form onSubmit={handleOnSubmit}>
				<input type="text" name="email" placeholder="Email" />
				<input type="password" name="password" placeholder="Password" />
				<button type="submit">Sign In</button>
			</form>
			<Logout />
		</>
	)
}

export default LoginFrom;