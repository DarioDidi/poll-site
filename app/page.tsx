import { AuthButton } from "@/components/auth-components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import PollList from "@/components/polls/PollsList";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-6xl mb-4">Welcome to your fave Polls Site</h2>
            {user ? "" :
              <section className="mx-auto text-center">
                < p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
                  Sign in to participate:
                </p>

                <AuthButton />
              </section>
            }

            <PollList />
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main >
  );
}
