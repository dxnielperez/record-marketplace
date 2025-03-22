export function Footer() {
  return (
    <footer className="w-[300px] mx-auto py-6 text-sm bg-snow">
      <div className="text-center flex justify-around py-2">
        <a
          href="https://github.com/dxnielperez"
          target="_blank"
          rel="noopener noreferrer">
          Github
        </a>
        <a
          href="https://linkedin.com/in/daniel-f-perez/"
          target="_blank"
          rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="https://dxniel.dev" target="_blank" rel="noopener noreferrer">
          Website
        </a>
      </div>
      <p className="mx-auto w-min whitespace-nowrap">
        &copy; {new Date().getFullYear()} Daniel Perez.
      </p>
    </footer>
  );
}
