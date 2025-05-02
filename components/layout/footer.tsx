export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          Built with Next.js, OpenAI, and Tailwind CSS. All images are generated using AI.
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-right">
          &copy; {new Date().getFullYear()} AI Image Creator
        </p>
      </div>
    </footer>
  );
}