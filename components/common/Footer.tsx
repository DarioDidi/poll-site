import { FaGithub } from "react-icons/fa";
import { ThemeSwitcher } from "../theme-switcher"

const Footer: React.FC = () => {
  return (<footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
    <p>
      Powered by{" "}
      <a
        href="https://github.com/DarioDidi"
        target="_blank"
        className="font-bold hover:underline"
        rel="noreferrer"
      >
        DD
      </a>
    </p>
    <a
      href="https://github.com/DarioDidi"
      target="_blank"
      className="font-bold hover:underline"
      rel="noreferrer"
    >
      <FaGithub />
    </a>
    <ThemeSwitcher />
  </footer>
  )
}

export default Footer;
