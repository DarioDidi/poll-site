import { EnvVarWarning } from "@/components/auth-components/env-var-warning";
import { AuthButton } from "@/components/auth-components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Home</Link>
          <Link href={"/polls/create"}>Create Poll</Link>
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
      </div>
    </nav>
  )
}

export default NavBar;
