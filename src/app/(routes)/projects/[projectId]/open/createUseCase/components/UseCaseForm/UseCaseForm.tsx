'use client'

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { UseCaseFormProps } from "./UseCaseForm.types"

const FlowSchema = z.object({
  id: z.string(),
  steps: z.array(z.string().min(1, "El paso no puede estar vacío"))
})

const FormSchema = z.object({
  id: z.string().min(1, "El ID es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  inputs: z.array(z.string().min(1, "La entrada no puede estar vacía")).min(1, "Se requiere al menos una entrada"),
  preconditions: z.array(z.string().min(1, "La precondición no puede estar vacía")).min(1, "Se requiere al menos una precondición"),
  postconditions: z.array(z.string().min(1, "La postcondición no puede estar vacía")).min(1, "Se requiere al menos una postcondición"),
  normalFlow: FlowSchema,
  alternateFlows: z.array(FlowSchema)
})

type FormData = z.infer<typeof FormSchema>

export function UseCaseForm(props: UseCaseFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    id: "UC01",
    name: "",
    description: "",
    inputs: [""],
    preconditions: [""],
    postconditions: [""],
    normalFlow: { id: Date.now().toString(), steps: [""] },
    alternateFlows: []
  })
  const [errors, setErrors] = React.useState<z.ZodIssue[]>([])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addItem = (field: 'inputs' | 'preconditions' | 'postconditions') => {
    updateFormData(field, [...formData[field], ""])
  }

  const removeItem = (field: 'inputs' | 'preconditions' | 'postconditions', index: number) => {
    updateFormData(field, formData[field].filter((_, i) => i !== index))
  }

  const updateItem = (field: 'inputs' | 'preconditions' | 'postconditions', index: number, value: string) => {
    updateFormData(field, formData[field].map((item, i) => i === index ? value : item))
  }

  const addStep = (flowType: 'normalFlow' | 'alternateFlows', flowId: string) => {
    if (flowType === 'normalFlow') {
      updateFormData('normalFlow', { ...formData.normalFlow, steps: [...formData.normalFlow.steps, ""] })
    } else {
      updateFormData('alternateFlows', formData.alternateFlows.map(flow => 
        flow.id === flowId ? { ...flow, steps: [...flow.steps, ""] } : flow
      ))
    }
  }

  const removeStep = (flowType: 'normalFlow' | 'alternateFlows', flowId: string, stepIndex: number) => {
    if (flowType === 'normalFlow') {
      updateFormData('normalFlow', { ...formData.normalFlow, steps: formData.normalFlow.steps.filter((_, i) => i !== stepIndex) })
    } else {
      updateFormData('alternateFlows', formData.alternateFlows.map(flow => 
        flow.id === flowId ? { ...flow, steps: flow.steps.filter((_, i) => i !== stepIndex) } : flow
      ))
    }
  }

  const updateStep = (flowType: 'normalFlow' | 'alternateFlows', flowId: string, stepIndex: number, value: string) => {
    if (flowType === 'normalFlow') {
      updateFormData('normalFlow', { ...formData.normalFlow, steps: formData.normalFlow.steps.map((step, i) => i === stepIndex ? value : step) })
    } else {
      updateFormData('alternateFlows', formData.alternateFlows.map(flow => 
        flow.id === flowId ? { ...flow, steps: flow.steps.map((step, i) => i === stepIndex ? value : step) } : flow
      ))
    }
  }

  const addAlternateFlow = () => {
    updateFormData('alternateFlows', [...formData.alternateFlows, { id: Date.now().toString(), steps: [""] }])
  }

  const removeAlternateFlow = (id: string) => {
    updateFormData('alternateFlows', formData.alternateFlows.filter(flow => flow.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = FormSchema.safeParse(formData)
    if (result.success) {
      console.log("Formulario válido:", result.data)
      // Aquí puedes enviar los datos al backend
    } else {
      console.log("Errores de validación:", result.error.issues)
      setErrors(result.error.issues)
    }
  }

  const getFieldError = (field: string) => {
    return errors.find(error => error.path[0] === field)?.message
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen p-6">
      <Card >
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input 
                id="id" 
                value={formData.id} 
                onChange={(e) => updateFormData('id', e.target.value)}
              />
              {getFieldError('id') && <p className="text-red-500 text-sm">{getFieldError('id')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Nombre de caso de uso..."
              />
              {getFieldError('name') && <p className="text-red-500 text-sm">{getFieldError('name')}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Descripción..."
              className=" h-[100px] resize-none"
            />
            {getFieldError('description') && <p className="text-red-500 text-sm">{getFieldError('description')}</p>}
          </div>

          <div className="space-y-2">
            <Label>Entradas</Label>
            {formData.inputs.map((input, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => updateItem('inputs', index, e.target.value)}
                  placeholder="Añadir entrada..."
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem('inputs', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => addItem('inputs')}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
            {getFieldError('inputs') && <p className="text-red-500 text-sm">{getFieldError('inputs')}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Precondiciones</Label>
              {formData.preconditions.map((condition, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={condition}
                    onChange={(e) => updateItem('preconditions', index, e.target.value)}
                    placeholder="Añadir precondición..."
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem('preconditions', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addItem('preconditions')}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
              {getFieldError('preconditions') && <p className="text-red-500 text-sm">{getFieldError('preconditions')}</p>}
            </div>

            <div className="space-y-2">
              <Label>Postcondiciones</Label>
              {formData.postconditions.map((condition, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={condition}
                    onChange={(e) => updateItem('postconditions', index, e.target.value)}
                    placeholder="Añadir postcondición..."
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem('postconditions', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addItem('postconditions')}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
              {getFieldError('postconditions') && <p className="text-red-500 text-sm">{getFieldError('postconditions')}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Flujo Normal</Label>
              <Card className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <Label>Flujo Normal</Label>
                </div>
                {formData.normalFlow.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex gap-2 mt-2">
                    <div className="w-10 flex items-center justify-center">{stepIndex + 1}</div>
                    <Input
                      value={step}
                      onChange={(e) => updateStep('normalFlow', formData.normalFlow.id, stepIndex, e.target.value)}
                      placeholder="Añadir paso..."
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeStep('normalFlow', formData.normalFlow.id, stepIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  onClick={() => addStep('normalFlow', formData.normalFlow.id)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Paso
                </Button>
              </Card>
              {getFieldError('normalFlow') && <p className="text-red-500 text-sm">{getFieldError('normalFlow')}</p>}
            </div>

            <div className="space-y-4">
              <Label className="pr-4">Flujos Alternos</Label>
              {formData.alternateFlows.map((flow, flowIndex) => (
                <Card key={flow.id} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Flujo Alterno {flowIndex + 1}</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAlternateFlow(flow.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {flow.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-2 mt-2">
                      <div className="w-10 flex items-center justify-center">{stepIndex + 1}</div>
                      <Input
                        value={step}
                        onChange={(e) => updateStep('alternateFlows', flow.id, stepIndex, e.target.value)}
                        placeholder="Añadir paso..."
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeStep('alternateFlows', flow.id, stepIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    onClick={() => addStep('alternateFlows', flow.id)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Paso
                  
                  </Button>
                </Card>
              ))}
              <Button type="button" onClick={addAlternateFlow}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Flujo Alterno
              </Button>
              {getFieldError('alternateFlows') && <p className="text-red-500 text-sm">{getFieldError('alternateFlows')}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Guardar Caso de Uso
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}