export function Footer() {
  return (
    <footer className="w-full bg-[#E1CE7A] py-6">
      <div className="container mx-auto flex flex-col items-center text-center space-y-2">
        <p className="text-sm text-gray-700">
          This website was built as my final project for learnignfuze coding
          bootcamp and does not include actual purchase or selling functionality
          at this time.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/dxnielperez"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:underline">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/daniel-f-perez/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:underline">
            LinkedIn
          </a>
        </div>
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Daniel Perez. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
