import { FaGithubSquare, FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin, FaSquareWhatsapp } from "react-icons/fa6";


export default function Footer() {
  return (
    <div className="flex justify-around items-center w-full p-5 shadow-inner h-[6rem] footer flex-wrap">
      <h2>
        Made with 🤍 by{" "}
        <a
          href="https://dipanshu-06-portfolio.netlify.app/"
          className="font-bold hover:italic hover:font-bold hover:!text-white transition-all duration-200 ease-in-out"
        >
          Dipanshu
        </a>
      </h2>
      <div className="flex justify-around items-center text-4xl space-x-3 ">
        <a
          href="https://www.linkedin.com/in/dipanshu-mishra-696a0622a"
          className="hover:!text-blue-500 transition-all duration-200 ease-in-out hover:scale-105"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/Dipanshu0612"
          className="hover:!text-blue-500 transition-all duration-200 ease-in-out hover:scale-105"
        >
          <FaGithubSquare />
        </a>
        <a
          href="https://api.whatsapp.com/send?phone=918485974624&text=Hello, more information!"
          className="hover:!text-blue-500 transition-all duration-200 ease-in-out hover:scale-105"
        >
          <FaSquareWhatsapp />
        </a>
        <a
          href="https://www.instagram.com/_.dipanshu._06/"
          className="hover:!text-blue-500 transition-all duration-200 ease-in-out hover:scale-105"
        >
          <FaInstagramSquare />
        </a>
      </div>
    </div>
  );
}
