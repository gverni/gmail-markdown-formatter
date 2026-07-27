import EmailFormatter from "@/components/EmailFormatter";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="mx-auto flex w-[80%] max-w-[80%] flex-1 flex-col px-4 py-10 sm:px-6">
        <EmailFormatter />
      </main>
      <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted sm:px-6">
        Formatting runs entirely in your browser. Email content is never uploaded
        or stored.
      </footer>
    </div>
  );
}
