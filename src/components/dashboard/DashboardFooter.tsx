export function DashboardFooter() {
  return (
    <footer className="bg-secondary/50 border-t border-border py-4">
      <div className="container-wide">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} VisionBoard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
