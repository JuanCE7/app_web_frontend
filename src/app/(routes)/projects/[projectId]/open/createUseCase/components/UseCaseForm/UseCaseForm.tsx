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
import { createUseCase } from "../../../useCases.api"
import { FormSchema } from "./UseCaseForm.form"

type FormData = z.infer<typeof FormSchema>

export function UseCaseForm(props: UseCaseFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    displayId: "UC01",
    name: "",
    description: "",
    entries: [""],
    preconditions: [""],
    postconditions: [""],
    mainFlow: { name: Date.now().toString(), steps: [""] },
    alternateFlows: []
  })
  const [errors, setErrors] = React.useState<z.ZodIssue[]>([])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addItem = (field: 'entries' | 'preconditions' | 'postconditions') => {
    updateFormData(field, [...formData[field], ""])
  }

  const removeItem = (field: 'entries' | 'preconditions' | 'postconditions', index: number) => {
    updateFormData(field, formData[field].filter((_, i) => i !== index))
  }

  const updateItem = (field: 'entries' | 'preconditions' | 'postconditions', index: number, value: string) => {
    updateFormData(field, formData[field].map((item, i) => i === index ? value : item))
  }

  const addStep = (flowType: 'mainFlow' | 'alternateFlows', flowId: string) => {
    if (flowType === 'mainFlow') {
      updateFormData('mainFlow', { ...formData.mainFlow, steps: [...formData.mainFlow.steps, ""] })
    } else {
      updateFormData('alternateFlows', formData.alternateFlows.map(flow => 
        flow.name === flowId ? { ...flow, steps: [...flow.steps, ""] } : flow
      ))
    }
  }

  const removeStep = (flowType: 'mainFlow' | 'alternateFlows', flowId: string, stepIndex: number) => {
    if (flowType === 'mainFlow') {
      updateFormData('mainFlow', { ...formData.mainFlow, steps: formData.mainFlow.steps.filter((_, i) => i !== stepIndex) })
    } else {
      updateFormData('alternateFlows', formData.alternateFlows.map(flow => 
        flow.name === flowId ? { ...flow, steps: flow.steps.filter((_, i) => i !== stepIndex) } : flow
      ))
    }
  }

  const updateStep = (flowType: 'mainFlow' | 'alternateFlows', flowId: string, stepIndex: number, value: string) => {
    if (flowType === 'mainFlow') {
      updateFormData('mainFlow', { ...formData.mainFlow, steps: formData.mainFlow.steps.map((step, i) => i === stepIndex ? value : step) })
    } else {
      updateFormData('alternateFlows', formData.alternateFlows.map(flow => 
        flow.name === flowId ? { ...flow, steps: flow.steps.map((step, i) => i === stepIndex ? value : step) } : flow
      ))
    }
  }

  const addAlternateFlow = () => {
    updateFormData('alternateFlows', [...formData.alternateFlows, { id: Date.now().toString(), steps: [""] }])
  }

  const removeAlternateFlow = (id: string) => {
    updateFormData('alternateFlows', formData.alternateFlows.filter(flow => flow.name !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = FormSchema.safeParse(formData)
    if (result.success) {
      console.log("Formulario válido:", result.data)
      createUseCase(result.data)
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
                id="displayId" 
                value={formData.displayId} 
                onChange={(e) => updateFormData('displayId', e.target.value)}
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
            {formData.entries.map((input, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => updateItem('entries', index, e.target.value)}
                  placeholder="Añadir entrada..."
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem('entries', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => addItem('entries')}>
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
                {formData.mainFlow.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex gap-2 mt-2">
                    <div className="w-10 flex items-center justify-center">{stepIndex + 1}</div>
                    <Input
                      value={step}
                      onChange={(e) => updateStep('mainFlow', formData.mainFlow.name, stepIndex, e.target.value)}
                      placeholder="Añadir paso..."
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeStep('mainFlow', formData.mainFlow.name, stepIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  onClick={() => addStep('mainFlow', formData.mainFlow.name)}
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
                <Card key={flow.name} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Flujo Alterno {flowIndex + 1}</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAlternateFlow(flow.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {flow.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-2 mt-2">
                      <div className="w-10 flex items-center justify-center">{stepIndex + 1}</div>
                      <Input
                        value={step}
                        onChange={(e) => updateStep('alternateFlows', flow.name, stepIndex, e.target.value)}
                        placeholder="Añadir paso..."
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeStep('alternateFlows', flow.name, stepIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    onClick={() => addStep('alternateFlows', flow.name)}
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