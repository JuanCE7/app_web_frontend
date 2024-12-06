import { Loader2 } from 'lucide-react'

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-2 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Cargando...</h2>
        <p className="text-sm text-muted-foreground">
          Por favor, espere mientras se cargan los datos.
        </p>
      </div>
    </div>
  )
}

