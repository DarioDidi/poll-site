import { EnvVarWarning } from "@/components/auth-components/env-var-warning";
import { AuthButton } from "@/components/auth-components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const NavBar = async () => {
  const supabase = await createClient();
  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Home</Link>
          {
            user ?
              <>
                <Link href={"/polls/create"}>Create Poll</Link>
                <Link href={`/polls/user/${user.id}`}>Your Polls</Link>
              </>
              : ""
          }
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
      </div>
    </nav>
  )
}

export default NavBar;
