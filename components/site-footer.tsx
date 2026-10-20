export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Shop. Barcha huquqlar himoyalangan.</p>
        <p>To&apos;lov tizimi — demo rejimida (haqiqiy pul yechilmaydi).</p>
      </div>
    </footer>
  );
}
