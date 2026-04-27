import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const PageLayout = ({ children, showFooter = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a22] via-[#2d6645] to-[#83B698] font-dm-sans flex flex-col">
      {children}
      {showFooter && (
        <footer className="py-6 text-center">
          <a
            href="https://linktr.ee/faiichannn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 text-xs hover:text-white transition-colors duration-200"
          >
            develop by @faiichannn 🐶
          </a>
        </footer>
      )}
    </div>
  );
};

export default PageLayout;
