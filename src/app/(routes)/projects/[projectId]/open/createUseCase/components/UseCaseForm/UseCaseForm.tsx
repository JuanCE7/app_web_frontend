"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseCaseFormProps } from "./UseCaseForm.types";
import { formSchema } from "./UseCaseForm.form";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { createUseCase } from "../../../useCases.api";
import { Table, TableRow, TableCell } from "@/components/ui/table";

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
interface Flow {
  id: string;
  steps: string[];
}

export function UseCaseForm(props: UseCaseFormProps) {
  const [id, setId] = React.useState("UC01")
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [inputs, setInputs] = React.useState<string[]>([])
  const [preconditions, setPreconditions] = React.useState<string[]>([])
  const [postconditions, setPostconditions] = React.useState<string[]>([])
  const [normalFlows, setNormalFlows] = React.useState<Flow[]>([])
  const [alternateFlows, setAlternateFlows] = React.useState<Flow[]>([])

  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, ""])
  }

  const removeItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const updateItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item))
  }

  const addFlow = (setter: React.Dispatch<React.SetStateAction<Flow[]>>) => {
    setter(prev => [...prev, { id: Date.now().toString(), steps: [] }])
  }

  const removeFlow = (setter: React.Dispatch<React.SetStateAction<Flow[]>>, id: string) => {
    setter(prev => prev.filter(flow => flow.id !== id))
  }

  const addStep = (setter: React.Dispatch<React.SetStateAction<Flow[]>>, flowId: string) => {
    setter(prev => prev.map(flow => 
      flow.id === flowId ? { ...flow, steps: [...flow.steps, ""] } : flow
    ))
  }

  const removeStep = (setter: React.Dispatch<React.SetStateAction<Flow[]>>, flowId: string, stepIndex: number) => {
    setter(prev => prev.map(flow => 
      flow.id === flowId ? { ...flow, steps: flow.steps.filter((_, i) => i !== stepIndex) } : flow
    ))
  }

  const updateStep = (setter: React.Dispatch<React.SetStateAction<Flow[]>>, flowId: string, stepIndex: number, value: string) => {
    setter(prev => prev.map(flow => 
      flow.id === flowId ? { ...flow, steps: flow.steps.map((step, i) => i === stepIndex ? value : step) } : flow
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ id, name, description, inputs, preconditions, postconditions, normalFlows, alternateFlows })
    
    // Aquí normalmente enviarías estos datos a tu backend
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-950 text-white p-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input 
                id="id" 
                value={id} 
                onChange={(e) => setId(e.target.value)}
                className="bg-gray-800 border-gray-700" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de caso de uso..."
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción..."
              className="bg-gray-800 border-gray-700 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Entradas</Label>
            {inputs.map((input, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => updateItem(setInputs, index, e.target.value)}
                  placeholder="Añadir entrada..."
                  className="bg-gray-800 border-gray-700"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem(setInputs, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem(setInputs)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Precondiciones</Label>
              {preconditions.map((condition, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={condition}
                    onChange={(e) => updateItem(setPreconditions, index, e.target.value)}
                    placeholder="Añadir precondición..."
                    className="bg-gray-800 border-gray-700"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(setPreconditions, index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addItem(setPreconditions)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Postcondiciones</Label>
              {postconditions.map((condition, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={condition}
                    onChange={(e) => updateItem(setPostconditions, index, e.target.value)}
                    placeholder="Añadir postcondición..."
                    className="bg-gray-800 border-gray-700"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(setPostconditions, index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addItem(setPostconditions)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Flujo Normal</Label>
              {normalFlows.map((flow, flowIndex) => (
                <Card key={flow.id} className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Flujo {flowIndex + 1}</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFlow(setNormalFlows, flow.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {flow.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-2 mt-2">
                      <div className="w-10 flex items-center justify-center">{stepIndex + 1}</div>
                      <Input
                        value={step}
                        onChange={(e) => updateStep(setNormalFlows, flow.id, stepIndex, e.target.value)}
                        placeholder="Añadir paso..."
                        className="bg-gray-700 border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeStep(setNormalFlows, flow.id, stepIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addStep(setNormalFlows, flow.id)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Paso
                  </Button>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={() => addFlow(setNormalFlows)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Flujo Normal
              </Button>
            </div>

            <div className="space-y-4">
              <Label>Flujos Alternos</Label>
              {alternateFlows.map((flow, flowIndex) => (
                <Card key={flow.id} className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Flujo Alterno {flowIndex + 1}</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFlow(setAlternateFlows, flow.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {flow.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-2 mt-2">
                      <div className="w-10 flex items-center justify-center">{stepIndex + 1}</div>
                      <Input
                        value={step}
                        onChange={(e) => updateStep(setAlternateFlows, flow.id, stepIndex, e.target.value)}
                        placeholder="Añadir paso..."
                        className="bg-gray-700 border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeStep(setAlternateFlows, flow.id, stepIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addStep(setAlternateFlows, flow.id)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Paso
                  </Button>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={() => addFlow(setAlternateFlows)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Flujo Alterno
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">Guardar Caso de Uso</Button>
        </CardContent>
      </Card>
    </form>
  )
}