import { AuthButton } from "@/components/auth-components/auth-button";
import UserPolls from "@/components/polls/UserPolls";
import { createClient } from "@/lib/supabase/server";

export default async function UserPage() {
	const supabase = await createClient();

	// You can also use getUser() which will be slower.
	//const { data } = await supabase.auth.getClaims();
	//const user = data?.claims;
	const { data: { user } } = await supabase.auth.getUser()
	return (
		<main className="min-h-screen flex flex-col items-center">
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				<div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
					<main className="flex-1 flex flex-col gap-6 px-4">
						<h2 className="font-medium text-4xl mb-4">View your Polls {user?.email}</h2>
						{user ?
							<UserPolls />
							:
							<section className="mx-auto text-center">
								< p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
									Sign in to participate:
								</p>
								<AuthButton />
							</section>
						}
					</main>
				</div>
			</div>
		</main >
	);
}
