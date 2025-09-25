import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Theme:</span>
        <ThemeToggle />
      </div>
    </div>
  );
}