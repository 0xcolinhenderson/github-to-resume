import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[var(--highlight)] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-white text-lg font-bold">RepoToResume</span>
        <div className="flex space-x-4">
          <Link href="/">
            <span className="text-gray-300 hover:text-white">Home</span>
          </Link>
          <Link href="/faq">
            <span className="text-gray-300 hover:text-white">FAQ</span>
          </Link>
          <Link href="https://colinhenderson.dev">
            <span className="text-gray-300 hover:text-white">Contact</span>
          </Link>
          <Link href="https://github.com/0xcolinhenderson/github-to-resume">
            <span className="text-gray-300 hover:text-white">Source</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;